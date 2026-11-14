'use client';

import { useEffect, useState } from 'react';
import type { Language } from './languages';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('ru');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tmas-language');
      if (saved === 'ru' || saved === 'en' || saved === 'tg') {
        setLanguage(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // The selector still works with storage disabled.
    }
    return () => { document.documentElement.lang = 'ru'; };
  }, []);

  function changeLanguage(next: Language) {
    setLanguage(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem('tmas-language', next);
    } catch {
      // The selection still applies for this visit.
    }

  }

  return { language, changeLanguage };
}
