import { toRoman } from '../utils/roman';
import styles from './MarkModal.module.css';

export function MarkModal({ chapter, progress, onMark, onClose }) {
  const isListened = progress >= 100;
  const pct = Math.round(progress);

  const statusLabel = isListened
    ? 'Fully listened'
    : pct > 0
    ? `${pct}% complete`
    : 'Not yet started';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <div className={styles.numeral}>{toRoman(chapter.id)}</div>
        <h2 className={styles.title}>{chapter.title}</h2>
        <p className={styles.status}>{statusLabel}</p>
        <div className={styles.divider} />
        <div className={styles.actions}>
          <button className={styles.primary} onClick={() => onMark(!isListened)}>
            {isListened ? 'Mark as New' : 'Mark as Listened'}
          </button>
          <button className={styles.cancel} onClick={onClose}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}
