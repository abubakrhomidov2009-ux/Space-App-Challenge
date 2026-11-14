import styles from './fog.module.css';

// The same two banks of cloud that cover a story on the home page. They close over the view,
// and open again on the other side.
export default function Fog({ world, state }: { world: string; state: 'idle' | 'close' | 'open' }) {
  return <div className={styles.fog} data-fog={world} data-state={state} aria-hidden="true" />;
}
