// Álbum: todas las fotos reales, con el evento y la publicación de origen.
import imgData from './img-data.json';

const IG = 'https://www.instagram.com/quintalacarolina.eventos';
const POSTS = {
  noche: { title: 'Una noche en el parque', meta: 'Portada de Facebook', url: 'https://www.facebook.com/p/Quinta-La-Carolina-Colonia-Caroya-100064660790277/' },
  facu: { title: 'Boda de Facundo y Micaela', meta: '20 de octubre de 2023', url: `${IG}/p/CzICg-Kuv_y/` },
  alfon: { title: 'Boda de Alfonsina y Fernando', meta: '22 de noviembre de 2025 · Foto @sentirfotografialorenap', url: `${IG}/p/DWMtCsQERBH/` },
  luci: { title: 'Boda de Luciana y Alejandro', meta: 'Del video publicado en enero de 2023', url: `${IG}/reel/Cn2gOO1p-ed/` },
  recorrido: { title: 'Recorrido por la quinta', meta: 'Video de abril de 2026', url: `${IG}/reel/DXFuxWwDSK_/` },
  parque: { title: 'El parque', meta: 'Marzo de 2026', url: `${IG}/p/DVd6jbyDRHF/` },
  revela: { title: '¿Nena o nene? · Victoria y Joako', meta: 'Agosto de 2026', url: `${IG}/p/DcL_YFhkeep/` },
  tres: { title: 'Los 3 de Santi y Salva', meta: 'Agosto de 2026', url: `${IG}/p/Dbn2HQkEffS/` },
  mica: { title: 'Los 30 de Mica', meta: 'Septiembre de 2026', url: `${IG}/p/DdB7qk3ETdt/` },
  graciela: { title: 'Los 50 de Graciela', meta: 'Julio de 2026', url: `${IG}/p/Da9GzT4DRAp/` },
  cesar: { title: 'Los 70 de César', meta: 'Julio de 2026', url: `${IG}/p/Da5i9HAESuR/` },
  letizia: { title: 'Los 80 de Letizia', meta: 'Septiembre de 2026', url: `${IG}/p/Dc_b8ZpEbgi/` },
};

// Orden del álbum: el mismo recorrido que el sitio, de la mañana a la noche.
const ITEMS = [
  ['parque-aereo', 'luci', 'Vista aérea del parque: árboles, césped y el salón con techo claro.'],
  ['parque-mesas', 'luci', 'Mesas bajo los árboles con telas blancas colgadas.'],
  ['parque-arco', 'luci', 'Pasillo de arpillera bajo un arco de madera, frente a las galerías.'],
  ['parque-jaulas', 'luci', 'Jaulas decorativas colgando a los lados del pasillo de la ceremonia.'],
  ['parque-galeria', 'luci', 'Galería con techo de cañizo junto a las construcciones de ladrillo.'],
  ['boda-camino', 'alfon', 'Los novios caminan de la mano entre los invitados.'],
  ['boda-beso', 'alfon', 'Los novios se besan en el parque, con la luz de la tarde.'],
  ['boda-anillos', 'alfon', 'Las manos de los novios con sus alianzas y un ramo de flores silvestres.'],
  ['boda-frente', 'alfon', 'Los novios frente con frente, al atardecer.'],
  ['boda-bienvenidos', 'facu', 'Cartel “Bienvenidos a nuestra boda” iluminado con velas.'],
  ['salon-mesas', 'facu', 'El salón de ladrillo con mesas redondas, espejos y atrapasueños.'],
  ['boda-farol', 'facu', 'Farol con una vela sobre una mesa del salón.'],
  ['boda-mesa', 'facu', 'Mesa 9: farol de vidrio, copas y camino de arpillera.'],
  ['salon-bn', 'facu', 'El salón armado para la boda, en blanco y negro.'],
  ['boda-pizarra', 'facu', 'Pizarra con las reglas de la fiesta de Mica y Facu.'],
  ['boda-gracias', 'facu', 'Cartel “Gracias por ser parte de nuestra historia”.'],
  ['boda-velas', 'facu', 'Camino de velas en el parque de noche.'],
  ['boda-baile', 'facu', 'Los novios bailan bajo las guirnaldas de luces.'],
  ['edad-0', 'revela', 'Victoria y Joako junto a la decoración de globos rosas y celestes, en el parque.'],
  ['edad-0b', 'revela', 'Torta con la pregunta “Girl or Boy?”.'],
  ['edad-3', 'tres', 'Santi y Salva soplan las velas de su torta de astronautas.'],
  ['edad-3b', 'tres', 'Decoración espacial con un gran número 3 iluminado.'],
  ['parque-autitos', 'tres', 'Autitos de juguete y conos sobre el césped del parque.'],
  ['salon-ventanal', 'tres', 'Mesas decoradas junto a los ventanales del salón.'],
  ['edad-30', 'mica', 'Mica sopla las velas bajo globos con el número 30.'],
  ['edad-30b', 'mica', 'Mesa redonda con manteles estampados y flores secas.'],
  ['salon-fiesta', 'graciela', 'El salón lleno de invitados.'],
  ['edad-50', 'graciela', 'Espejo con globos blancos y un número 5 hecho de fotos.'],
  ['salon-barra', 'graciela', 'Barra de madera con una guirnalda de globos.'],
  ['salon-largo', 'graciela', 'Mesas largas preparadas en el salón.'],
  ['parque-cartel', 'cesar', 'Cartel “Mis 70 César” con cortaderas, en el parque.'],
  ['parque-cartel-2', 'cesar', 'El cartel de bienvenida sobre el atril, entre los árboles.'],
  ['edad-70', 'cesar', 'Barril con guitarra, sombreros y fardos de paja.'],
  ['edad-70b', 'cesar', 'Arco con fotos colgadas de hilos, en el parque.'],
  ['salon-negro', 'cesar', 'Mesas con manteles negros y platos de sitio cobrizos.'],
  ['edad-80', 'letizia', 'Mesa de los 80 de Letizia con globos y números iluminados.'],
  ['edad-80b', 'letizia', 'Letizia junto a su torta.'],
  ['parque-arbol', 'parque', 'Un árbol del parque con una guirnalda de luces y el galpón con el cartel de la quinta.'],
  ['ingreso', 'recorrido', 'Cartel de la entrada: ingreso por calle 144.'],
  ['aereo-carpa', 'recorrido', 'Vista aérea de la estructura de techo transparente junto a los árboles.'],
  ['noche-guirnaldas', 'noche', 'Invitados en el parque de noche, bajo guirnaldas de luces.'],
];

const src = (name, max = 1600) => {
  const ws = imgData[name].widths;
  const w = [...ws].reverse().find((x) => x <= max) ?? ws[0];
  return `/img/${name}-${w}.webp`;
};
const srcset = (name) => imgData[name].widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ');

export function initAlbum({ onOpen, onClose } = {}) {
  const dialog = document.querySelector('[data-album-dialog]');
  const img = dialog.querySelector('[data-album-img]');
  const title = dialog.querySelector('[data-album-title]');
  const meta = dialog.querySelector('[data-album-meta]');
  const counter = dialog.querySelector('[data-album-count]');
  const strip = dialog.querySelector('[data-album-strip]');
  let index = 0;
  let built = false;
  let opener = null;

  function build() {
    if (built) return;
    built = true;
    const frag = document.createDocumentFragment();
    ITEMS.forEach(([name, , alt], i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'album__thumb';
      b.setAttribute('aria-label', `Foto ${i + 1}: ${alt}`);
      const t = document.createElement('img');
      t.src = src(name, 480);
      t.alt = '';
      t.loading = 'lazy';
      t.decoding = 'async';
      b.append(t);
      b.addEventListener('click', () => show(i));
      frag.append(b);
    });
    strip.append(frag);
  }

  function show(i) {
    index = (i + ITEMS.length) % ITEMS.length;
    const [name, postKey, alt] = ITEMS[index];
    const post = POSTS[postKey];
    img.setAttribute('data-loading', '');
    img.onload = () => img.removeAttribute('data-loading');
    img.sizes = '90vw';
    img.srcset = srcset(name);
    img.src = src(name);
    img.width = imgData[name].w;
    img.height = imgData[name].h;
    img.alt = alt;
    title.textContent = post.title;
    meta.innerHTML = '';
    meta.append(`${post.meta} · `);
    const a = document.createElement('a');
    a.href = post.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = post.url.includes('facebook') ? 'Ver en Facebook' : 'Ver publicación';
    meta.append(a);
    counter.textContent = `${index + 1} de ${ITEMS.length}`;
    strip.querySelectorAll('.album__thumb').forEach((t, k) => {
      if (k === index) {
        t.setAttribute('aria-current', 'true');
        t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      } else t.removeAttribute('aria-current');
    });
  }

  function open(name) {
    build();
    opener = document.activeElement;
    const i = name ? ITEMS.findIndex(([n]) => n === name) : 0;
    show(Math.max(0, i));
    dialog.showModal();
    onOpen?.();
  }

  function close() { dialog.close(); }
  dialog.addEventListener('close', () => { onClose?.(); opener?.focus?.({ preventScroll: true }); });
  dialog.querySelector('[data-album-close]').addEventListener('click', close);
  dialog.querySelector('[data-album-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-album-next]').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
  });

  // Deslizar para pasar fotos
  const stage = dialog.querySelector('.album__stage');
  let x0 = null;
  let y0 = null;
  stage.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; });
  stage.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
  });

  document.querySelectorAll('[data-album]').forEach((b) => b.addEventListener('click', () => open(b.dataset.album)));
  document.querySelectorAll('[data-album-open]').forEach((b) => {
    b.textContent = `Ver el álbum completo · ${ITEMS.length} fotos`;
    b.addEventListener('click', () => open());
  });

  return { open, close };
}
