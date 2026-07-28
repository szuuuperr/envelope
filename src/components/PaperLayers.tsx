import { motion, useReducedMotion } from 'motion/react'
import { paperNoise } from '../lib/paperTexture'
import { flower } from '../lib/flowers'
import styles from './Invitation.module.css'

/*
 * Lapisan latar kertas: gradien, bunga sudut, butiran, dan vignette.
 * Dipakai oleh halaman surat DAN oleh kertas kecil di dalam amplop, supaya
 * saat kertas selesai di-zoom dan digantikan halaman surat, tidak ada satu
 * pun elemen latar yang tiba-tiba muncul atau hilang. Semua ukurannya
 * mengikuti --stage-w, jadi versi mini di dalam kertas terbentuk sendiri.
 *
 * Dipisah jadi dua bagian karena isi teks harus duduk DI ANTARA keduanya:
 * bunga sudut berada di bawah teks, butiran dan vignette di atasnya.
 */

export function PaperBackdrop({ animated = true }: { animated?: boolean }) {
  const reduced = useReducedMotion()
  const float = animated && !reduced

  return (
    <>
      <div className={styles.paperBg} />
      <div className={styles.corners} aria-hidden>
        <motion.img
          className={`${styles.corner} ${styles.cornerTop}`}
          src={flower.branchBlossom}
          alt=""
          animate={float ? { y: [0, 8, 0], rotate: [0, 2.5, 0] } : undefined}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.img
          className={`${styles.corner} ${styles.cornerBottom}`}
          src={flower.leaves}
          alt=""
          animate={float ? { y: [0, -9, 0], rotate: [0, -3, 0] } : undefined}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: -6 }}
        />
        <motion.img
          className={`${styles.corner} ${styles.cornerDragonfly}`}
          src={flower.dragonfly}
          alt=""
          animate={float ? { y: [0, -14, 0], x: [0, -7, 0], rotate: [0, 6, 0] } : undefined}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: -3 }}
        />
      </div>
    </>
  )
}

export function PaperOverlay() {
  return (
    <div className={styles.overlay}>
      <div className={styles.grain} style={{ backgroundImage: paperNoise }} />
      <div className={styles.vignette} />
    </div>
  )
}
