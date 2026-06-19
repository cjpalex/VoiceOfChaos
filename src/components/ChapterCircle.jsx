import { toRoman } from '../utils/roman';
import styles from './ChapterCircle.module.css';

const FONT_BY_LENGTH = { 1: 72, 2: 64, 3: 56, 4: 50, 5: 44, 6: 38, 7: 32 };

export function ChapterCircle({ chapterNumber, progress = 0, size = 'large', isPlaying = false, onClick }) {
  const fillPercent = Math.min(100, Math.max(0, progress));
  const clipTop = 100 - fillPercent;
  const roman = toRoman(chapterNumber);
  const fontSize = size === 'large' ? (FONT_BY_LENGTH[roman.length] ?? 44) : 19;

  return (
    <div
      className={`${styles.circle} ${styles[size]} ${isPlaying ? styles.playing : ''} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      <div className={styles.ring} />
      <div className={styles.stack}>
        <img src="/bg_dark.png" className={styles.base} alt="" draggable="false" />
        <img
          src="/bg_light.png"
          className={styles.fill}
          alt=""
          draggable="false"
          style={{ clipPath: `inset(${clipTop}% 0 0 0)` }}
        />
        <span className={styles.numeral} style={{ fontSize }}>{roman}</span>
      </div>
      {isPlaying && size === 'large' && <div className={styles.pulse} />}
    </div>
  );
}
