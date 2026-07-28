import { motion, useReducedMotion } from 'motion/react'
import { flower } from '../lib/flowers'
import styles from './FloatingGarden.module.css'

/**
 * Bunga latar. Ditempatkan di sekeliling tepi kanvas supaya bagian tengah
 * tetap lapang untuk amplop. Posisinya sengaja ditulis manual — bukan acak —
 * agar komposisinya terkendali di layar sempit maupun lebar.
 */
const blooms = [
  { src: flower.branchBlossom, size: 42, top: -7, left: -16, opacity: 0.34, drift: 16, spin: 4, dur: 19 },
  { src: flower.fern, size: 32, top: -5, left: 76, opacity: 0.28, drift: -13, spin: -5, dur: 23 },
  { src: flower.peony, size: 28, top: 16, left: 80, opacity: 0.24, drift: 11, spin: 6, dur: 17 },
  { src: flower.leaves, size: 28, top: 63, left: -13, opacity: 0.26, drift: -14, spin: -4, dur: 21 },
  { src: flower.orchidCluster, size: 32, top: 80, left: 68, opacity: 0.3, drift: 15, spin: 5, dur: 25 },
  { src: flower.rose, size: 24, top: 87, left: 3, opacity: 0.26, drift: -10, spin: 7, dur: 18 },
  { src: flower.sprig, size: 22, top: 41, left: 86, opacity: 0.2, drift: 12, spin: -6, dur: 27 },
  { src: flower.leafRose, size: 24, top: 31, left: -11, opacity: 0.22, drift: 13, spin: 5, dur: 22 },
]

export function FloatingGarden() {
  const reduced = useReducedMotion()

  return (
    <div className={styles.garden} aria-hidden>
      <motion.div
        className={styles.glow}
        animate={reduced ? undefined : { scale: [1, 1.1, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {blooms.map((b, i) => (
        <motion.img
          key={i}
          className={styles.bloom}
          src={b.src}
          alt=""
          loading="lazy"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            opacity: b.opacity,
            ['--size' as string]: `${b.size}%`,
          }}
          animate={
            reduced
              ? undefined
              : { y: [0, -b.drift, 0], x: [0, b.drift * 0.35, 0], rotate: [0, b.spin, 0] }
          }
          transition={{
            duration: b.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            // Fase awal dibuat berbeda-beda agar tidak bergerak serempak.
            delay: -i * 2.4,
          }}
        />
      ))}
    </div>
  )
}
