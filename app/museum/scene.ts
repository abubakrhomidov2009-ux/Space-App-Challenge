import { globeMissionIds, missions, orbitExhibits, type MissionId } from './missions';
import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { disposeModel, normalizeModel } from './models';
import { hubLayout } from '../library/hub-layout';

export type Destination = 'moon' | 'mars' | 'space';
type World = Destination | 'earth';
type ModelStatus = 'loading' | 'ready' | 'error';
export type SceneStatus = Record<World, ModelStatus>;
export type SceneInput = { destination: Destination; moon: number; mars: number; space: number; dragging: boolean; hovering: boolean; resumeAt: number; mission: MissionId | null; missionCovered: boolean; switchDirection?: -1 | 1;
  // Library entrance: all three worlds stand side by side. `focus` brings one to the centre,
  // `hover` lifts the one under the pointer.
  hub?: boolean; focus?: Destination | null; hover?: Destination | null;
  // How far the camera closes in on `mission` (1 is all the way, the default).
  zoomTo?: number };

const { lerp, smoothstep, damp } = THREE.MathUtils;

function createStars() {
  let seed = 114;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];

  for (let i = 0; i < 1100; i += 1) {
    positions.push((random() - 0.5) * 3600, (random() - 0.5) * 2400, -1100);
    const brightness = 0.14 + random() ** 3 * 0.65;
    colors.push(brightness * 0.86, brightness * 0.92, brightness);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({
    size: 1.45, sizeAttenuation: false, vertexColors: true,
  }));
}

export function mountScene(
  host: HTMLDivElement,
  explore: HTMLElement | null,
  finale: HTMLElement | null,
  input: SceneInput,
  markers: Partial<Record<MissionId, HTMLButtonElement>>,
  onStatus: (world: World, status: ModelStatus) => void,
) {
  const standalone = explore === null;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.matchMedia('(pointer: coarse)').matches ? 1.25 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#060608', 1550, 2140);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 3500);
  camera.position.z = 1500;

  const stars = createStars();
  stars.material.fog = false;
  const key = new THREE.DirectionalLight('#fff7ec', 4.1);
  key.position.set(-7, 5, 3);
  const rim = new THREE.DirectionalLight('#aec8ff', 0.85);
  rim.position.set(6, 1, -2);
  const fill = new THREE.AmbientLight('#dde5fb', 0.14);
  scene.add(stars, key, rim, fill);

  const groups = { moon: new THREE.Group(), mars: new THREE.Group(), earth: new THREE.Group(), space: new THREE.Group() };
  scene.add(...Object.values(groups));

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.007, 64, 32),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec3 surfaceNormal;
        void main() {
          surfaceNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 surfaceNormal;
        void main() {
          vec3 n = normalize(surfaceNormal);
          float edge = pow(1.0 - clamp(n.z, 0.0, 1.0), 4.6);
          float light = smoothstep(-0.4, 0.85, dot(n, normalize(vec3(-0.55, 0.8, 0.1))));
          gl_FragColor = vec4(0.34, 0.53, 0.79, edge * light * 0.6);
        }
      `,
    }),
  );
  groups.earth.add(atmosphere);

  // A soft halo just beyond the limb of a world, brightest on the sunlit side.
  // The shell is drawn from the inside (back faces), so only the ring outside the planet shows.
  const HALO = 1.075;
  const halos = ([
    ['moon', [0.74, 0.8, 0.95], 0.26],
    ['mars', [0.9, 0.5, 0.32], 0.26],
  ] as const).map(([world, color, strength]) => {
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(HALO, 48, 24),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        uniforms: { tint: { value: new THREE.Color(...color) }, strength: { value: strength }, limb: { value: Math.sqrt(1 - 1 / (HALO * HALO)) } },
        vertexShader: `
          varying vec3 shellNormal;
          void main() {
            shellNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 tint;
          uniform float strength;
          uniform float limb;
          varying vec3 shellNormal;
          void main() {
            vec3 n = normalize(shellNormal);
            // 1 at the planet's edge, 0 at the outer edge of the shell.
            float ring = clamp(abs(n.z) / limb, 0.0, 1.0);
            float falloff = pow(ring, 2.4);
            float light = smoothstep(-0.5, 0.8, dot(n, normalize(vec3(-0.55, 0.8, 0.1)))) * 0.8 + 0.2;
            gl_FragColor = vec4(tint, falloff * light * strength);
          }
        `,
      }),
    );
    groups[world].add(halo);
    return halo;
  });
  const models: Partial<Record<World, THREE.Group>> = {};
  const loading = new Set<World>();
  const loader = new GLTFLoader();
  const draco = new DRACOLoader().setDecoderPath('/draco/').setWorkerLimit(1);

  const requests = new AbortController();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let disposed = false;

  async function load(world: World) {
    const response = await fetch(world === 'space' ? '/models/hubble.glb' : `/models/${world}-1k.glb`, {
      mode: 'cors',
      priority: 'high',
      signal: requests.signal,
    });
    if (!response.ok) throw new Error(`Model request failed: ${response.status}`);
    const bytes = await response.arrayBuffer();
    if (disposed) return;
    if (world === 'space') loader.setDRACOLoader(draco);
    const { scene: asset } = await loader.parseAsync(bytes, '/models/');
    if (disposed) {
      disposeModel(asset);
      return;
    }

    if (world === 'earth') {
      asset.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return;
        for (const material of [node.material].flat()) {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.emissiveIntensity *= 0.28;
            material.color.multiplyScalar(3.3);
          }
        }
      });
    }

    const normalized = normalizeModel(asset);
    if (world === 'space') {
      for (const [index, exhibit] of orbitExhibits.entries()) {
        const telescope = new THREE.Group();
        telescope.position.fromArray(exhibit.position);
        telescope.scale.setScalar(0.11);
        telescope.rotation.set(0.32, -0.4, index % 2 === 0 ? -0.28 : 0.36);
        // Clones share geometry and materials. The original owns their disposal.
        telescope.add(normalized.clone());
        groups.space.add(telescope);
      }
    } else {
      groups[world].add(normalized);
    }
    models[world] = normalized;
    onStatus(world, 'ready');
  }

  function ensure(world: World) {
    if (loading.has(world)) return;
    loading.add(world);
    void load(world).catch(() => {
      if (!disposed) onStatus(world, 'error');
    });
  }

  let width = 1;
  let height = 1;
  const resize = new ResizeObserver(() => {
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height);
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
  });
  resize.observe(host);

  // Section positions are measured in the page once (and when the layout changes), then
  // turned into viewport positions from scrollY every frame. Reading layout on every scroll
  // event forced a reflow mid-scroll, and the value arrived a frame after the page had moved.
  let exploreDocTop = 0;
  let finaleDocTop = Infinity;
  let exploreTop = 0;
  let finaleTop = Infinity;
  function measureLayout() {
    exploreDocTop = explore ? explore.getBoundingClientRect().top + window.scrollY : 0;
    finaleDocTop = finale ? finale.getBoundingClientRect().top + window.scrollY : Infinity;
  }
  function readScroll() {
    exploreTop = exploreDocTop - window.scrollY;
    finaleTop = finaleDocTop - window.scrollY;
  }
  measureLayout();
  readScroll();
  const layoutWatch = new ResizeObserver(measureLayout);
  if (explore?.parentElement) layoutWatch.observe(explore.parentElement);
  window.addEventListener('resize', measureLayout);

  let lastFrame = 0;
  let scroll = 1 - exploreTop / window.innerHeight;
  let ending = finaleTop / window.innerHeight;
  let displayed = input.destination;
  let slideDirection = 1;
  // The standalone globe page: the planet rises in once its model is ready instead of popping in.
  let entryIn = standalone && !reduced.matches ? 0 : 1;
  let markerIn = 0;
  let hubFocus = 0;
  let hubReadyAt = 0;
  const startedAt = performance.now();
  const hubHover = { moon: 0, mars: 0, space: 0 };
  const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
  const soft = (value: number) => value * value * value * (value * (value * 6 - 15) + 10);
  const handoff = { moon: 0, mars: 0, space: 0 };
  handoff[input.destination] = 1;
  // The first screen shows the Moon's limb rising over the bottom edge. This eases it in
  // once its model is ready, and the scroll then lifts it into the full globe.
  let heroIn = 0;
  let starsIn = still0() ? 1 : 0;
  function still0() { return reduced.matches; }
  // Pointer parallax: -1..1 across the window, eased, plus a very slow idle drift.
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  const onPointer = (event: PointerEvent) => {
    targetX = (event.clientX / width - 0.5) * 2;
    targetY = (event.clientY / height - 0.5) * 2;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });
  let zoom = 0;
  // Share of the idle spin speed. Eases to 0 over a point and back to 1 after.
  let spin = 1;
  let zoomedMission: MissionId = 'lunokhod';
  const sites = globeMissionIds.map((id) => {
    const mission = missions[id];
    if (mission.world === 'space') {
      const exhibit = orbitExhibits.find((entry) => entry.id === id)!;
      return { id, world: mission.world, point: new THREE.Vector3().fromArray(exhibit.position) };
    }
    const latitude = THREE.MathUtils.degToRad(mission.latitude);
    // The Mars GLB puts the centre of its map 72° west of the model's +Z axis.
    const longitude = THREE.MathUtils.degToRad(mission.longitude - (mission.world === 'mars' ? 72 : 0));
    return {
      id, world: mission.world,
      point: new THREE.Vector3(
        Math.cos(latitude) * Math.sin(longitude),
        Math.sin(latitude),
        Math.cos(latitude) * Math.cos(longitude),
      ),
    };
  });
  const site = new THREE.Vector3();
  const globeCenter = new THREE.Vector3();
  const startSite = new THREE.Vector3();
  const siteDirection = new THREE.Vector3();
  const viewDirection = new THREE.Vector3(0, 0, 1);
  const turnToFront = new THREE.Quaternion();
  const facingRotation = new THREE.Quaternion();
  ensure(input.destination);

  // Adaptive resolution: if the device cannot keep up, render fewer pixels. It only ever steps
  // down, in small steps, down to one pixel per CSS pixel, so a fast device keeps full sharpness.
  let sampleMs = 0;
  let sampleFrames = 0;

  renderer.setAnimationLoop((time) => {
    const frameMs = time - lastFrame;
    // Ignore the long gaps of a hidden tab or a story that pauses the scene.
    if (frameMs > 0 && frameMs < 250 && !input.missionCovered) {
      sampleMs += frameMs;
      sampleFrames += 1;
      if (sampleFrames === 60) {
        const ratio = renderer.getPixelRatio();
        if (sampleMs / 60 > 30 && ratio > 1) {
          renderer.setPixelRatio(Math.max(1, ratio - 0.25));
          renderer.setSize(width, height);
        }
        sampleMs = 0;
        sampleFrames = 0;
      }
    }
    const dt = Math.min(0.05, (time - lastFrame) / 1000);
    lastFrame = time;
    if (input.missionCovered) return;
    readScroll();

    ensure(input.destination);
    if (input.hub) for (const world of ['moon', 'mars', 'space', 'earth'] as const) ensure(world);
    if (standalone && input.destination === 'space') ensure('earth');
    if (!standalone && models.moon && exploreTop < height * 0.6) ensure('mars');
    if (finaleTop < height * 1.1) ensure('earth');

    const still = reduced.matches;
    const scrollTarget = 1 - exploreTop / height;
    const endingTarget = finaleTop / height;
    scroll = still ? scrollTarget : damp(scroll, scrollTarget, 22, dt);
    ending = standalone ? 2 : still ? endingTarget : damp(ending, endingTarget, 22, dt);
    if (models[input.destination] && displayed !== input.destination) {
      slideDirection = input.switchDirection ?? 1;
      displayed = input.destination;
    }

    const arrival = standalone ? 1 : still ? Number(scroll >= 0.55) : smoothstep(scroll, 0.04, 1);
    // Leave room for the outgoing globe to recede before Earth's horizon enters.
    const departure = still ? Number(ending < 0.35) : 1 - smoothstep(ending, 0.33, 0.94);
    const earthArrival = still ? departure : 1 - smoothstep(ending, -0.04, 0.48);
    // Opening sequence: the stars come up first, the text follows (CSS), and only then does the
    // planet rise. Whichever world is chosen keeps standing on the horizon back at the top.
    const introDelay = time > 700;
    heroIn = still ? Number(Boolean(models[displayed])) : damp(heroIn, models[displayed] && introDelay ? 1 : 0, 1.4, dt);
    // Once the planet is clearly on its way up, the text may appear.
    if (heroIn > 0.3 && host.parentElement?.dataset.intro !== 'up') host.parentElement?.setAttribute('data-intro', 'up');
    entryIn = still || !standalone ? 1 : damp(entryIn, models[displayed] ? 1 : 0, 2.4, dt);
    const entry = soft(clamp01(entryIn));
    starsIn = still ? 1 : damp(starsIn, 1, 1.8, dt);
    const horizon = standalone ? 0 : smoothstep(heroIn, 0, 1);
    pointerX = still ? 0 : damp(pointerX, targetX, 3, dt);
    pointerY = still ? 0 : damp(pointerY, targetY, 3, dt);
    const driftX = still ? 0 : pointerX + Math.sin(time / 5200) * 0.22;
    const driftY = still ? 0 : pointerY + Math.cos(time / 6400) * 0.16;
    const radius = Math.min(width * 0.49, height * 0.48);
    const horizonRadius = Math.max(width * 0.66, height * 0.59);

    spin = still ? 0 : damp(spin, input.hovering ? 0 : 1, input.hovering ? 3 : 1.6, dt);
    const hubSlots = hubLayout(width, height);
    hubFocus = still ? Number(Boolean(input.focus)) : damp(hubFocus, input.focus ? 1 : 0, 4.2, dt);
    // The worlds appear together, one after another, only once every model has loaded. Parsing a
    // model mid-animation would stall the frames, so nothing moves while they are still arriving.
    if (input.hub && !hubReadyAt && ((models.moon && models.mars && models.space && models.earth) || time - startedAt > 9000)) hubReadyAt = time;
    const hubEase = smoothstep(hubFocus, 0, 1);
    for (const world of ['moon', 'mars', 'space'] as const) {
      if (input.hub) {
        const slot = hubSlots[world];
        const own = input.focus === world;
        const order = world === 'moon' ? 0 : world === 'mars' ? 1 : 2;
        const reveal = !hubReadyAt || !models[world] ? 0 : still ? 1 : clamp01((time - hubReadyAt - order * 140) / 1100);
        hubHover[world] = still ? 0 : damp(hubHover[world], input.hover === world && !input.focus ? 1 : 0, 6, dt);
        const show = soft(reveal);
        // The chosen world grows into the middle of the view; the others ease away and dim out.
        const grow = own ? hubEase : 0;
        const fade = own ? 1 : 1 - hubEase;
        const size = lerp(slot.r, radius * 0.92, grow) * (1 + 0.045 * hubHover[world]) * lerp(0.72, 1, show) * fade;
        const hubGroup = groups[world];
        hubGroup.visible = show > 0.002 && fade > 0.002;
        hubGroup.scale.setScalar(Math.max(size * (world === 'space' ? lerp(1.32, 0.77, grow) : 1), 0.001));
        hubGroup.position.set(
          lerp(slot.x, 0, grow) + (own ? 0 : slot.x * 0.3 * hubEase) - driftX * 8,
          lerp(slot.y, 0, grow) - driftY * 5 - (1 - show) * height * 0.04,
          -500 * (1 - fade),
        );
        if (hubGroup.visible && !still && !input.mission && zoom < 0.03) input[world] -= dt * 0.085 * (1 - 0.7 * hubHover[world]);
        hubGroup.rotation.set(0.1, input[world], 0);
        continue;
      }
      const active = displayed === world;
      handoff[world] = still ? Number(active) : damp(handoff[world], Number(active), 4.5, dt);
      const prominence = smoothstep(handoff[world], 0, 1);
      const group = groups[world];
      const risingRadius = lerp(horizonRadius, radius, arrival);
      const heroVisible = horizon > 0.001 && active;
      group.visible = prominence > 0.001 && (arrival > 0.001 || heroVisible) && departure < 0.999 && (!still || departure === 0);
      // The outgoing globe shrinks to nothing as it leaves, so it never has to pop out of view.
      const presence = still ? 1 : smoothstep(prominence, 0, 0.3);
      group.scale.setScalar(risingRadius * (world === 'space' ? 0.77 : 1) * lerp(0.53, 1, prominence) * lerp(1, 0.18, departure) * presence * lerp(0.84, 1, entry));
      group.position.set(
        width * (1 - prominence) * (active ? 0.75 : -0.29) * slideDirection - driftX * 11,
        -(risingRadius + height * 0.46) * (1 - arrival) + height * 0.25 * horizon * (1 - arrival) - height * 0.3 * (1 - horizon) * (1 - arrival) + height * departure * 0.26 + driftY * 7 - height * 0.1 * (1 - entry),
        -850 * (1 - prominence) - 900 * departure,
      );
      if (active && group.visible && !still && !input.dragging && !input.mission && zoom < 0.03 && time >= input.resumeAt) {
        input[world] -= dt * 0.085 * spin;
      } else if (!active && group.visible && !still && !input.mission) {
        // A globe that is leaving keeps turning instead of freezing before it goes.
        input[world] -= dt * 0.085;
      }
      // Start each frame from the browsing pose, including zero roll.
      // Slerping toward a mission can change all three Euler angles.
      group.rotation.set(0.1, input[world], 0);
    }

    if (input.mission) zoomedMission = input.mission;
    const zoomTarget = input.mission ? input.zoomTo ?? 1 : 0;
    zoom = still ? 0 : damp(zoom, zoomTarget, 3, dt);
    if (Math.abs(zoomTarget - zoom) < 0.0001) zoom = zoomTarget;
    if (input.hub) for (const world of ['moon', 'mars', 'space'] as const) groups[world].updateMatrixWorld(true);
    else groups[displayed].updateMatrixWorld(true);
    // Points arrive late and slowly (about a second) once the globe is at rest, and leave quickly.
    const markersReady = handoff[displayed] > 0.9 && entryIn > 0.9 && arrival > 0.9 && departure < 0.06;
    markerIn = still ? Number(markersReady) : damp(markerIn, markersReady ? 1 : 0, markersReady ? 5.5 : 9, dt);
    for (const { id, world, point } of sites) {
      const group = groups[world];
      const marker = markers[id];
      if (!marker) continue;
      if (input.hub || displayed !== world || input.destination !== world || input.mission || zoom >= 0.03) {
        marker.hidden = true;
        continue;
      }
      site.copy(point).applyMatrix4(group.matrixWorld);
      globeCenter.setFromMatrixPosition(group.matrixWorld);
      // A point eases into view as its side of the globe turns toward us, instead of popping on.
      const facing = world === 'space'
        ? Number(site.z > globeCenter.z || Math.hypot(site.x - globeCenter.x, site.y - globeCenter.y) > group.scale.x * 0.69)
        : smoothstep(site.z - globeCenter.z, group.scale.x * 0.1, group.scale.x * 0.3);
      const shown = models[world] && group.visible ? markerIn * facing : 0;
      marker.hidden = shown < 0.01;
      if (!marker.hidden) {
        marker.style.opacity = String(shown);
        marker.style.scale = String(lerp(0.55, 1, smoothstep(shown, 0, 1)));
        // Apollo 11 and Surveyor 5 landed close together. Separate their hit areas
        // on the globe while keeping both surface points for the camera zoom.
        const nearbyMarkerOffset = markers.surveyor5
          ? id === 'apollo' ? 26 : id === 'surveyor5' ? -26 : 0
          : 0;
        // A compositor-driven translate keeps sub-pixel motion smooth,
        // unlike left/top, which re-lays out the marker every frame.
        marker.style.translate = `${width / 2 + site.x}px ${height / 2 - site.y + nearbyMarkerOffset}px`;
      }
    }

    // Turn the selected site toward the camera along the shortest arc.
    const approach = smoothstep(zoom, 0, 1);
    const magnification = lerp(1, 3.5, approach);
    if (camera.zoom !== magnification) {
      camera.zoom = magnification;
      camera.updateProjectionMatrix();
    }
    if (approach > 0) {
      const target = sites.find(({ id }) => id === zoomedMission)!;
      const group = groups[target.world];
      startSite.copy(target.point).applyMatrix4(group.matrixWorld);
      siteDirection.copy(target.point).applyQuaternion(group.quaternion).normalize();
      turnToFront.setFromUnitVectors(siteDirection, viewDirection);
      facingRotation.multiplyQuaternions(turnToFront, group.quaternion);
      group.quaternion.slerp(facingRotation, approach);
      group.updateMatrixWorld(true);
      site.copy(target.point).applyMatrix4(group.matrixWorld);

      // Magnification should not push the selected site back toward the edge.
      const screenOffset = (1 - approach) / magnification;
      camera.position.x = site.x - startSite.x * screenOffset;
      camera.position.y = site.y - startSite.y * screenOffset;
      // On the library entrance, a point marks the site the camera is closing in on.
      const mark = input.hub ? markers[zoomedMission] : undefined;
      if (mark) {
        mark.hidden = false;
        mark.style.opacity = String(smoothstep(approach, 0.1, 0.45));
        mark.style.translate = `${width / 2 + (site.x - camera.position.x) * magnification}px ${height / 2 - (site.y - camera.position.y) * magnification}px`;
      }
    } else {
      camera.position.x = 0;
      camera.position.y = 0;
      if (input.hub) for (const mark of Object.values(markers)) mark.hidden = true;
    }

    const earth = groups.earth;
    earth.visible = earthArrival > 0.01 && Boolean(models.earth);
    const earthRadius = Math.max(width * 0.66, height * 0.68);
    earth.scale.setScalar(earthRadius);
    earth.position.set(0, -earthRadius - height * lerp(0.51, -0.05, earthArrival), lerp(-840, -90, earthArrival));
    earth.rotation.set(0.22, still ? 0.7 : 0.7 + 0.22 * earthArrival, -0.24);
    if (standalone && groups.space.visible && models.earth) {
      earth.visible = true;
      earth.scale.setScalar(groups.space.scale.x * 0.8);
      earth.position.copy(groups.space.position);
      earth.rotation.set(0.14, input.space, -0.24);
    }
    stars.position.y = still ? 0 : 95 * arrival + 140 * departure - driftY * 3;
    stars.position.x = still ? 0 : driftX * 5;
    stars.material.opacity = lerp(1, 0.48, earthArrival) * starsIn;
    // Brighter, larger stars on the first screen, easing back as the globes take over.
    stars.material.size = lerp(2.1, 1.45, smoothstep(arrival, 0, 0.6));
    stars.material.transparent = true;
    renderer.render(scene, camera);
  });

  return () => {
    disposed = true;
    requests.abort();
    draco.dispose();
    layoutWatch.disconnect();
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('resize', measureLayout);
    resize.disconnect();
    renderer.setAnimationLoop(null);
    for (const model of Object.values(models)) disposeModel(model);
    atmosphere.geometry.dispose();
    atmosphere.material.dispose();
    for (const halo of halos) {
      halo.geometry.dispose();
      halo.material.dispose();
    }
    stars.geometry.dispose();
    stars.material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
