import Museum from './museum/museum';

export default function Home() {
  return (
    <>
      <link rel="preload" href="/models/moon-1k.glb" as="fetch" crossOrigin="anonymous" fetchPriority="high" />
      <Museum />
    </>
  );
}
