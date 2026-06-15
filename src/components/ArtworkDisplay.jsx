import { useState } from 'react';
import styles from './ArtworkDisplay.module.css';

// Fallback SVG embedded as data URI — warhammer-ish aquila silhouette
const FALLBACK = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#0d0a0a"/>
  <!-- outer ring -->
  <circle cx="200" cy="200" r="180" fill="none" stroke="#3a2c10" stroke-width="2"/>
  <circle cx="200" cy="200" r="175" fill="none" stroke="#c9a84c" stroke-width="0.5"/>
  <!-- rune markings -->
  <text x="200" y="210" text-anchor="middle" font-family="serif" font-size="100" fill="#1e1410" letter-spacing="4">ψ</text>
  <!-- aquila body center -->
  <ellipse cx="200" cy="220" rx="28" ry="36" fill="#8b0000" opacity="0.9"/>
  <!-- left wing -->
  <path d="M172 210 C140 180 90 160 60 140 C90 165 110 190 130 220 C150 245 165 230 172 220Z" fill="#4a0000" stroke="#c9a84c" stroke-width="0.8" opacity="0.85"/>
  <path d="M172 215 C145 195 105 178 75 158 C100 178 120 200 138 228" fill="none" stroke="#8b0000" stroke-width="1.5" opacity="0.6"/>
  <!-- right wing -->
  <path d="M228 210 C260 180 310 160 340 140 C310 165 290 190 270 220 C250 245 235 230 228 220Z" fill="#4a0000" stroke="#c9a84c" stroke-width="0.8" opacity="0.85"/>
  <path d="M228 215 C255 195 295 178 325 158 C300 178 280 200 262 228" fill="none" stroke="#8b0000" stroke-width="1.5" opacity="0.6"/>
  <!-- skull -->
  <ellipse cx="200" cy="195" rx="20" ry="22" fill="#1a1210" stroke="#c9a84c" stroke-width="1"/>
  <ellipse cx="193" cy="192" rx="5" ry="6" fill="#0d0a0a"/>
  <ellipse cx="207" cy="192" rx="5" ry="6" fill="#0d0a0a"/>
  <rect x="196" y="205" width="8" height="3" rx="1" fill="#0d0a0a"/>
  <!-- inner ornamental ring -->
  <circle cx="200" cy="200" r="80" fill="none" stroke="#3a2c10" stroke-width="1" stroke-dasharray="4 6"/>
  <!-- corner runes -->
  <text x="50" y="70" font-family="serif" font-size="22" fill="#3a2c10">✦</text>
  <text x="340" y="70" font-family="serif" font-size="22" fill="#3a2c10">✦</text>
  <text x="50" y="365" font-family="serif" font-size="22" fill="#3a2c10">✦</text>
  <text x="340" y="365" font-family="serif" font-size="22" fill="#3a2c10">✦</text>
</svg>
`)}`;

export function ArtworkDisplay({ src, alt, isPlaying }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);

  return (
    <div className={`${styles.frame} ${isPlaying ? styles.playing : ''}`}>
      <div className={styles.outerRing} />
      <div className={styles.innerRing} />
      <div className={styles.imageWrapper}>
        <img
          src={imgSrc}
          alt={alt}
          className={styles.image}
          onError={() => setImgSrc(FALLBACK)}
        />
        {isPlaying && <div className={styles.pulseRing} />}
      </div>
    </div>
  );
}
