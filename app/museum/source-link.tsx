import type { ReactNode } from 'react';
import styles from './museum.module.css';

// One look for every link to an outside source. It opens in a new tab so the
// story, its fog transition and the globe position stay where they were.
export default function SourceLink({ href, variant = 'chip', children }: {
  href: string;
  variant?: 'chip' | 'quiet';
  children: ReactNode;
}) {
  return (
    <a className={variant === 'chip' ? styles.sourceChip : styles.sourceQuiet}
      href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <svg className={styles.sourceIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
      </svg>
    </a>
  );
}
