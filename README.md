# Surat Amplop

Surat digital berbentuk amplop merah yang dibuka dengan animasi, dilindungi
lockscreen PIN. Dibuat dengan React + Vite + [Motion](https://motion.dev).

Alurnya: **lockscreen PIN → bunga berhamburan saat kunci terbuka → amplop
tersegel dengan latar bunga bergerak → flap terbuka & kertas naik → kertas
ter-zoom memenuhi layar → halaman surat yang bisa digulir.**

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil produksi ke folder dist/
npm run preview  # mengecek hasil build secara lokal
```

## Mengubah isi undangan

Semua yang mungkin ingin Anda ganti ada di satu berkas: **`src/config.ts`**.

```ts
export const config = {
  pin: '1234',              // PIN 4 digit
  rememberUnlock: true,     // true = refresh tidak mengunci ulang (selama tab hidup)
  lock: { ... },            // teks di lockscreen
  envelope: { ... },        // teks di sekitar amplop
  preview: { ... },         // teks di kertas saat mengintip keluar amplop
  sections: [ ... ],        // isi surat yang digulir
}
```

### Menyusun ulang isi

`sections` adalah sebuah array. Tambah, hapus, atau ubah urutannya sesuka Anda —
halaman akan menyesuaikan. Tersedia dua jenis section, masing-masing memenuhi
satu layar penuh dan tampil kata demi kata lewat `BlurText`:

| `kind` | Kegunaan | Kolom |
|---|---|---|
| `hero` | Pembuka: judul besar + subjudul | `eyebrow`, `title`, `script`, `subtitle` |
| `quote` | Satu kutipan besar per layar | `body`, `source` |

Karena hurufnya besar, jaga tiap `body` kutipan tetap ringkas (idealnya di
bawah ~25 kata) supaya tidak melimpah di layar sempit.

Kalau butuh jenis baru, tambahkan varian di tipe `Section` (`src/config.ts`)
lalu tangani `kind` barunya di `SectionView` (`src/components/Invitation.tsx`).

## Aset bunga

Ilustrasi cat air ada di `public/flowers/` sebagai WebP (14 berkas, total
sekitar 480 KB — hasil konversi dari PNG aslinya yang berukuran ratusan MB).
Setiap berkas sudah dipangkas rapat ke bentuk bunganya, sehingga ukuran yang
ditulis di CSS benar-benar sesuai dengan yang terlihat.

Aset dipakai di tiga tempat:

| Berkas | Dipakai di |
|---|---|
| `src/lib/flowers.ts` | daftar nama berkas + kumpulan bunga untuk hamburan |
| `src/components/FlowerBurst.tsx` | hamburan bunga saat kunci terbuka |
| `src/components/FloatingGarden.tsx` | bunga latar yang mengambang di belakang amplop |
| `src/components/Invitation.tsx` | hiasan sudut di halaman surat |

**Mengganti bunga:** timpa berkas di `public/flowers/` dengan nama yang sama —
tidak perlu menyentuh kode. Pakai WebP dengan latar transparan dan sisi
terpanjang sekitar 400–700 px. Kalau ingin menambah bunga baru, daftarkan
namanya di `src/lib/flowers.ts`.

Komposisi bunga latar diatur manual di array `blooms`
(`FloatingGarden.tsx`) — posisi, ukuran, opasitas, dan kecepatan goyangnya
ditulis eksplisit agar tetap rapi di layar sempit maupun lebar.

## Pemutar musik

Widget "now playing" mengambang tetap di layar selama halaman surat dibaca
(tidak ikut tergulir), dibangun dari dua berkas:

| Berkas | Isi |
|---|---|
| `src/lib/musicPlayer.ts` | elemen `Audio` singleton di scope modul + hook `useBackgroundAudio` |
| `src/components/MusicPlayer.tsx` + `.module.css` | kartu cakram berputar, waveform, judul/artis, progres |

Lagunya **sengaja tidak diputar otomatis** — kebijakan autoplay browser
biasanya tetap memblokirnya walau ada gestur PIN sebelumnya, jadi diputar
lewat ketukan pengguna pada kartu. Elemen audio dibuat di scope modul (bukan
di dalam komponen) supaya lagu tidak terputus saat `Letter` (tempat kartu ini
dulu berada) atau bagian lain unmount — ia terus berjalan di latar selama tab
masih terbuka.

**Mengganti lagu:** timpa `public/the-night-we-meet.mp3` dan
`public/the-night-we-meet-cover-image.jpg`, lalu sesuaikan judul/artis dan
path aset di `MusicPlayer.tsx` serta `musicPlayer.ts`.

Ukuran kartu mengikuti `--env-w` — sama seperti aset di dalam `Letter` — jadi
untuk memperbesar/memperkecil widget ini cukup timpa `--env-w` di pembungkusnya
(`.musicDock` pada `Invitation.module.css`), tanpa menyentuh berkas
`MusicPlayer` sama sekali.

## Mengubah warna & font

Ada di **`src/styles/tokens.css`** sebagai CSS custom properties — warna merah
amplop, warna kertas, tinta, wax seal, font, sampai ukuran kanvas. Amplop
sepenuhnya digambar dengan CSS, jadi mengganti `--red-*` langsung mengubah
seluruh tampilannya tanpa perlu menyentuh gambar apa pun.

Font diambil dari Google Fonts lewat `index.html` (Playfair Display, Pinyon
Script, Inter). Ganti di sana kalau ingin font lain.

## Catatan tentang PIN

PIN diperiksa di sisi peramban, sehingga siapa pun yang membuka source code
halaman bisa membacanya. Ini pengaman kasual — untuk menjaga tamu tidak
membuka undangan sebelum waktunya — **bukan** pengamanan yang sebenarnya.
Jangan taruh apa pun yang benar-benar rahasia di balik PIN ini.

## Tata letak

Dirancang mobile-first dengan format potret. Di layar lebar, undangan tampil
sebagai bingkai potret di tengah layar (seperti frame story), bukan diregangkan
mengisi lebar desktop. Pengaturannya ada di media query pada `tokens.css` dan
`src/App.module.css`.

Mode `prefers-reduced-motion` dihormati: seluruh animasi dipangkas menjadi
nyaris seketika, tetapi alurnya tetap bisa diselesaikan sampai akhir.

## Peta berkas

```
public/flowers/              ← 14 ilustrasi bunga (WebP)
src/
  config.ts                  ← ubah isi surat di sini
  App.tsx                    ← mesin tahapan: locked → sealed → opening → zooming → reading
  styles/tokens.css          ← warna, font, ukuran kanvas
  lib/
    flowers.ts               ← daftar aset bunga
    paperTexture.ts          ← tekstur kertas (SVG noise, tanpa berkas gambar)
  components/
    LockScreen.tsx           ← keypad PIN
    FlowerBurst.tsx          ← hamburan bunga saat kunci terbuka
    FloatingGarden.tsx       ← bunga latar yang bergerak pelan
    EnvelopeScene.tsx        ← amplop, flap 3D, wax seal, animasi kertas naik & zoom
    Letter.tsx               ← kertas yang mengintip keluar amplop
    Invitation.tsx           ← halaman surat yang digulir + hiasan sudut
    Reveal.tsx               ← pembungkus animasi muncul saat masuk viewport
```
