import { notFound } from 'next/navigation';
import { missionIds, missions } from '../../museum/missions';
import { categoryIds } from '../categories';
import Library from '../library';

export function generateStaticParams() {
  return [...categoryIds, ...missionIds].map((id) => ({ id }));
}

export default async function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = categoryIds.find((item) => item === id);
  if (category) return <Library category={category} />;
  const missionId = missionIds.find((item) => item === id);
  if (!missionId) notFound();
  return <Library mission={missions[missionId]} />;
}
