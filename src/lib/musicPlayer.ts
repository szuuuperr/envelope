import { useEffect, useState } from 'react'

const SRC = `${import.meta.env.BASE_URL}the-night-we-meet.mp3`

/**
 * Elemen audio sengaja dibuat sekali di scope modul, bukan di dalam
 * komponen. Widget pemutarnya hidup di dalam Letter, yang dilepas begitu
 * alur berpindah ke tahap membaca (Invitation) — kalau elemen audio ikut
 * jadi bagian dari komponen itu, lagunya akan terputus mendadak persis saat
 * amplop selesai di-zoom. Dengan disimpan di sini, lagu terus berjalan di
 * latar selama pengguna masih membaca surat.
 */
let audio: HTMLAudioElement | null = null
function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(SRC)
    audio.preload = 'metadata'
    audio.loop = true
  }
  return audio
}

/**
 * Mulai memutar tanpa lewat hook — dipakai untuk memutar otomatis begitu
 * halaman surat terbuka.
 *
 * Kegagalannya sengaja ditelan diam-diam. Peramban boleh menolak pemutaran
 * otomatis kalau menilai belum ada interaksi pengguna, dan itu bukan keadaan
 * yang perlu diributkan: tombol putarnya tetap ada, dan status di layar ikut
 * benar dengan sendirinya karena event 'play' hanya terbit kalau suaranya
 * memang jadi berbunyi.
 */
export function playBackgroundAudio() {
  const a = getAudio()
  if (a.paused) a.play().catch(() => {})
}

type PlayerState = { playing: boolean; currentTime: number; duration: number }

/** Hook tipis di atas elemen audio singleton di atas. */
export function useBackgroundAudio() {
  const [state, setState] = useState<PlayerState>({ playing: false, currentTime: 0, duration: 0 })

  useEffect(() => {
    const a = getAudio()
    const sync = () =>
      setState({ playing: !a.paused, currentTime: a.currentTime, duration: a.duration || 0 })

    sync()
    a.addEventListener('timeupdate', sync)
    a.addEventListener('loadedmetadata', sync)
    a.addEventListener('durationchange', sync)
    a.addEventListener('play', sync)
    a.addEventListener('pause', sync)
    a.addEventListener('ended', sync)

    return () => {
      a.removeEventListener('timeupdate', sync)
      a.removeEventListener('loadedmetadata', sync)
      a.removeEventListener('durationchange', sync)
      a.removeEventListener('play', sync)
      a.removeEventListener('pause', sync)
      a.removeEventListener('ended', sync)
    }
  }, [])

  const toggle = () => {
    const a = getAudio()
    // Kegagalan play() (mis. dibatasi kebijakan autoplay) sengaja diabaikan
    // secara diam — state akan tetap konsisten karena event 'play' hanya
    // muncul kalau pemutarannya benar-benar berhasil.
    if (a.paused) a.play().catch(() => {})
    else a.pause()
  }

  /** Kembali ke detik nol, dan sekalian mulai memutar kalau sedang jeda. */
  const restart = () => {
    const a = getAudio()
    a.currentTime = 0
    if (a.paused) a.play().catch(() => {})
  }

  return { ...state, toggle, restart }
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
