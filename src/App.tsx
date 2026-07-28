import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { config } from './config'
import { backdropNoise } from './lib/paperTexture'
import { LockScreen } from './components/LockScreen'
import { FloatingGarden } from './components/FloatingGarden'
import { FlowerBurst } from './components/FlowerBurst'
import { preloadAssets } from './lib/preload'
import { EnvelopeScene, type Stage } from './components/EnvelopeScene'
import { Invitation } from './components/Invitation'
import styles from './App.module.css'

const UNLOCK_KEY = 'envelope:unlocked'

function initialStage(): Stage {
  if (config.rememberUnlock && sessionStorage.getItem(UNLOCK_KEY) === '1') return 'sealed'
  return 'locked'
}

export default function App() {
  const [stage, setStage] = useState<Stage>(initialStage)
  const [burst, setBurst] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  // Semua gambar tahap berikutnya dimuat selagi pembaca masih di lockscreen.
  useEffect(() => {
    preloadAssets()
  }, [])

  // Scroll halaman dikunci; penggulungan terjadi di dalam kanvas saat membaca.
  useEffect(() => {
    document.body.dataset.locked = 'true'
    return () => {
      delete document.body.dataset.locked
    }
  }, [])

  const unlock = useCallback(() => {
    if (config.rememberUnlock) sessionStorage.setItem(UNLOCK_KEY, '1')
    setStage('bursting')
    setBurst(true)
  }, [])

  // Dipakai dua kali: oleh gerakan menggulir di bawah, dan oleh tombol yang
  // menutupi layar pada tahap 'risen' — supaya mengetuk pun bisa membuka.
  const zoom = useCallback(() => setStage('zooming'), [])

  /*
   * Setelah kertas keluar penuh, alurnya sengaja berhenti di 'risen'.
   * Perbesaran baru dijalankan ketika pembaca menggulir — jadi kertas tidak
   * langsung membesar sendiri begitu amplop diklik.
   *
   * Scroll halaman dikunci di semua tahap ini, jadi tidak ada peristiwa
   * 'scroll' yang bisa disimak; yang didengarkan adalah gerakannya langsung:
   * roda tetikus, geseran jari, dan tombol panah/spasi untuk papan ketik.
   */
  useEffect(() => {
    if (stage !== 'risen') return

    // Hanya arah ke bawah — gerakan ke atas berarti pembaca justru mundur.
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) zoom()
    }
    // Menggulir ke bawah di layar sentuh berarti jari bergerak NAIK, jadi
    // yang dicari adalah posisi awal dikurangi posisi sekarang. Ambangnya
    // 24px supaya sentuhan diam atau bergetar sedikit tidak ikut terhitung.
    let touchStart = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStart = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      if (touchStart - e.touches[0].clientY > 24) zoom()
    }
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) zoom()
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
    }
  }, [stage, zoom])

  // Identitasnya dijaga stabil agar efek pengukuran di EnvelopeScene
  // tidak ikut terpicu ulang setiap render.
  const open = useCallback(() => setStage('opening'), [])
  const risen = useCallback(() => setStage('risen'), [])
  const zoomed = useCallback(() => setStage('reading'), [])

  /*
   * Dua peristiwa terpisah, dan urutannya yang membuat peralihannya mulus:
   * saat spiral sudah penuh menutupi layar, tahap berpindah ke 'sealed' —
   * lockscreen mulai memudar keluar tepat bersamaan dengan memudarnya spiral,
   * dan amplop tersingkap dari baliknya. Lapisan bunganya sendiri baru
   * dilepas belakangan, setelah benar-benar tak terlihat.
   */
  const burstCovered = useCallback(() => setStage('sealed'), [])
  const burstDone = useCallback(() => setBurst(false), [])

  return (
    <div className={styles.stage} ref={stageRef} data-stage={stage}>
      <div className={styles.texture} style={{ backgroundImage: backdropNoise }} />

      {stage !== 'reading' && stage !== 'bursting' && <FloatingGarden />}

      {stage !== 'reading' && stage !== 'bursting' && (
        <EnvelopeScene
          stage={stage}
          stageRef={stageRef}
          onOpen={open}
          onRisen={risen}
          onZoom={zoom}
          onZoomed={zoomed}
        />
      )}

      {(stage === 'zooming' || stage === 'reading') && <Invitation />}

      {burst && <FlowerBurst onCovered={burstCovered} onDone={burstDone} />}

      {/* Tetap terpasang selama 'bursting' supaya spiral bunga menyapu DI
          DEPAN layar sandi, bukan menggantikannya. */}
      <AnimatePresence>
        {(stage === 'locked' || stage === 'bursting') && <LockScreen onUnlock={unlock} />}
      </AnimatePresence>
    </div>
  )
}
