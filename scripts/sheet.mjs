// Contact sheet: node scripts/sheet.mjs out.jpg file1 file2 ... (labels each tile)
import sharp from 'sharp';
const [out, ...files] = process.argv.slice(2);
const W = 300, cols = 4, pad = 6;
const tiles = [];
for (const f of files) {
  const img = sharp(f).resize(W, W * 1.25, { fit: 'cover' });
  const meta = await sharp(f).metadata();
  const label = Buffer.from(`<svg width="${W}" height="22"><rect width="100%" height="100%" fill="#000" opacity=".7"/><text x="6" y="16" font-size="13" font-family="Arial" fill="#fff">${f.split('/').pop()} ${meta.width}x${meta.height}</text></svg>`);
  tiles.push(await img.composite([{ input: label, gravity: 'south' }]).toBuffer());
}
const rows = Math.ceil(tiles.length / cols), H = W * 1.25;
await sharp({ create: { width: cols * (W + pad), height: rows * (H + pad), channels: 3, background: '#222' } })
  .composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * (W + pad), top: Math.floor(i / cols) * (H + pad) })))
  .jpeg({ quality: 70 }).toFile(out);
console.log('ok', out, tiles.length);
