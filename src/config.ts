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
      body: 'haii lia 👋🏻',
    },
    {
      kind: 'quote',
      body: 'selamat pagi, siang, malam. gimana kabar kamu?? semoga baik yaa..',
    },
    {
      kind: 'quote',
      body: 'aku disini cuman mau cerita aja tentang pengalaman ku KKN kemarin.',
    },
    {
      kind: 'quote',
      body: 'tau gasih kalo sebenernya aku gaada niatan ikut KKN di semester ini, cuman waktu itu aku diajakin temen aku buat daftar KKN dan alhamdulilah aku lolos seleksi dan berangkat ke NTT.',
    },
    {
      kind: 'quote',
      body: 'awalnya aku expect kalo KKN ini bakal sama seperti KKN" yang lain, tapi ternyata diluar ekpetasi ku dan sangat berkesan banget buat aku.',
    },
    {
      kind: 'quote',
      body: 'jadi persiapan kkn ini bener" mepet banget, dari awal pengumuman sampai keberangkatan cuman ada waktu 10 hari. Terus kita sekelompok baru temu perdana h-2 sebelum keberangkatan dan bener" belom kenal satu sama lain.',
    },
    {
      kind: 'quote',
      body: 'Waktu itu kita berangkat dari kampus ke jakarta terus lanjut ke labuan bajo. nah dari bajo lanjut ke manggarai naik mobil ber-delapan dan itu bener-bener sempit banget sampe gabisa pindah posisi, ditambah lagi jalannya yang beuhhhh.., kayak roller coster.',
    },
    {
      kind: 'quote',
      body: 'Sampe manggarai jam 11 malam dan disana aku langsung mandi dan waktu mandi... Air nya itu dingin bangett, kataku kayak air es. dan jujur disitu aku capekk bangettt.',
    },
    {
      kind: 'quote',
      body: 'nah besoknya kita ada acara penyambutan dari pihak UNIKA (jadi kkn ini kolaborasi sama kampus di manggarai) sekalian temu perdana sama dpl. bu yeiyien namanya, di orang bali yang udah tinggal lama di ruteng.',
    },
    {
      kind: 'quote',
      body: 'setelah acara kita lanjut ke desa ketemu sama PJ kades dan perangkat desa lainnya. jadi aku di tempatin di desa ranaka, desa ini itu desa yang paling ujung di provinsi manggarai dan lumayan jauh dari penginapan.',
    },
    {
      kind: 'quote',
      body: 'Selama KKN aku ketemu PJ kades yang baik banget, namanya itu pak marco cuman kita sering panggil dia pak PJ.',
    },
    {
      kind: 'quote',
      body: 'terus juga selama di desa kita makan siang di salah satu rumah warga yang kebetulan juga perangkat desa. kita sering panggil mereka mama mari dan bapak yuan dan mereka berdua salah satu orang yang baikkkk bangetttt sampe kita sekelompok ngerasa mereka jadi papa mama kita selama kita di NTT.',
    },
    {
      kind: 'quote',
      body: 'mumpung di sana kita sekelompok juga sekalian jalan" ke beberapa tempat yang wahhhh, gilaa, bagussss bangetttt.',
    },
    {
      kind: 'quote',
      body: 'jadi kita pertama pergi ke ruteng pu\'u, ini kek komplek perumahan adat gitu. terus kita pergi ke danau rana mesa yang bagus bangett.',
    },
    {
      kind: 'quote',
      body: 'terus kita juga ke padang mosui yang view nya ada gunung dan pantai. terus kita ke nuca molas dan wahhh ituu vieww nya bagusss bangett. terakhir kita daki ke puncak ranaka yang gilaaa juga itu view nya.',
    },
    {
      kind: 'quote',
      body: 'Minimal sekali seumur hidup kamu harus ke NTT sihh, bener kata orang kalo NTT itu Negeri Titipan Tuhan.',
    },
    {
      kind: 'quote',
      body: 'Dan mungkin itu aja sedikit cerita aku, terimakasih udah mau baca.',
    },
    {
      kind: 'quote',
      body: 'aku liat kamu juga habis selesai PLP, gimana?? seru kah??',
    },
  ] satisfies Section[],
}
