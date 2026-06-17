import styles from './ChapterCircle.module.css';

const ROMAN_VALS = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
const ROMAN_SYMS = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];

function toRoman(n) {
  let result = '';
  for (let i = 0; i < ROMAN_VALS.length; i++) {
    while (n >= ROMAN_VALS[i]) { result += ROMAN_SYMS[i]; n -= ROMAN_VALS[i]; }
  }
  return result;
}

// Scale font down gracefully for longer numerals (VIII, XIII, etc.)
const FONT_BY_LENGTH = { 1: 72, 2: 64, 3: 56, 4: 50, 5: 44 };

export function ChapterCircle({ chapterNumber, progress = 0, size = 'large', isPlaying = false }) {
  const fillPercent = Math.min(100, Math.max(0, progress));
  const clipTop = 100 - fillPercent;
  const roman = toRoman(chapterNumber);
  const fontSize = size === 'large' ? (FONT_BY_LENGTH[roman.length] ?? 44) : 19;

  return (
    <div className={`${styles.circle} ${styles[size]} ${isPlaying ? styles.playing : ''}`}>
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
