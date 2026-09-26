// Genera todo el material del sitio a partir de raw/ (posts públicos de Instagram y Facebook).
//   node scripts/build-media.mjs          → fotos + fotogramas + videos
//   node scripts/build-media.mjs --img    → solo fotos
// Salida: public/img/<nombre>-<ancho>.webp, public/video/*.mp4 y src/img-data.json
import sharp from 'sharp';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';

const FF = ffmpeg.path;
const RAW = 'raw';
const FRAMES = 'raw/frames';
const OUT_IMG = 'public/img';
const OUT_VID = 'public/video';
const onlyImages = process.argv.includes('--img');
[FRAMES, OUT_IMG, OUT_VID].forEach((d) => mkdirSync(d, { recursive: true }));

const WEDDING_REEL = `${RAW}/Cn2gOO1p-ed_1.mp4`; // Boda Luciana y Alejandro
const VENUE_REEL = `${RAW}/DXFuxWwDSK__1.mp4`; // Recorrido del lugar (sorteo)

// Fotogramas de los reels que se usan como fotos
const FRAME_LIST = [
  { name: 'reel-mesas', src: WEDDING_REEL, t: 14.3 },
  { name: 'reel-arco', src: WEDDING_REEL, t: 21.6 },
  { name: 'reel-jaulas', src: WEDDING_REEL, t: 28.4 },
  { name: 'reel-galeria', src: WEDDING_REEL, t: 32.6 },
  { name: 'reel-aereo', src: WEDDING_REEL, t: 12.2 },
  { name: 'reel-ingreso', src: VENUE_REEL, t: 0.4 },
  { name: 'reel-carpa', src: VENUE_REEL, t: 31.5 },
];

// Fotos: nombre → archivo en raw/ (o raw/frames) + recorte opcional
const IMAGES = {
  // Parque
  'parque-arbol': { src: 'DVd6jbyDRHF_2.jpg' },
  'parque-autitos': { src: 'Dbn2HQkEffS_3.jpg' },
  'parque-cartel': { src: 'Da5i9HAESuR_1.jpg' },
  'parque-cartel-2': { src: 'Da5i9HAESuR_2.jpg' },
  'parque-mesas': { src: 'frames/reel-mesas.jpg' },
  'parque-arco': { src: 'frames/reel-arco.jpg' },
  'parque-jaulas': { src: 'frames/reel-jaulas.jpg' },
  'parque-galeria': { src: 'frames/reel-galeria.jpg' },
  'parque-aereo': { src: 'frames/reel-aereo.jpg', crop: { left: 0, top: 0, width: 770, height: 544 } },
  'ingreso': { src: 'frames/reel-ingreso.jpg' },
  'aereo-carpa': { src: 'frames/reel-carpa.jpg' },
  // Bodas
  'boda-camino': { src: 'DWMtCsQERBH_1.jpg' },
  'boda-beso': { src: 'DWMtCsQERBH_2.jpg' },
  'boda-anillos': { src: 'DWMtCsQERBH_3.jpg' },
  'boda-frente': { src: 'DWMtCsQERBH_4.jpg' },
  'boda-bienvenidos': { src: 'CzICg-Kuv_y_1.jpg' },
  'boda-pizarra': { src: 'CzICg-Kuv_y_2.jpg' },
  'boda-farol': { src: 'CzICg-Kuv_y_4.jpg' },
  'boda-mesa': { src: 'CzICg-Kuv_y_5.jpg' },
  'boda-gracias': { src: 'CzICg-Kuv_y_6.jpg' },
  'boda-velas': { src: 'CzICg-Kuv_y_7.jpg' },
  'boda-baile': { src: 'CzICg-Kuv_y_8.jpg' },
  // Salón
  'salon-mesas': { src: 'CzICg-Kuv_y_3.jpg' },
  'salon-bn': { src: 'CzICg-Kuv_y_9.jpg' },
  'salon-fiesta': { src: 'Da9GzT4DRAp_1.jpg' },
  'salon-barra': { src: 'Da9GzT4DRAp_2.jpg' },
  'salon-largo': { src: 'Da9GzT4DRAp_4.jpg' },
  'salon-negro': { src: 'Da5i9HAESuR_5.jpg' },
  'salon-ventanal': { src: 'Dbn2HQkEffS_4.jpg' },
  // Edades
  'edad-0': { src: 'DcL_YFhkeep_1.jpg' },
  'edad-0b': { src: 'DcL_YFhkeep_3.jpg' },
  'edad-3': { src: 'Dbn2HQkEffS_1.jpg' },
  'edad-3b': { src: 'Dbn2HQkEffS_2.jpg' },
  'edad-30': { src: 'DdB7qk3ETdt_1.jpg' },
  'edad-30b': { src: 'DdB7qk3ETdt_2.jpg' },
  'edad-50': { src: 'Da9GzT4DRAp_3.jpg' },
  'edad-70': { src: 'Da5i9HAESuR_4.jpg' },
  'edad-70b': { src: 'Da5i9HAESuR_3.jpg' },
  'edad-80': { src: 'Dc_b8ZpEbgi_3.jpg' },
  'edad-80b': { src: 'Dc_b8ZpEbgi_1.jpg' },
  // Noche
  'noche-guirnaldas': { src: 'fb_cover.jpg' },
};

const WIDTHS = [480, 800, 1200, 1600];

function run(args) {
  execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
}

async function frames() {
  for (const f of FRAME_LIST) {
    const out = `${FRAMES}/${f.name}.jpg`;
    run(['-ss', String(f.t), '-i', f.src, '-frames:v', '1', '-q:v', '1', out]);
  }
  console.log('fotogramas', FRAME_LIST.length);
}

async function images() {
  const data = {};
  for (const [name, cfg] of Object.entries(IMAGES)) {
    const input = `${RAW}/${cfg.src}`;
    if (!existsSync(input)) throw new Error(`falta ${input}`);
    let base = sharp(input).rotate();
    if (cfg.crop) base = base.extract(cfg.crop);
    const buf = await base.toBuffer();
    const meta = await sharp(buf).metadata();
    const widths = WIDTHS.filter((w) => w < meta.width * 1.02);
    if (!widths.length || widths[widths.length - 1] < meta.width * 0.9) widths.push(meta.width);
    for (const w of widths) {
      await sharp(buf).resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 80, effort: 5 }).toFile(`${OUT_IMG}/${name}-${w}.webp`);
    }
    const { dominant } = await sharp(buf).stats();
    const color = `#${[dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
    data[name] = { w: meta.width, h: meta.height, widths, color };
  }
  writeFileSync('src/img-data.json', JSON.stringify(data, null, 1));
  console.log('fotos', Object.keys(data).length);
}

async function videos() {
  // Toma aérea del parque: 5.5 s, ralentizada, ida y vuelta para que el loop no salte.
  // delogo borra la fecha que la cámara imprimió en la esquina.
  run(['-ss', '8.2', '-t', '5.4', '-i', WEDDING_REEL, '-an', '-filter_complex',
    '[0:v]delogo=x=776:y=100:w=120:h=44,setpts=1.45*PTS,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]',
    '-map', '[v]', '-c:v', 'libx264', '-crf', '25', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    `${OUT_VID}/parque-aereo.mp4`]);
  run(['-ss', '8.2', '-i', WEDDING_REEL, '-frames:v', '1', '-vf', 'delogo=x=776:y=100:w=120:h=44', '-q:v', '2', `${FRAMES}/aereo-poster.jpg`]);
  await sharp(`${FRAMES}/aereo-poster.jpg`).webp({ quality: 78 }).toFile(`${OUT_VID}/parque-aereo.webp`);

  // Camino al altar: recorrido por el pasillo de arpillera bajo el arco de madera.
  run(['-ss', '21.0', '-t', '5.6', '-i', WEDDING_REEL, '-an', '-vf', 'setpts=1.25*PTS',
    '-c:v', 'libx264', '-crf', '25', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    `${OUT_VID}/ceremonia.mp4`]);
  run(['-ss', '21.0', '-i', WEDDING_REEL, '-frames:v', '1', '-q:v', '2', `${FRAMES}/ceremonia-poster.jpg`]);
  await sharp(`${FRAMES}/ceremonia-poster.jpg`).webp({ quality: 78 }).toFile(`${OUT_VID}/ceremonia.webp`);
  console.log('videos ok');
}

if (!onlyImages) await frames();
await images();
if (!onlyImages) await videos();
