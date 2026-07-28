/**
 * Tekstur kertas dibuat dari SVG feTurbulence yang dikodekan sebagai data URI,
 * sehingga tidak ada permintaan jaringan dan tidak ada berkas gambar di repo.
 */
function noiseDataUri(baseFrequency: number, opacity: number, seed: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="4" seed="${seed}" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="220" height="220" filter="url(#n)" opacity="${opacity}"/>
  </svg>`
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
}

/** Serat halus untuk permukaan kertas. */
export const paperNoise = noiseDataUri(0.85, 0.32, 7)

/** Butiran lebih kasar untuk latar belakang panggung. */
export const backdropNoise = noiseDataUri(0.6, 0.22, 3)
