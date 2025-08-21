const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function render(src, out) {
  if (!fs.existsSync(src)) throw new Error('src not found: ' + src);
  const svgBuffer = fs.readFileSync(src);
  await sharp(svgBuffer, { density: 300 })
    .resize(3840, 2160, { fit: 'cover' })
    .png({ compressionLevel: 0 })
    .toFile(out);
  console.log('Wrote', out);
}

(async () => {
  const src = process.argv[2];
  const out = process.argv[3];
  if (!src || !out) {
    console.error('Usage: node render-svg.js <src.svg> <out.png>');
    process.exit(1);
  }
  try {
    await render(src, out);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
