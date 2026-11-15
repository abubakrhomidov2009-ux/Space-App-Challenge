'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { missionIds, missions, type MissionId } from '../museum/missions';
import type { Language } from '../museum/languages';
import MissionStatus from '../museum/mission-status';
import { libraryCopy } from './labels';
import styles from './mission-search.module.css';

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
}

// A quick search across every mission. On the library's first screen the chosen world comes
// forward and the view closes in on the site (`onFly`); elsewhere the story simply opens.
export default function MissionSearch({ language, open, onClose, onFly }: {
  language: Language; open: boolean; onClose: () => void; onFly?: (id: MissionId) => void;
}) {
  const router = useRouter();
  const labels = libraryCopy[language];
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();

  const found = useMemo(() => {
    const term = normalize(query);
    return missionIds.filter((id) => {
      if (!term) return true;
      return Object.values(missions[id].copy).some(({ name, location }) => normalize(name).includes(term) || normalize(location).includes(term));
    });
  }, [query]);
  const results = found;

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    const viewport = window.visualViewport;
    function fitViewport() {
      if (!viewport) return;
      overlay.current?.style.setProperty('--search-height', `${viewport.height}px`);
      overlay.current?.style.setProperty('--search-top', `${viewport.offsetTop}px`);
    }
    fitViewport();
    viewport?.addEventListener('resize', fitViewport);
    viewport?.addEventListener('scroll', fitViewport);
    const frame = requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener('resize', fitViewport);
      viewport?.removeEventListener('scroll', fitViewport);
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted result in view as the arrow keys move through a long list.
  useEffect(() => {
    const scrollArea = list.current;
    const option = scrollArea?.children[active];
    if (!open || !scrollArea || !option) return;
    const bounds = scrollArea.getBoundingClientRect();
    const row = option.getBoundingClientRect();
    if (row.top < bounds.top) scrollArea.scrollTop += row.top - bounds.top;
    else if (row.bottom > bounds.bottom) scrollArea.scrollTop += row.bottom - bounds.bottom;
  }, [active, open, results, listId]);

  function choose(id: MissionId) {
    onClose();
    if (onFly) onFly(id);
    else router.push(`/library/${id}`);
  }

  if (!open) return null;

  return (
    <div ref={overlay} className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label={labels.search}
        onKeyDown={(event) => {
          if (event.key === 'Escape') { event.preventDefault(); onClose(); }
          if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(results.length - 1, value + 1)); }
          if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(0, value - 1)); }
          if (event.key === 'Enter' && results[active]) { event.preventDefault(); choose(results[active]); }
        }}>
        <div className={styles.field}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" />
          </svg>
          <input ref={input} type="text" role="combobox" aria-expanded="true" aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${results[active]}` : undefined}
            value={query} placeholder={labels.search} aria-label={labels.search}
            onChange={(event) => setQuery(event.target.value)} />
        </div>
        <ul ref={list} id={listId} role="listbox" className={styles.results}>
          {results.map((id, index) => {
            const text = missions[id].copy[language];
            return (
              <li key={id} id={`${listId}-${id}`} role="option" aria-selected={index === active}
                data-active={index === active} onClick={() => choose(id)}>
                <span>{text.name}</span>
                <small>{text.location}</small>
                <MissionStatus id={id} language={language} />
              </li>
            );
          })}
          {results.length === 0 && <li className={styles.note} role="presentation">{labels.empty}</li>}
        </ul>
      </div>
    </div>
  );
}
