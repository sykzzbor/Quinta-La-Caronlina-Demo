// Grano de papel, favicon y tarjeta para compartir (OG) a partir del monograma real.
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

// Grano: ruido gris con alfa, en mosaico
const N = 180;
const px = Buffer.alloc(N * N * 4);
for (let i = 0; i < N * N; i++) {
  const v = Math.random() * 255;
  px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = v;
  px[i * 4 + 3] = 90 + Math.random() * 100;
}
await sharp(px, { raw: { width: N, height: N, channels: 4 } }).png().toFile('public/grain.png');

// Favicon: monograma verde sobre lino
const svg = readFileSync('src/qc-mark.svg', 'utf8');
const vb = /viewBox="([^"]+)"/.exec(svg)[1].split(' ').map(Number);
const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/currentColor/g, '#1d4424');
const size = Math.max(vb[2], vb[3]) * 1.18;
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ede4d9"/><g transform="translate(${(size - vb[2]) / 2 - vb[0]} ${(size - vb[3]) / 2 - vb[1]})">${inner}</g></svg>`;
writeFileSync('public/favicon.svg', fav);

// OG 1200×630: foto de la boda + lino con el monograma
const photo = await sharp('raw/DWMtCsQERBH_2.jpg').resize(700, 630, { fit: 'cover', position: 'attention' }).toBuffer();
const markW = 300;
const mark = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${markW}">${inner}</svg>`)).png().toBuffer();
const markMeta = await sharp(mark).metadata();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ede4d9' } })
  .composite([
    { input: photo, left: 500, top: 0 },
    { input: mark, left: Math.round((500 - markW) / 2), top: Math.round((630 - markMeta.height) / 2) - 20 },
  ])
  .jpeg({ quality: 84 })
  .toFile('public/og.jpg');
console.log('ok');
