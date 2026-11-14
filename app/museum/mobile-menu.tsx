import Link from 'next/link';
import { useRef, useState } from 'react';
import { libraryCopy } from '../library/labels';
import { museumCopy, type Language } from './languages';
import styles from './museum.module.css';

export default function MobileMenu({ language }: { language: Language }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);
  const labels = libraryCopy[language];

  function finishClose() {
    dialog.current?.close();
    setClosing(false);
    trigger.current?.focus({ preventScroll: true });
  }

  function close() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finishClose();
    else setClosing(true);
  }

  return (
    <div className={styles.mobileNav}>
      <button ref={trigger} type="button" className={styles.menuToggle}
        aria-label={labels.navigation} aria-haspopup="dialog" aria-controls="mobile-menu"
        onClick={() => dialog.current?.showModal()}>
        <span className={styles.menuBars} aria-hidden="true" />
      </button>
      <dialog id="mobile-menu" ref={dialog} className={styles.mobileDrawer}
        aria-label={labels.navigation} data-closing={closing}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
        onAnimationEnd={(event) => {
          if (closing && event.target === event.currentTarget) finishClose();
        }}>
        <div className={styles.drawerContent}>
          <button type="button" className={styles.menuToggle} onClick={close}
            aria-label={museumCopy[language].back}>×</button>
          <nav aria-label={labels.navigation}>
            <Link href="/library" prefetch={false}>{labels.title} <i className="nav-arrow" aria-hidden="true" /></Link>
            <Link href="/library/globe" prefetch={false}>{labels.globe} <i className="nav-arrow" aria-hidden="true" /></Link>
          </nav>
        </div>
      </dialog>
    </div>
  );
}
