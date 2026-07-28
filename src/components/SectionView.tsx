import type { ReactNode } from 'react'
import type { Section } from '../config'
import { BlurText } from './BlurText'
import styles from './Invitation.module.css'

type LineProps = {
  animated: boolean
  text: string
  className: string
  delay?: number
  direction?: 'top' | 'bottom'
  stepDuration?: number
  threshold?: number
}

/**
 * Satu baris teks — beranimasi kata demi kata, atau diam di posisi akhir.
 *
 * Versi diam dipakai kertas di dalam amplop: teksnya harus sudah berada di
 * tempat terakhirnya, karena itulah yang ditimpa persis oleh halaman surat
 * saat zoom selesai. Keduanya memakai elemen <p> dan kelas yang sama supaya
 * tata letaknya benar-benar identik.
 */
function Line({ animated, text, className, ...blur }: LineProps) {
  if (!animated) return <p className={className}>{text}</p>
  return <BlurText text={text} className={className} {...blur} />
}

type Props = {
  section: Section
  animated?: boolean
  trailing?: ReactNode
}

/**
 * Satu bagian surat setinggi layar penuh.
 *
 * Dipakai di dua tempat: sebagai bagian halaman surat, dan — untuk bagian
 * PERTAMA saja — sebagai isi kertas yang mengintip keluar dari amplop.
 * Karena itu komponen ini harus sanggup menggambar jenis bagian apa pun,
 * bukan hanya hero: mengganti urutan bagian di config.ts otomatis ikut
 * mengganti tampilan kertasnya, dan pertemuan di akhir zoom tetap rapat.
 */
export function SectionView({ section, animated = true, trailing }: Props) {
  if (section.kind === 'hero') {
    return (
      <section className={styles.screen}>
        {section.eyebrow && (
          <Line
            animated={animated}
            text={section.eyebrow}
            className={styles.eyebrow}
            delay={60}
            stepDuration={0.3}
          />
        )}
        <Line
          animated={animated}
          text={section.title}
          className={styles.heroTitle}
          delay={180}
          stepDuration={0.45}
        />
        {section.script && (
          <Line
            animated={animated}
            text={section.script}
            className={styles.heroScript}
            delay={140}
            direction="bottom"
            stepDuration={0.45}
          />
        )}
        {section.subtitle && (
          <Line
            animated={animated}
            text={section.subtitle}
            className={styles.heroSubtitle}
            delay={70}
            stepDuration={0.3}
          />
        )}
        {trailing}
      </section>
    )
  }

  return (
    <section className={styles.screen}>
      <span className={styles.mark}>&ldquo;</span>
      <Line
        animated={animated}
        text={section.body}
        className={styles.quote}
        delay={110}
        stepDuration={0.4}
        threshold={0.25}
      />
      {section.source && (
        <Line
          animated={animated}
          text={section.source}
          className={styles.source}
          delay={60}
          direction="bottom"
          stepDuration={0.3}
          threshold={0.25}
        />
      )}
      {trailing}
    </section>
  )
}
