import FogHost from './fog-host';

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FogHost />
    </>
  );
}
