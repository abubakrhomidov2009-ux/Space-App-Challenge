import { globeMissionIds, missions, orbitExhibits, type MissionId } from './missions';
import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { disposeModel, normalizeModel } from './models';

export type Destination = 'moon' | 'mars' | 'space';
type World = Destination | 'earth';
type ModelStatus = 'loading' | 'ready' | 'error';
export type SceneStatus = Record<World, ModelStatus>;
export type SceneInput = { destination: Destination; moon: number; mars: number; space: number; dragging: boolean; resumeAt: number; mission: MissionId | null; missionCovered: boolean; switchDirection?: -1 | 1 };

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

  let exploreTop = 0;
  let finaleTop = 0;
  function measureScroll() {
    exploreTop = explore?.getBoundingClientRect().top ?? 0;
    finaleTop = finale?.getBoundingClientRect().top ?? Infinity;
  }
  measureScroll();
  window.addEventListener('scroll', measureScroll, { passive: true });
  window.addEventListener('resize', measureScroll);

  let lastFrame = 0;
  let scroll = 1 - exploreTop / window.innerHeight;
  let ending = finaleTop / window.innerHeight;
  let displayed = input.destination;
  let slideDirection = 1;
  const handoff = { moon: 0, mars: 0, space: 0 };
  let zoom = 0;
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

  renderer.setAnimationLoop((time) => {
    const dt = Math.min(0.05, (time - lastFrame) / 1000);
    lastFrame = time;
    if (input.missionCovered) return;

    ensure(input.destination);
    if (standalone && input.destination === 'space') ensure('earth');
    if (!standalone && models.moon && exploreTop < height * 0.6) ensure('mars');
    if (finaleTop < height * 1.1) ensure('earth');

    const still = reduced.matches;
    const scrollTarget = 1 - exploreTop / height;
    const endingTarget = finaleTop / height;
    scroll = still ? scrollTarget : damp(scroll, scrollTarget, 11, dt);
    ending = standalone ? 2 : still ? endingTarget : damp(ending, endingTarget, 11, dt);
    if (models[input.destination] && displayed !== input.destination) {
      slideDirection = input.switchDirection ?? 1;
      displayed = input.destination;
    }

    const arrival = standalone ? 1 : still ? Number(scroll >= 0.55) : smoothstep(scroll, 0.04, 1);
    // Leave room for the outgoing globe to recede before Earth's horizon enters.
    const departure = still ? Number(ending < 0.35) : 1 - smoothstep(ending, 0.33, 0.94);
    const earthArrival = still ? departure : 1 - smoothstep(ending, -0.04, 0.48);
    const radius = Math.min(width * 0.49, height * 0.48);
    const horizonRadius = Math.max(width * 0.66, height * 0.59);

    for (const world of ['moon', 'mars', 'space'] as const) {
      const active = displayed === world;
      handoff[world] = still ? Number(active) : damp(handoff[world], Number(active), 4.5, dt);
      const prominence = smoothstep(handoff[world], 0, 1);
      const group = groups[world];
      const risingRadius = lerp(horizonRadius, radius, arrival);
      group.visible = prominence > 0.001 && arrival > 0.001 && departure < 0.999 && (!still || departure === 0);
      group.scale.setScalar(risingRadius * (world === 'space' ? 0.77 : 1) * lerp(0.53, 1, prominence) * lerp(1, 0.18, departure));
      group.position.set(
        width * (1 - prominence) * (active ? 0.75 : -0.29) * slideDirection,
        -(risingRadius + height * 0.46) * (1 - arrival) + height * departure * 0.26,
        -850 * (1 - prominence) - 900 * departure,
      );
      if (active && group.visible && !still && !input.dragging && !input.mission && zoom < 0.03 && time >= input.resumeAt) {
        input[world] -= dt * 0.085;
      }
      // Start each frame from the browsing pose, including zero roll.
      // Slerping toward a mission can change all three Euler angles.
      group.rotation.set(0.1, input[world], 0);
    }

    if (input.mission) zoomedMission = input.mission;
    const zoomTarget = Number(Boolean(input.mission));
    zoom = still ? 0 : damp(zoom, zoomTarget, 3, dt);
    if (Math.abs(zoomTarget - zoom) < 0.0001) zoom = zoomTarget;
    groups[displayed].updateMatrixWorld(true);
    for (const { id, world, point } of sites) {
      const group = groups[world];
      const marker = markers[id];
      if (!marker) continue;
      if (displayed !== world || input.destination !== world || input.mission || zoom >= 0.03) {
        marker.hidden = true;
        continue;
      }
      site.copy(point).applyMatrix4(group.matrixWorld);
      globeCenter.setFromMatrixPosition(group.matrixWorld);
      marker.hidden = !(models[world] && group.visible && arrival > 0.95 && departure < 0.06
        && (world === 'space' ? site.z > globeCenter.z || Math.hypot(site.x - globeCenter.x, site.y - globeCenter.y) > group.scale.x * 0.69 : site.z - globeCenter.z > group.scale.x * 0.2));
      if (!marker.hidden) {
        marker.style.left = `${width / 2 + site.x}px`;
        marker.style.top = `${height / 2 - site.y}px`;
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
    } else {
      camera.position.x = 0;
      camera.position.y = 0;
    }

    const earth = groups.earth;
    earth.visible = earthArrival > 0.01 && Boolean(models.earth);
    const earthRadius = Math.max(width * 0.66, height * 0.68);
    earth.scale.setScalar(earthRadius);
    earth.position.set(0, -earthRadius - height * lerp(0.51, -0.05, earthArrival), lerp(-840, -90, earthArrival));
    earth.rotation.set(0.22, still ? 0.7 : 0.7 + 0.22 * earthArrival, -0.24);
    if (standalone && groups.space.visible && models.earth) {
      earth.visible = true;
      earth.scale.setScalar(groups.space.scale.x * 0.68);
      earth.position.copy(groups.space.position);
      earth.rotation.set(0.14, input.space, -0.24);
    }
    stars.position.y = still ? 0 : 95 * arrival + 140 * departure;
    stars.material.opacity = lerp(1, 0.48, earthArrival);
    stars.material.transparent = true;
    renderer.render(scene, camera);
  });

  return () => {
    disposed = true;
    requests.abort();
    draco.dispose();
    window.removeEventListener('scroll', measureScroll);
    window.removeEventListener('resize', measureScroll);
    resize.disconnect();
    renderer.setAnimationLoop(null);
    for (const model of Object.values(models)) disposeModel(model);
    atmosphere.geometry.dispose();
    atmosphere.material.dispose();
    stars.geometry.dispose();
    stars.material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
