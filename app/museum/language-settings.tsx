import { useEffect, useRef, useState } from 'react';
import { languages, museumCopy, type Language } from './languages';
import styles from './museum.module.css';

export default function LanguageSettings({ language, onChange }: {
  language: Language;
  onChange: (language: Language) => void;
}) {
  const settings = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  const label = museumCopy[language].language;

  function close(restoreFocus = false) {
    if (!settings.current) return;
    settings.current.open = false;
    if (restoreFocus) settings.current.querySelector('summary')?.focus({ preventScroll: true });
  }

  // While the menu is open, any scroll or a press outside it closes it.
  // The press covers the globe switch button and the rotation area.
  useEffect(() => {
    if (!open) return;
    const closeOnScroll = () => close();
    const closeOutside = (event: PointerEvent) => {
      if (!settings.current?.contains(event.target as Node)) close();
    };
    window.addEventListener('scroll', closeOnScroll, { passive: true });
    window.addEventListener('wheel', closeOnScroll, { passive: true });
    document.addEventListener('pointerdown', closeOutside, true);
    return () => {
      window.removeEventListener('scroll', closeOnScroll);
      window.removeEventListener('wheel', closeOnScroll);
      document.removeEventListener('pointerdown', closeOutside, true);
    };
  }, [open]);

  return (
    <details ref={settings} className={styles.languageSettings}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !event.currentTarget.open) return;
        event.preventDefault();
        close(true);
      }}>
      <summary aria-label={label}><span aria-hidden="true">⚙︎</span></summary>
      <div className={styles.languageMenu} role="group" aria-label={label}>
        <p>{label}</p>
        {(Object.keys(languages) as Language[]).map((option) => (
          <button key={option} type="button" lang={option} aria-pressed={language === option}
            onClick={() => { onChange(option); close(true); }}>
            {languages[option]}
            {language === option && <span aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
    </details>
  );
}
