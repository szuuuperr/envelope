import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { config } from "../config";
import { Flowers, type FlowersHandle } from "./Flowers";
import { PaperBackdrop, PaperOverlay } from "./PaperLayers";
import { SectionView } from "./SectionView";
import { MusicPlayer } from "./MusicPlayer";
import styles from "./Invitation.module.css";

export function Invitation() {
  const [scrolled, setScrolled] = useState(false);
  const flowersRef = useRef<FlowersHandle>(null);

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <PaperBackdrop />

      <div
        className={styles.page}
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 24)}
      >
        <div className={styles.flow}>
          {config.sections.map((section, i) => (
            <SectionView
              key={i}
              section={section}
              // Bagian pertama sengaja TIDAK beranimasi. Isinya sama persis
              // dengan kertas yang baru saja selesai di-zoom, jadi kalau ia
              // ikut muncul kata demi kata, teks yang sudah terbaca utuh di
              // kertas akan terlihat mengulang dirinya sendiri dari nol.
              animated={i !== 0}
              trailing={
                i === 0 ? (
                  // Ditaruh sebagai anak biasa di dalam alur hero (bukan
                  // fixed-position berdasar persentase stage-h) supaya
                  // jaraknya terhadap subtitle di atasnya selalu benar,
                  // berapa pun tinggi konten hero pada berbagai ukuran
                  // layar — posisi berbasis persentase pernah menyebabkan
                  // teks "Gulir" ini bertumpuk dengan subtitle di layar lebar.
                  <AnimatePresence>
                    {!scrolled && (
                      <motion.div
                        className={styles.scrollCue}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        // Exit diberi transisi sendiri: kalau ikut memakai
                        // transisi denyut di bawah (repeat: Infinity), animasi
                        // keluar tidak pernah selesai dan AnimatePresence tak
                        // pernah melepas elemennya.
                        exit={{
                          opacity: 0,
                          transition: { duration: 0.4, repeat: 0 },
                        }}
                        transition={{
                          opacity: {
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                      >
                        Swipe Up
                        <span />
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : i === config.sections.length - 1 ? (
                  // Penutup surat. Ikut sebagai anak alur bagian terakhir,
                  // jadi tombolnya baru terlihat setelah kalimat penutup
                  // benar-benar tergulir sampai habis.
                  <div className={styles.closingActions}>
                    <motion.button
                      type="button"
                      className={styles.flowerButton}
                      onClick={() => flowersRef.current?.launchAnimation()}
                      whileTap={{ scale: 0.94 }}
                    >
                      {config.closing.button}
                    </motion.button>

                    <motion.a
                      className={styles.replyButton}
                      href={`https://wa.me/${config.closing.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.94 }}
                    >
                      {config.closing.reply}
                    </motion.a>
                  </div>
                ) : undefined
              }
            />
          ))}
        </div>
      </div>

      <PaperOverlay />

      {/* Di luar .page supaya bunga melintasi seluruh layar, bukan hanya
          sepotong surat yang sedang tergulir. */}
      <Flowers ref={flowersRef} />

      {/* Mengambang tetap di layar (bukan anak .page), supaya lagu bisa
          dijeda/diputar kapan pun tanpa peduli seberapa jauh surat digulir. */}
      <div className={styles.musicDock}>
        <MusicPlayer />
      </div>
    </motion.div>
  );
}
