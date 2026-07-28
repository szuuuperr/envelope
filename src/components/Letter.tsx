import { config } from '../config'
import { PaperBackdrop, PaperOverlay } from './PaperLayers'
import { SectionView } from './SectionView'
import styles from './Letter.module.css'

const first = config.sections[0]

/**
 * Kertas yang mengintip keluar dari amplop, lalu membesar mengisi layar.
 *
 * Isinya bukan desain tersendiri, melainkan bagian PERTAMA halaman surat yang
 * sama persis — komponen dan berkas CSS-nya dipakai bersama — hanya digambar
 * pada kanvas versi mini (lihat .paper di berkas CSS-nya). Karena kertas
 * sebangun dengan kanvas, di akhir zoom setiap elemen di kertas jatuh tepat
 * menimpa kembarannya di halaman surat, jadi pergantiannya tidak terlihat.
 *
 * Sengaja mengambil bagian pertama apa adanya, bukan mencari yang berjenis
 * hero: urutan bagian di config.ts boleh diubah tanpa membuat kertas ini
 * kosong atau menampilkan layar yang berbeda dari tujuan zoom.
 */
export function Letter() {
  return (
    <div className={styles.paper}>
      <PaperBackdrop animated={false} />
      <div className={styles.content}>
        {first && <SectionView section={first} animated={false} />}
      </div>
      <PaperOverlay />
    </div>
  )
}
