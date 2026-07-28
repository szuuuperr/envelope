import { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { config } from '../config'
import { backdropNoise } from '../lib/paperTexture'
import styles from './LockScreen.module.css'

const PIN_LENGTH = config.pin.length

type Props = { onUnlock: () => void }

export function LockScreen({ onUnlock }: Props) {
  const [entry, setEntry] = useState('')
  const [error, setError] = useState(false)
  /*
   * Layar ini tidak langsung dilepas begitu sandinya benar — ia tetap
   * terpasang di balik spiral bunga sampai spiralnya penuh (lihat App.tsx).
   * Karena itu tombolnya harus dimatikan secara eksplisit; kalau tidak,
   * penekanan berikutnya masih bisa memicu alur pembukaan untuk kedua kali.
   */
  const [done, setDone] = useState(false)

  const push = useCallback(
    (digit: string) => {
      if (done) return
      setError(false)
      setEntry((prev) => (prev.length >= PIN_LENGTH ? prev : prev + digit))
    },
    [done],
  )

  const pop = useCallback(() => {
    if (done) return
    setError(false)
    setEntry((prev) => prev.slice(0, -1))
  }, [done])

  // Verifikasi otomatis begitu digit terakhir masuk.
  useEffect(() => {
    if (entry.length < PIN_LENGTH) return

    if (entry === config.pin) {
      setDone(true)
      onUnlock()
      return
    }

    setError(true)
    navigator.vibrate?.(200)
    const id = setTimeout(() => setEntry(''), 520)
    return () => clearTimeout(id)
  }, [entry, onUnlock])

  // Keyboard fisik (desktop).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) push(e.key)
      else if (e.key === 'Backspace') pop()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [push, pop])

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(6px)' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.texture} style={{ backgroundImage: backdropNoise }} />

      <svg className={styles.lock} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <rect x="4" y="10" width="16" height="11" rx="2.5" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
      </svg>

      <div className={`${styles.group} ${styles.head}`}>
        <h1 className={styles.title}>{config.lock.title}</h1>
        <p className={styles.hint}>{config.lock.hint}</p>
      </div>

      <div className={`${styles.group} ${styles.status}`}>
        <div className={styles.dots} data-error={error} role="status" aria-label={`${entry.length} dari ${PIN_LENGTH} digit`}>
          {Array.from({ length: PIN_LENGTH }, (_, i) => (
            <span key={i} className={styles.dot} data-filled={i < entry.length} />
          ))}
        </div>
        <p className={styles.error} data-show={error} role="alert">
          {error ? config.lock.error : ''}
        </p>
      </div>

      <div className={styles.pad}>
        {keys.map((k) => (
          <button key={k} className={styles.key} onClick={() => push(k)} aria-label={k}>
            {k}
          </button>
        ))}
        <span />
        <button className={styles.key} onClick={() => push('0')} aria-label="0">
          0
        </button>
        <button className={styles.key} data-ghost="true" onClick={pop} aria-label="Hapus">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9L2 12z" />
            <path d="M13 9l5 6M18 9l-5 6" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
