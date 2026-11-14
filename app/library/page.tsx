import type { Metadata } from 'next';
import Library from './library';

export const metadata: Metadata = { title: 'Библиотека — TMAS' };

export default function LibraryPage() {
  return <Library />;
}
