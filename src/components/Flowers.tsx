import {
  memo,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { burstFlowers } from '../lib/flowers'
import styles from './Flowers.module.css'

export type FlowersHandle = {
  /** Menghamburkan satu gelombang bunga yang melayang naik. */
  launchAnimation: () => void
}

type Bloom = {
  id: number
  src: string
  /** Lebar dalam piksel. */
  size: number
  /** Posisi mendatar awal, dalam persen lebar kanvas. */
  left: number
  /** Seberapa jauh ia mengayun ke samping selama naik, dalam piksel. */
  drift: number
  spin: number
  delay: number
  duration: number
}

/** Banyaknya bunga per sekali tekan. */
const COUNT = 55

/*
 * Dibungkus memo, dan ini WAJIB bukan sekadar optimasi. Setiap bunga yang
 * selesai melintas menghapus dirinya dari state, yang berarti daftar ini
 * dirender ulang belasan kali selama satu gelombang. Tanpa memo, tiap render
 * membuat array keyframe baru untuk bunga yang masih terbang, dan motion
 * membaca acuan baru itu sebagai animasi baru — bunga akan meloncat balik ke
 * bawah di tengah jalan. Prop-nya sengaja dijaga stabil semua supaya
 * perbandingan dangkal milik memo benar-benar menahan render ulangnya.
 */
const FloatingBloom = memo(function FloatingBloom({
  bloom: b,
  height,
  onDone,
}: {
  bloom: Bloom
  height: number
  onDone: (id: number) => void
}) {
  return (
    <motion.img
      className={styles.bloom}
      src={b.src}
      alt=""
      style={{ '--size': `${b.size}px`, left: `${b.left}%` } as CSSProperties}
      initial={{ y: 0, x: 0, rotate: -b.spin * 0.4, opacity: 0, scale: 0.7 }}
      // Hanya transform dan opacity — keduanya ditangani compositor, jadi
      // belasan bunga sekaligus tetap mengalir mulus.
      animate={{
        y: -(height + b.size * 1.6),
        x: [0, b.drift, -b.drift * 0.6, b.drift * 0.35],
        rotate: b.spin,
        opacity: [0, 1, 1, 0],
        scale: 1,
      }}
      transition={{
        duration: b.duration,
        delay: b.delay,
        ease: 'linear',
        y: { duration: b.duration, delay: b.delay, ease: [0.32, 0.06, 0.5, 1] },
        x: { duration: b.duration, delay: b.delay, ease: 'easeInOut' },
        rotate: { duration: b.duration, delay: b.delay, ease: 'easeInOut' },
        opacity: { duration: b.duration, delay: b.delay, times: [0, 0.09, 0.72, 1] },
        scale: { duration: 0.45, delay: b.delay, ease: [0.34, 1.56, 0.64, 1] },
      }}
      onAnimationComplete={() => onDone(b.id)}
    />
  )
})

type Props = {
  ref?: Ref<FlowersHandle>
  /** Dipanggil tepat setelah satu gelombang dilepas. */
  onLaunch?: () => void
}

/**
 * Lapisan bunga yang melayang naik — pengganti animasi balon.
 *
 * Dikendalikan lewat ref, bukan lewat props: pemanggilnya cukup memegang
 * satu referensi lalu memanggil launchAnimation() kapan pun. Setiap gelombang
 * membersihkan dirinya sendiri begitu bunga terakhirnya selesai melintas,
 * jadi lapisan ini kembali kosong tanpa perlu diurus dari luar.
 */
export function Flowers({ ref, onLaunch }: Props) {
  const reduced = useReducedMotion()
  const layerRef = useRef<HTMLDivElement>(null)
  const [blooms, setBlooms] = useState<Bloom[]>([])
  const [height, setHeight] = useState(0)
  const nextId = useRef(0)

  // Tinggi kanvas diukur sekali, dipakai untuk menghitung jarak tempuh dalam
  // piksel. Perjalanannya sengaja tidak ditulis sebagai persen: persen pada
  // transform mengacu ke ukuran BUNGA-nya sendiri, bukan ke tinggi layar.
  useLayoutEffect(() => {
    const el = layerRef.current
    if (!el) return
    const measure = () => setHeight(el.getBoundingClientRect().height)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const launchAnimation = useCallback(() => {
    if (reduced) return

    setBlooms((prev) => [
      ...prev,
      ...Array.from({ length: COUNT }, (): Bloom => {
        return {
          id: nextId.current++,
          src: burstFlowers[Math.floor(Math.random() * burstFlowers.length)],
          size: 30 + Math.random() * 48,
          left: -2 + Math.random() * 104,
          drift: (Math.random() - 0.5) * 90,
          spin: (Math.random() - 0.5) * 70,
          // Jeda disebar cukup lebar supaya bunga sebanyak ini datang
          // mengalir seperti arus, bukan menyembur sekaligus lalu habis.
          delay: Math.random() * 1.5,
          duration: 3.4 + Math.random() * 1.8,
        }
      }),
    ])

    onLaunch?.()
  }, [reduced, onLaunch])

  useImperativeHandle(ref, () => ({ launchAnimation }), [launchAnimation])

  const remove = useCallback((id: number) => {
    setBlooms((prev) => prev.filter((b) => b.id !== id))
  }, [])

  return (
    <div className={styles.layer} ref={layerRef} aria-hidden>
      {height > 0 &&
        blooms.map((b) => (
          <FloatingBloom key={b.id} bloom={b} height={height} onDone={remove} />
        ))}
    </div>
  )
}
