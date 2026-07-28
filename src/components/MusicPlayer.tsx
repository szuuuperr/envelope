import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { config } from '../config'
import { formatTime, playBackgroundAudio, useBackgroundAudio } from '../lib/musicPlayer'
import { COVER } from '../lib/preload'
import styles from './MusicPlayer.module.css'

/**
 * Bilah pemutar lagu: judul, artis, dan tombol di sebelah kiri; piringan
 * hitam berputar di sebelah kanan. Piringannya sengaja lebih tinggi daripada
 * bilahnya sehingga menyembul keluar di atas dan di bawah — itu sebabnya
 * kartu ini tidak boleh diberi overflow: hidden.
 */
export function MusicPlayer() {
  const { playing, currentTime, duration, toggle, restart } = useBackgroundAudio()
  const reduced = useReducedMotion()
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  /*
   * Lagu mulai sendiri begitu halaman surat terbuka. Komponen ini hanya
   * terpasang sekali — bersamaan dengan halaman surat — jadi efek sekali
   * jalan sudah cukup, dan menjeda lagu tidak akan membuatnya memutar lagi.
   */
  useEffect(() => {
    playBackgroundAudio()
  }, [])

  // Bilahnya naik dari bawah lebih dulu, piringannya menyusul sesaat kemudian
  // — jadi terbaca seperti piringan yang baru diletakkan ke atas dek.
  //
  // Jedanya bukan sekadar hiasan: komponen ini ikut terpasang begitu tahap
  // 'zooming' dimulai, padahal layar saat itu masih tertutup kertas yang
  // sedang membesar (± 1,1 detik, lihat EnvelopeScene). Tanpa jeda, animasi
  // masuknya habis di balik kertas dan pembaca tidak pernah melihatnya.
  //
  // Angkanya juga sengaja LEBIH dari 1,1 detik dengan jarak yang cukup: pada
  // detik itu React melepas EnvelopeScene beserta FloatingGarden sekaligus,
  // dan frame yang tersita untuk itu persis memakan awal animasi ini kalau
  // keduanya dimulai bersamaan — itulah yang membuatnya terasa tersendat.
  const rise = reduced
    ? { duration: 0 }
    : { duration: 0.7, delay: 1.45, ease: [0.22, 1, 0.36, 1] as const }
  const drop = reduced
    ? { duration: 0 }
    : { duration: 0.6, delay: 1.75, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <motion.div
      className={styles.card}
      data-playing={playing}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={rise}
    >
      <div className={styles.info}>
        <p className={styles.title}>{config.music.title}</p>
        <p className={styles.artist}>{config.music.artist}</p>

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.button} ${styles.play}`}
            onClick={toggle}
            aria-label={playing ? 'Jeda lagu' : 'Putar lagu'}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              {playing ? (
                <path d="M7 5h3.1v14H7zM13.9 5H17v14h-3.1z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
          </button>

          <button
            type="button"
            className={styles.button}
            onClick={restart}
            aria-label="Putar ulang dari awal"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" />
            </svg>
          </button>

          <span className={styles.time}>
            {formatTime(currentTime)}
            <span className={styles.sep}>/</span>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Dek putar — murni hiasan, jadi tidak perlu bisa disentuh.
          y: '-50%' menengahkannya secara vertikal (dulu ini `transform` di
          CSS, tapi motion menimpa properti itu) dan karena nilainya sama di
          initial maupun animate, ia tidak pernah ikut beranimasi. */}
      <motion.div
        className={styles.deck}
        aria-hidden
        initial={{ opacity: 0, scale: 0.5, y: '-50%' }}
        animate={{ opacity: 1, scale: 1, y: '-50%' }}
        transition={drop}
      >
        <div className={styles.disc}>
          <img className={styles.cover} src={COVER} alt="" />
          <span className={styles.spindle} />
        </div>
        {/* Lengan pikap: terangkat saat jeda, turun ke piringan saat memutar. */}
        <span className={styles.arm}>
          <span className={styles.armRod} />
        </span>
      </motion.div>

      <div className={styles.progress}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  )
}
