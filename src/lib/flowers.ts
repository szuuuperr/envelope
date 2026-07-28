/**
 * Aset bunga cat air, hasil konversi ke WebP dari PNG aslinya.
 * Berkasnya ada di `public/flowers/`, jadi bisa ditukar dengan gambar lain
 * cukup dengan menimpa berkasnya — tanpa mengubah kode.
 */
const url = (name: string) => `${import.meta.env.BASE_URL}flowers/${name}.webp`

export const flower = {
  rose: url('rose'),
  ranunculus: url('ranunculus'),
  peony: url('peony'),
  budMaroon: url('bud-maroon'),
  rosebud: url('rosebud'),
  blossom: url('blossom'),
  sprig: url('sprig'),
  orchidCluster: url('orchid-cluster'),
  orchid: url('orchid'),
  leaves: url('leaves'),
  leafRose: url('leaf-rose'),
  fern: url('fern'),
  branchBlossom: url('branch-blossom'),
  dragonfly: url('dragonfly'),
} as const

/** Bunga yang dihamburkan saat kunci terbuka — dipilih yang bentuknya jelas. */
export const burstFlowers = [
  flower.rose,
  flower.ranunculus,
  flower.peony,
  flower.budMaroon,
  flower.rosebud,
  flower.blossom,
  flower.sprig,
  flower.orchidCluster,
  flower.orchid,
  flower.leaves,
  flower.leafRose,
  flower.fern,
]

/**
 * Angka acak yang dapat diulang. Dipakai supaya tata letak hamburan tetap
 * sama antar render (dan antar pass StrictMode) tanpa perlu menyimpan state.
 */
export function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}
