const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assets = [
  'apps/web/public/assets/hero-4k.png',
  'apps/web/public/assets/hero-4k-warm.png',
  'apps/web/public/assets/hero-4k-cold.png',
  'apps/web/public/assets/hero-4k-spotlight.png'
];

(async () => {
  try {
    for (const src of assets) {
      if (!fs.existsSync(src)) {
        console.warn('Skipping missing asset', src);
        continue;
      }
      const dir = path.dirname(src);
      const base = path.basename(src, path.extname(src));
      const webpOut = path.join(dir, base + '.webp');
      const pngOut = path.join(dir, base + '.opt.png');

      console.log('Optimizing', src);
      // Generate WebP (lossless for fidelity, but smaller)
      await sharp(src)
        .webp({ quality: 90 })
        .toFile(webpOut);

      // Re-encode optimized PNG (strip metadata, use zlib settings)
      await sharp(src)
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(pngOut);

      console.log('Wrote', webpOut, pngOut);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
