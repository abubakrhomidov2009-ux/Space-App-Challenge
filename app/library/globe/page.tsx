import type { Metadata } from 'next';
import Globe from './globe';

export const metadata: Metadata = { title: 'Глобус — TMAS' };

export default async function GlobePage({ searchParams }: {
  searchParams: Promise<{ world?: string }>;
}) {
  const { world } = await searchParams;
  return <Globe initialWorld={world === 'mars' || world === 'space' ? world : 'moon'} />;
}
