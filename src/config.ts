/**
 * ============================================================
 *  SATU-SATUNYA FILE YANG PERLU DIEDIT UNTUK MENGGANTI KONTEN
 * ============================================================
 *  Ubah teks di bawah ini sesuai acara Anda. Tidak perlu
 *  menyentuh file lain kecuali ingin mengubah warna
 *  (lihat src/styles/tokens.css).
 */

export type Section =
  | { kind: 'hero'; eyebrow?: string; title: string; script?: string; subtitle?: string }
  | { kind: 'quote'; body: string; source?: string }

export const config = {
  /** PIN 4 digit untuk membuka lockscreen. */
  pin: '0407',

  /** Kalau true, status terbuka diingat selama tab masih hidup (refresh tidak mengunci lagi). */
  rememberUnlock: true,

  /** Teks pada lockscreen. */
  lock: {
    title: 'U Here!!',
    hint: 'the date we met (dd/mm)',
    error: 'ihh salah, coba lagi deh',
  },

  /** Dua tombol di ujung surat. */
  closing: {
    /** Menghamburkan bunga melayang. */
    button: 'i got something for u',
    /** Membuka percakapan WhatsApp. */
    reply: 'Say something?',
    /**
     * Nomor WhatsApp dalam format internasional: TANPA tanda plus dan tanpa
     * angka nol di depan. wa.me tidak mengenali format lokal seperti 0818…
     */
    whatsapp: '6281818794341',
  },

  /**
   * Lagu latar. Berkasnya sendiri ada di folder public — kalau diganti,
   * sesuaikan juga nama berkas di src/lib/musicPlayer.ts.
   */
  music: {
    title: 'The Night We Met',
    artist: 'Lord Huron',
  },

  /** Teks kecil di depan amplop dan petunjuk tap. */
  envelope: {
    to: 'Dari Yafi untuk',
    guest: 'Liaa',
    hint: 'Coba Klik Amplopnya',
    /** Muncul setelah kertas keluar, saat menunggu digulir atau diketuk. */
    scrollHint: 'Coba scroll atau Klik Amplopnya',
  },

  /**
   * Isi surat — di-scroll setelah kertas ter-zoom.
   * Bagian PERTAMA tampil dua kali, apa pun jenisnya: sebagai isi kertas yang
   * mengintip keluar dari amplop, lalu sebagai layar pertama halaman surat.
   * Keduanya otomatis ikut kalau bagian ini diubah.
   * Setiap bagian memenuhi satu layar penuh dan muncul kata demi kata.
   * Karena hurufnya besar, jaga tiap kutipan tetap ringkas — kira-kira
   * maksimal 25 kata agar tidak melimpah di layar kecil.
   */
  sections: [
    {
      kind: 'quote',
      body: 'haloo liaaa',
    },
    {
      kind: 'quote',
      body: 'gimana kabar kamu?? semoga baik yaa..',
    },
    {
      kind: 'quote',
      body: 'eee aku bingung harus mulai dari mana, tapi jujur web ini aku buat bener-bener untuk minta maaf ke kamu, meski waktu itu aku udah minta maaf dan kamu maafin, cuman aku masih ngerasa gak enak sama kamu.',
    },
    {
      kind: 'quote',
      body: 'Kalau emang waktu kita ketemu, aku gabisa ngetreat kamu dengan baik, maafin aku yaa.. jujur, aku gaada maksud untuk ngelakuin itu. Aku tau aku salah dan aku terima kalo ini konsekuensinya.',
    },
    {
      kind: 'quote',
      body: 'Sebenarnya aku masih berharap untuk bisa sama" lagi. cuman kalo pada akhirnya kamu ngerasa gabisa, yaa it\'s okay... aku tahu kamu punya hak untuk itu, but i hope we can meet again someday',
    },
    {
      kind: 'quote',
      body: 'Semoga kamu sehat" yaa dan semoga bisa cepet lulus biar bisa aku panggil bu lia, hehe. i will be sooooooo proud, Semangattttt!!!',
    },
  ] satisfies Section[],
}
