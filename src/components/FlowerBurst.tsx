import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { seededRandom } from '../lib/flowers'
import { burstSrcs } from '../lib/preload'
import styles from './FlowerBurst.module.css'

/**
 * Jumlah kelopak sangat banyak agar spiral benar-benar rapat dan
 * menutupi seluruh layar tanpa celah.
 */
const COUNT = 500

/** Berapa putaran spiral dari pusat ke tepi layar. */
const TOTAL_TURNS = 16

type Props = {
  /**
   * Dipanggil saat spiral sudah terbentuk penuh dan mulai memudar — bukan
   * saat sudah hilang. Di titik inilah layar sandi di baliknya dilepas,
   * sehingga keduanya memudar bersamaan dan amplop tersingkap tanpa jeda.
   */
  onCovered: () => void
  /** Dipanggil setelah seluruh animasi selesai, agar lapisan ini dilepas. */
  onDone: () => void
}

/**
 * Spiral bunga saat kunci terbuka.
 *
 * Kelopak muncul SATU PER SATU mengikuti jalur spiral Archimedean —
 * dimulai dari titik kecil di pusat layar, lalu berputar keluar membentuk
 * lingkaran yang semakin besar sampai menutupi seluruh layar.
 * Setelah semua kelopak terpasang, semuanya memudar bersama-sama.
 */
export function FlowerBurst({ onCovered, onDone }: Props) {
  const reduced = useReducedMotion()
  const layerRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)

  useLayoutEffect(() => {
    const el = layerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setBox({ w: r.width, h: r.height })
  }, [])

  const petals = useMemo(() => {
    const rand = seededRandom(20260728)

    return Array.from({ length: COUNT }, (_, i) => {
      const progress = i / (COUNT - 1) // 0 → 1 (pusat → tepi)

      // --- Spiral Archimedean ---
      const angle = progress * TOTAL_TURNS * Math.PI * 2

      /*
       * Radius linier — karena jumlah kelopak sudah sangat banyak dan
       * putarannya rapat (10 putaran), jarak antar lengan spiral sudah
       * otomatis sempit.  Sedikit goyangan acak ditambahkan agar tidak
       * terlihat terlalu mekanis.
       */
      const radiusPct = progress * 82 + rand() * 3
      const dx = Math.cos(angle) * radiusPct
      const dy = Math.sin(angle) * radiusPct * 0.85

      // Kelopak besar supaya saling tumpang-tindih rapat.
      const size = 48 + progress * 40 + rand() * 16

      return {
        src: burstSrcs[i % burstSrcs.length],
        size,
        dx,
        dy,
        spin: (rand() - 0.5) * 100,
        delay: progress * 2.8 + rand() * 0.04,
      }
    })
  }, [])

  const lastDelay = Math.max(...petals.map((p) => p.delay))
  const popDuration = 0.35
  const holdTime = 0.4
  const fadeDuration = 0.55

  const [phase, setPhase] = useState<'spiral' | 'fade'>('spiral')

  useLayoutEffect(() => {
    if (!box) return
    const id = setTimeout(() => setPhase('fade'), (lastDelay + popDuration + holdTime) * 1000)
    return () => clearTimeout(id)
  }, [box, lastDelay])

  useLayoutEffect(() => {
    if (phase !== 'fade') return
    onCovered()
    const id = setTimeout(onDone, fadeDuration * 1000 + 50)
    return () => clearTimeout(id)
  }, [phase, onCovered, onDone])

  /*
   * Tanpa animasi, komponen ini tidak menggambar apa pun — dan karena itu
   * tidak pernah terukur, sehingga rangkaian timer di atas tak pernah jalan.
   * Kedua callback harus dipanggil di sini, kalau tidak alurnya berhenti
   * selamanya di tahap 'bursting' dan pembaca terkunci di layar sandi.
   */
  useLayoutEffect(() => {
    if (!reduced) return
    onCovered()
    onDone()
  }, [reduced, onCovered, onDone])

  if (reduced) return null

  return (
    <motion.div
      className={styles.layer}
      ref={layerRef}
      aria-hidden
      animate={{ opacity: phase === 'fade' ? 0 : 1 }}
      transition={{ duration: fadeDuration, ease: 'easeIn' }}
    >
      {box &&
        petals.map((p, i) => {
          const dim = Math.min(box.w, box.h)
          const x = (p.dx / 100) * dim
          const y = (p.dy / 100) * dim

          return (
            <motion.img
              key={i}
              className={styles.petal}
              src={p.src}
              alt=""
              style={{ '--size': `${p.size}px` } as CSSProperties}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: -p.spin * 0.3 }}
              animate={{ x, y, scale: 1, opacity: 1, rotate: p.spin }}
              transition={{
                duration: popDuration,
                delay: p.delay,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />
          )
        })}
    </motion.div>
  )
}

