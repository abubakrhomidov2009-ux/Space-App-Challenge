import './globals.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/700.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { defaultLanguage } from './museum/languages';

export const metadata: Metadata = {
  title: 'Museum of Abandoned Space — TMAS',
  description: 'Discover the stories of spacecraft left on the Moon, on Mars, and beyond.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={defaultLanguage}>
      <body>{children}</body>
    </html>
  );
}
