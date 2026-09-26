// Traza el monograma QC + picaflor del post "Nueva identidad" a SVG (potrace).
import sharp from 'sharp';
import potrace from 'potrace';
import { writeFileSync } from 'node:fs';

const SRC = 'raw/DVd6jbyDRHF_1.jpg';
const region = { left: 440, top: 440, width: 540, height: 400 };

const buf = await sharp(SRC).extract(region).resize(region.width * 3)
  .greyscale().normalise().threshold(150).png().toBuffer();

potrace.trace(buf, { threshold: 128, turdSize: 400, optTolerance: 0.3, color: 'currentColor', background: 'transparent' }, (err, svg) => {
  if (err) throw err;
  writeFileSync('src/qc-mark.svg', svg);
  console.log('svg bytes', svg.length);
});
