import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, type Transition } from 'motion/react'

type BlurTextProps = {
  text?: string
  /** Jeda antar kata/huruf dalam milidetik. */
  delay?: number
  className?: string
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  animationFrom?: Record<string, string | number>
  animationTo?: Array<Record<string, string | number>>
  easing?: (t: number) => number
  onAnimationComplete?: () => void
  stepDuration?: number
}

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>,
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))])

  const keyframes: Record<string, Array<string | number>> = {}
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])]
  })
  return keyframes
}

/**
 * Teks yang muncul kata demi kata, dari buram dan bergeser menjadi tajam.
 * Dipicu IntersectionObserver, jadi tiap bagian baru bergerak ketika
 * benar-benar tergulir masuk ke layar.
 */
export function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}: BlurTextProps) {
  const reduced = useReducedMotion()
  // Teks dipecah dulu per baris di `\n` supaya paragraf tetap terjaga —
  // spasi putih tidak bisa diandalkan karena tiap kata dibungkus span
  // inline-block. Baris kosong (dari `\n\n`) sengaja menghasilkan daftar
  // segmen kosong: ia hanya menyumbang satu <br> sebagai jarak antarparagraf.
  const lines = useMemo(
    () =>
      text
        .split('\n')
        .map((line) => (line === '' ? [] : animateBy === 'words' ? line.split(' ') : line.split(''))),
    [text, animateBy],
  )
  // Indeks jeda berjalan terus lintas baris, jadi kata pertama paragraf kedua
  // melanjutkan hitungan paragraf sebelumnya, bukan mulai dari nol lagi.
  const offsets = useMemo(() => {
    let running = 0
    return lines.map((line) => {
      const start = running
      running += line.length
      return start
    })
  }, [lines])
  const totalSegments = offsets.length ? offsets[offsets.length - 1] + lines[lines.length - 1].length : 0
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const defaultFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction],
  )

  const defaultTo = useMemo(
    () => [
      { filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? 5 : -5 },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction],
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo

  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)))

  // Tanpa animasi: teks langsung tampil utuh dan tetap terbaca.
  if (reduced) {
    return (
      <p ref={ref} className={className} style={{ whiteSpace: 'pre-line' }}>
        {text}
      </p>
    )
  }

  return (
    <p ref={ref} className={className}>
      {lines.map((segments, lineIndex) => (
        <Fragment key={lineIndex}>
          {segments.map((segment, i) => {
            const index = offsets[lineIndex] + i
            const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)

            const spanTransition: Transition = {
              duration: totalDuration,
              times,
              delay: (index * delay) / 1000,
              ease: easing,
            }

            return (
              // Spasi diletakkan sebagai simpul saudara DI LUAR span. Kalau ikut
              // masuk ke dalam span yang inline-block, browser akan menciutkan
              // spasi di ujungnya sehingga kata-kata menempel — dan baris tidak
              // punya titik patah ketika teks harus turun baris.
              <Fragment key={i}>
                <motion.span
                  initial={fromSnapshot}
                  animate={inView ? animateKeyframes : fromSnapshot}
                  transition={spanTransition}
                  onAnimationComplete={index === totalSegments - 1 ? onAnimationComplete : undefined}
                  style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
                >
                  {segment}
                </motion.span>
                {animateBy === 'words' && i < segments.length - 1 ? ' ' : null}
              </Fragment>
            )
          })}
          {lineIndex < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </p>
  )
}
