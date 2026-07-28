import { burstFlowers, flower } from './flowers'

const BASE = import.meta.env.BASE_URL

/**
 * Aset spiral saat kunci terbuka. Daftarnya ada di sini, bukan di dalam
 * komponennya, supaya bisa ikut dimuat lebih awal tanpa perlu memasang
 * komponen itu terlebih dulu.
 */
export const burstSrcs = [
  `${BASE}flowers/rosees 1.webp`,
  `${BASE}flowers/29593-5 1.webp`,
  `${BASE}flowers/29593-6 1.webp`,
  `${BASE}flowers/29593-13 1.webp`,
  `${BASE}flowers/29593-7 1.webp`,
  `${BASE}flowers/orchid.webp`,
]

/** Sampul lagu pada bilah pemutar. */
export const COVER = `${BASE}the-night-we-meet-cover-image.jpg`

/*
 * Setiap gambar yang muncul SETELAH lockscreen. Dimuat sekaligus selagi
 * pembaca masih mengetik sandi — di situlah satu-satunya jeda tenang dalam
 * alur ini. Sesudahnya tidak ada lagi saat lengang: spiral, zoom, dan
 * hamburan bunga datang beruntun, dan gambar yang baru diminta di tengah
 * animasi berarti dekode gambar tepat di frame yang seharusnya mulus.
 */
const ALL = [
  ...burstSrcs,
  ...burstFlowers,
  flower.branchBlossom,
  flower.leaves,
  flower.dragonfly,
  COVER,
]

let done = false

export function preloadAssets() {
  if (done) return
  done = true
  for (const src of ALL) {
    const img = new Image()
    // Dekode di luar thread utama, jadi memanaskan cache tidak ikut
    // membekukan lockscreen yang sedang dipakai.
    img.decoding = 'async'
    img.src = src
  }
}
