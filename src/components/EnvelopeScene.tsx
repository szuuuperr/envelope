import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { config } from '../config'
import { Letter } from './Letter'
import styles from './EnvelopeScene.module.css'

/*
 * 'risen' = kertas sudah keluar penuh dari amplop dan BERHENTI di situ.
 * Zoom tidak lagi menyambung otomatis; tahap ini menunggu sampai pembaca
 * menggulir (lihat App.tsx) baru berpindah ke 'zooming'.
 */
export type Stage =
  | 'locked'
  | 'bursting'
  | 'sealed'
  | 'opening'
  | 'risen'
  | 'zooming'
  | 'reading'

type Props = {
  stage: Stage
  stageRef: RefObject<HTMLDivElement | null>
  onOpen: () => void
  onRisen: () => void
  /** Memulai perbesaran — alternatif ketuk untuk pembaca yang tidak menggulir. */
  onZoom: () => void
  onZoomed: () => void
}

type Zoom = { x: number; y: number; scale: number; origin: string }

const REST: Zoom = { x: 0, y: 0, scale: 1, origin: '50% 50%' }

export function EnvelopeScene({ stage, stageRef, onOpen, onRisen, onZoom, onZoomed }: Props) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const letterRef = useRef<HTMLDivElement>(null)
  const measured = useRef(false)
  const [zoom, setZoom] = useState<Zoom>(REST)

  const opening = stage === 'opening' || stage === 'risen' || stage === 'zooming'
  const zooming = stage === 'zooming'
  // Tahap yang diam menunggu aksi pembaca: menunggu diklik, lalu menunggu digulir.
  const waiting = stage === 'sealed' || stage === 'risen'
  const t = (seconds: number) => (reduced ? 0.001 : seconds)

  /*
   * Saat masuk tahap zoom, ukur posisi nyata kertas dan bandingkan dengan
   * kanvas. Dari situ dihitung skala yang cukup untuk menutupi layar serta
   * pergeseran agar pusat kertas mendarat tepat di pusat kanvas.
   * Titik origin transform disetel ke pusat kertas — bukan pusat pembungkus —
   * karena kertas sedang tergeser ke atas relatif terhadap pembungkusnya.
   */
  useLayoutEffect(() => {
    // Diukur sekali saja: begitu zoom berjalan, posisi kertas terus berubah,
    // jadi pengukuran ulang akan menghasilkan nilai yang salah.
    if (!zooming || measured.current) return
    measured.current = true

    const letter = letterRef.current
    const wrap = wrapRef.current
    const stageEl = stageRef.current
    // Kalau pengukuran mustahil dilakukan, langsung lanjut ke tahap membaca
    // agar alur tidak pernah macet di tengah jalan.
    if (!letter || !wrap || !stageEl) {
      onZoomed()
      return
    }

    const l = letter.getBoundingClientRect()
    const w = wrap.getBoundingClientRect()
    const s = stageEl.getBoundingClientRect()

    const lcx = l.left + l.width / 2
    const lcy = l.top + l.height / 2

    // Kertas sebangun dengan kanvas (lihat --letter-scale), jadi kedua rasio
    // ini pada dasarnya sama dan skalanya mendarat persis di tepi kanvas.
    // Kelebihan 0.4% hanya menutup selisih pembulatan sub-piksel — sengaja
    // sekecil ini supaya isi kertas tetap berimpit dengan halaman surat.
    setZoom({
      x: s.left + s.width / 2 - lcx,
      y: s.top + s.height / 2 - lcy,
      scale: Math.max(s.width / l.width, s.height / l.height) * 1.004,
      origin: `${((lcx - w.left) / w.width) * 100}% ${((lcy - w.top) / w.height) * 100}%`,
    })
  }, [zooming, stageRef, onZoomed])

  const fade = { opacity: zooming ? 0 : 1 }
  const fadeTransition = { duration: t(0.5), ease: 'easeOut' as const }

  return (
    <div className={styles.scene}>
      <motion.div className={styles.heading} animate={{ opacity: opening ? 0 : 1 }} transition={fadeTransition}>
        <p className={styles.headingLabel}>{config.envelope.to}</p>
        <p className={styles.headingGuest}>{config.envelope.guest}</p>
      </motion.div>

      <motion.div
        className={styles.envelope}
        animate={{ y: opening ? '9%' : '0%' }}
        transition={{ duration: t(0.9), ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div className={styles.shadow} animate={fade} transition={fadeTransition} />
        <motion.div className={styles.back} animate={fade} transition={fadeTransition} />

        <div className={styles.letterClip} data-unclipped={zooming}>
          <motion.div
            ref={wrapRef}
            className={styles.letterZoom}
            style={{ transformOrigin: zoom.origin }}
            animate={{ x: zoom.x, y: zoom.y, scale: zoom.scale }}
            transition={{ duration: t(1.1), ease: [0.5, 0, 0.2, 1] }}
            // Hanya hitung sebagai selesai kalau transform zoom memang sudah
            // terpasang — bukan animasi identitas saat pemasangan komponen.
            onAnimationComplete={() => {
              if (zooming && zoom.scale > 1) onZoomed()
            }}
          >
            <motion.div
              ref={letterRef}
              className={styles.letter}
              // 102% menaruh SELURUH kertas di bawah dasar amplop, jadi ia
              // pasti tersembunyi oleh .letterClip berapa pun rasio kanvasnya
              // — bukan sekadar kebetulan pas seperti kalau memakai angka yang
              // disetel untuk satu tinggi kertas tertentu.
              // -10% mengangkatnya sampai tepi bawah kertas kira-kira sejajar
              // pertemuan panel depan: kertas terbaca utuh, tetapi ujungnya
              // masih terselip di dalam kantong amplop.
              initial={{ y: '102%', rotate: 0 }}
              animate={opening ? { y: '-10%', rotate: [0, -1.2, 0] } : { y: '102%', rotate: 0 }}
              transition={{ duration: t(1), delay: t(0.5), ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => stage === 'opening' && onRisen()}
            >
              <Letter />
            </motion.div>
          </motion.div>
        </div>

        <motion.div className={styles.front} animate={fade} transition={fadeTransition}>
          <div className={`${styles.panel} ${styles.sideL}`} />
          <div className={`${styles.panel} ${styles.sideR}`} />
          <div className={`${styles.panel} ${styles.bottom}`} />
        </motion.div>

        {/* Flap: berputar ke belakang. Penukaran z-index-nya ditangani oleh
            animasi CSS `flapSink` (lihat berkas .module.css). */}
        <motion.div
          className={styles.flap}
          data-open={opening}
          initial={{ rotateX: 0 }}
          // Rotasi positif = terlipat MENJAUHI penonton, lalu jatuh di
          // belakang amplop. Rotasi negatif akan menyapu ke arah penonton
          // dan sesaat tampak melayang di depan amplop.
          animate={{ rotateX: opening ? 180 : 0, opacity: zooming ? 0 : 1 }}
          transition={{
            rotateX: { duration: t(0.9), ease: [0.45, 0, 0.2, 1] },
            opacity: fadeTransition,
          }}
        >
          <div className={styles.flapFace} />
          <div className={styles.flapBack} />
        </motion.div>

        <motion.div
          className={styles.seal}
          animate={opening ? { scale: 0.4, opacity: 0, rotate: -22 } : { scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: t(0.35), ease: 'easeIn' }}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 21s-8-4.9-8-10.4A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 3.6C20 16.1 12 21 12 21z" />
          </svg>
        </motion.div>

        {stage === 'sealed' && (
          <button className={styles.tap} onClick={onOpen} aria-label={config.envelope.hint} />
        )}
      </motion.div>

      {/* Menutupi seluruh layar, bukan hanya amplop: pada tahap ini kertas
          sudah menjulang jauh di atas amplop, jadi target ketuk sebesar
          amplop saja akan terasa meleset. */}
      {stage === 'risen' && (
        <button className={styles.tapAll} onClick={onZoom} aria-label={config.envelope.scrollHint} />
      )}

      {/* Petunjuk hanya berdenyut pada dua tahap yang memang menunggu aksi
          pembaca; selebihnya ada animasi berjalan dan teksnya menyingkir. */}
      <motion.p
        className={styles.hint}
        animate={waiting ? { opacity: [0.45, 1, 0.45] } : { opacity: 0 }}
        transition={waiting ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : fadeTransition}
      >
        {stage === 'risen' ? config.envelope.scrollHint : config.envelope.hint}
      </motion.p>
    </div>
  )
}
