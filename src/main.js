import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { initQuote } from './quote.js';
import { initAlbum } from './album.js';

gsap.registerPlugin(ScrollTrigger, SplitText);
if (import.meta.env.DEV) window.ST = ScrollTrigger;
// Con capítulos fijados, restaurar un scroll profundo antes de medir rompe los cálculos:
// la posición se guarda al salir y se recupera cuando todo está medido.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const SCROLL_KEY = 'qlc-scroll';
window.addEventListener('pagehide', () => {
  try { sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY))); } catch { /* sin almacenamiento */ }
});
// Sin refresh en "load": todas las imágenes reservan su tamaño, y ese refresh tardío
// (con pines revertidos) recortaba el scroll de quien ya estaba leyendo.
ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,resize' });

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// En celulares no hay tramos fijados ni parallax: el scroll táctil queda nativo y estable.
const mobileMQ = window.matchMedia('(max-width: 899px)');
const mobile = mobileMQ.matches;
const pinHero = !reduce && !mobile;
const pinNight = !reduce && !mobile;
mobileMQ.addEventListener('change', () => location.reload());
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ==========================================================================
   Scroll suave (solo rueda de escritorio; en touch queda nativo)
   ========================================================================== */
let lenis = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target, offset = 0, immediate = false) {
  const el = typeof target === 'string' ? $(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4, immediate });
  else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: reduce || immediate ? 'auto' : 'smooth' });
  }
}

/* ==========================================================================
   Cotizador y álbum
   ========================================================================== */
const quote = initQuote($('[data-inv]'), { scrollTo: scrollToTarget });
const album = initAlbum({ onOpen: () => lenis?.stop(), onClose: () => lenis?.start() });

// Enlaces internos (+ presets del cotizador)
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  const target = id.length > 1 && $(id);
  if (!target) return;
  e.preventDefault();
  if (a.dataset.preset) quote.preset(a.dataset.preset);
  closePrograma(false);
  scrollToTarget(target, id === '#invitacion' && a.dataset.preset ? -20 : 0);
  history.replaceState(null, '', id);
  if (id === '#invitacion') {
    setTimeout(() => $('#invitacion .step:not([hidden]) .step__q')?.focus({ preventScroll: true }), reduce ? 50 : 1300);
  }
});

/* ==========================================================================
   Programa del día (índice)
   ========================================================================== */
const programa = $('#programa');
const progBtn = $('[data-programa-open]');
function openPrograma() {
  programa.hidden = false;
  progBtn.setAttribute('aria-expanded', 'true');
  lenis?.stop();
  document.body.style.overflow = 'hidden';
  if (!reduce) {
    gsap.fromTo(programa, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo($$('.programa__inner > *, .programa__list li', programa), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.035, ease: 'expo.out' });
  }
  $('.programa__list a', programa).focus();
}
function closePrograma(returnFocus = true) {
  if (programa.hidden) return;
  programa.hidden = true;
  progBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  lenis?.start();
  if (returnFocus) progBtn.focus();
}
progBtn.addEventListener('click', openPrograma);
$('[data-programa-close]').addEventListener('click', () => closePrograma());
programa.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePrograma();
  if (e.key === 'Tab') {
    const f = $$('a, button', programa);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
});

/* ==========================================================================
   Videos: se reproducen solo en pantalla, con pausa accesible
   ========================================================================== */
const userPaused = new WeakSet();
$$('video[data-autoplay]').forEach((v) => {
  if (reduce) return;
  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting && !userPaused.has(v)) {
      if (v.preload === 'none') v.preload = 'auto';
      v.play().catch(() => {});
    } else v.pause();
  }, { threshold: 0 });
  io.observe(v);
});
$$('[data-video-toggle]').forEach((btn) => {
  const v = $(btn.dataset.videoToggle);
  const sync = () => {
    const playing = !v.paused;
    btn.textContent = playing ? 'Pausar video' : 'Reproducir video';
    btn.setAttribute('aria-pressed', playing ? 'false' : 'true');
  };
  v.addEventListener('play', sync);
  v.addEventListener('pause', sync);
  btn.addEventListener('click', () => {
    if (v.paused) { userPaused.delete(v); v.play().catch(() => {}); }
    else { userPaused.add(v); v.pause(); }
  });
  sync();
});

/* ==========================================================================
   Todo lo que depende de la tipografía real
   ========================================================================== */
const fontsReady = new Promise((res) => {
  if (root.classList.contains('fonts-ready')) return res();
  const mo = new MutationObserver(() => { if (root.classList.contains('fonts-ready')) { mo.disconnect(); res(); } });
  mo.observe(root, { attributes: true, attributeFilter: ['class'] });
});

fontsReady.then(() => {
  const steps = { wrapFrames, initLight, initHero, initHeadings, initReveals, initParallax, initAges, initSplit, initNight, initChapters, initFloatCta };
  for (const [name, fn] of Object.entries(steps)) {
    try { fn(); } catch (err) { console.error(`[${name}]`, err.message, err.stack); }
  }
  // Los pines (hero y noche) empujan todo lo de abajo: recalcular en orden de página.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  resumeVideos();
  // Volver a donde estaba (ancla o posición guardada), ya con todo medido.
  let saved = null;
  try { saved = sessionStorage.getItem(SCROLL_KEY); } catch { /* sin almacenamiento */ }
  const hash = location.hash && $(location.hash);
  const isReload = performance.getEntriesByType?.('navigation')?.[0]?.type === 'reload';
  if (isReload && saved && +saved > 0) { window.scrollTo(0, +saved); lenis?.scrollTo(+saved, { immediate: true }); }
  else if (hash) scrollToTarget(hash, 0, true);
  requestAnimationFrame(() => { ScrollTrigger.update(); syncScrollState(); resumeVideos(); });
});

// Fijar el hero lo mueve dentro del DOM y eso pausa el video: lo retomamos.
// También al volver a la pestaña (el navegador pausa videos en segundo plano).
document.addEventListener('visibilitychange', () => { if (!document.hidden) resumeVideos(); });
function resumeVideos() {
  if (reduce) return;
  $$('video[data-autoplay]').forEach((v) => {
    const r = v.getBoundingClientRect();
    if (!userPaused.has(v) && r.bottom > 0 && r.top < window.innerHeight) v.play().catch(() => {});
  });
}

// Estado que depende solo de la posición de scroll (luz, capítulo, cabecera)
const syncers = [];
function syncScrollState() { syncers.forEach((fn) => fn()); }

/* ---------- La luz del día: el fondo cambia de color con el scroll ---------- */
function initLight() {
  const backdrop = $('.backdrop');
  // El pie no entra en la luz: llega como un bloque propio y no tiñe el cotizador.
  const toned = $$('section[data-tone]');
  const bg = (el) => getComputedStyle(el).getPropertyValue('--bg').trim();
  const first = bg(toned[0]);
  // Cada cambio de tono es un tramo de scroll; el color se interpola dentro del tramo.
  const stops = [];
  toned.forEach((sec, i) => {
    if (i === 0) return;
    const from = bg(toned[i - 1]);
    const to = bg(sec);
    if (from === to) return;
    stops.push({ st: ScrollTrigger.create({ trigger: sec, start: 'top 74%', end: 'top 44%' }), from, to });
  });
  const paint = () => {
    const y = window.scrollY;
    let color = first;
    for (const s of stops) {
      if (y >= s.st.end) { color = s.to; continue; }
      if (y > s.st.start) color = gsap.utils.interpolate(s.from, s.to, (y - s.st.start) / (s.st.end - s.st.start));
      break;
    }
    backdrop.style.backgroundColor = color;
    root.style.setProperty('--light', color);
    const [r, g, b] = gsap.utils.splitColor(color);
    const dark = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.42;
    if (dark !== lightIsDark) { lightIsDark = dark; updateHeader(); }
  };
  backdrop.style.backgroundColor = first;
  root.classList.add('light-ready');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: paint });
  ScrollTrigger.addEventListener('refresh', paint);
  syncers.push(paint);
}

/* ---------- Hero: la ventana del título se abre al parque ---------- */
function initHero() {
  const hero = $('.hero');
  const stage = $('.hero__stage', hero);
  const slot = $('.hero__slot', hero);
  const media = $('.hero__media', hero);
  const video = $('.hero__video', hero);
  const lines = $$('.hero__line', hero);
  const foot = $$('.hero__foot > *', hero);
  const toggle = $('.hero__toggle', hero);
  const state = { open: reduce ? 1 : 0, p: 0 };
  let box = null;

  const measure = () => {
    box = {
      l: 0,
      t: 0,
      w: slot.offsetWidth,
      h: slot.offsetHeight,
      W: stage.clientWidth,
      H: stage.clientHeight,
      rad: parseFloat(getComputedStyle(slot).borderRadius) || 0,
    };
    // offsetTop de la ranura es relativo al escenario (su offsetParent)
    let el = slot;
    let top = 0;
    let left = 0;
    while (el && el !== stage) { top += el.offsetTop; left += el.offsetLeft; el = el.offsetParent; }
    box.t = top;
    box.l = left;
  };

  const render = () => {
    if (!box) return;
    const { l, t, w, h, W, H, rad } = box;
    const cx = l + w / 2;
    const half = (w / 2) * state.open;
    let il = cx - half;
    let ir = W - (cx + half);
    let it = t;
    let ib = H - t - h;
    const e = state.p;
    il *= 1 - e; ir *= 1 - e; it *= 1 - e; ib *= 1 - e;
    media.style.clipPath = `inset(${it}px ${ir}px ${ib}px ${il}px round ${rad * (1 - e)}px)`;
    // El video entra entero en la ventana y crece con ella hasta cubrir la pantalla.
    const s0 = Math.max(w / W, h / H);
    const sc = s0 + (1 - s0) * e;
    const cx0 = l + w / 2;
    const cy0 = t + h / 2;
    const vx = cx0 + (W / 2 - cx0) * e - (W * sc) / 2;
    const vy = cy0 + (H / 2 - cy0) * e - (H * sc) / 2;
    video.style.transform = `translate(${vx}px, ${vy}px) scale(${sc})`;
  };

  measure();
  render();
  window.addEventListener('resize', () => { measure(); render(); });

  if (reduce) {
    gsap.set($('.hero__over', hero), { opacity: 0 });
    return;
  }

  video.play().catch(() => {});

  // Entrada
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .from('.hero__kicker', { y: 14, opacity: 0, duration: 1 }, 0)
    .from(lines, { yPercent: 38, opacity: 0, duration: 1.5, stagger: 0.12 }, 0.05)
    .to(state, { open: 1, duration: 1.3, ease: 'expo.inOut', onUpdate: render }, 0.55)
    .from(foot, { y: 22, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.8)
    .from('.hdr', { y: -16, opacity: 0, duration: 1 }, 0.4);

  if (!pinHero) return;

  // Scroll: la ventana crece hasta ser el paisaje entero
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: () => `+=${window.innerHeight * HERO_PIN}`,
      pin: true,
      scrub: 0.7,
      invalidateOnRefresh: true,
      onRefresh: () => { measure(); render(); },
      onUpdate: (self) => {
        const dark = self.progress > 0.5;
        heroDark = dark;
        toggle.toggleAttribute('data-on-video', dark);
        updateHeader();
      },
    },
  });
  tl.to(state, { p: 1, duration: 0.72, ease: 'power2.inOut', onUpdate: render }, 0)
    .to(lines, { yPercent: -14, opacity: 0.0, duration: 0.5, ease: 'power1.in', stagger: 0.04 }, 0.18)
    .to(['.hero__kicker', ...foot], { opacity: 0, y: -20, duration: 0.3, ease: 'power1.in' }, 0.05)
    .to('.hero__shade', { opacity: 1, duration: 0.3 }, 0.45)
    .to('.hero__over', { opacity: 1, duration: 0.2 }, 0.72)
    .from('.hero__over > *', { y: 40, duration: 0.28, stagger: 0.05, ease: 'power2.out' }, 0.72);
}

/* ---------- Títulos: líneas que suben desde su máscara ---------- */
function initHeadings() {
  // Se parte en líneas solo para la entrada; al terminar, el texto vuelve a su flujo natural.
  $$('[data-split]').forEach((el) => {
    if (reduce) return;
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    gsap.from(split.lines, {
      yPercent: 108,
      duration: 1.25,
      ease: 'expo.out',
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
      onComplete: () => split.revert(),
    });
  });
}

/* ---------- Fotos: se revelan como una cortina + textos que aparecen ---------- */
function wrapFrames() {
  $$('.ph').forEach((fig) => {
    const media = $('img, video', fig);
    if (!media || media.parentElement.classList.contains('ph__frame')) return;
    const frame = document.createElement('div');
    frame.className = 'ph__frame';
    media.replaceWith(frame);
    frame.append(media);
  });
}

function initReveals() {
  if (reduce) return;
  const once = (trigger, start = 'top 82%') => ({ trigger, start, toggleActions: 'play none none none' });

  // Cortina solo en la foto principal de cada capítulo, y cada una abre hacia otro lado.
  [
    ['.parque__a', 'inset(0% 100% 0% 0%)'],
    ['.bodas__hero', 'inset(0% 0% 0% 100%)'],
    ['.rincones__b', 'inset(0% 0% 100% 0%)'],
    ['.casa__photo', 'inset(100% 0% 0% 0%)'],
  ].forEach(([sel, from]) => {
    const frame = $(`${sel} .ph__frame`);
    if (!frame) return;
    gsap.timeline({ scrollTrigger: once(frame, 'top 85%') })
      .fromTo(frame, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0)
      .fromTo(frame.firstElementChild, { scale: 1.15 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0);
  });

  // Edades: las dos fotos aparecen como reveladas, una después de la otra.
  $$('.edad').forEach((el) => {
    gsap.from($$('.edad__photos .ph__frame', el), { opacity: 0, duration: 1.3, stagger: 0.25, ease: 'power2.out', scrollTrigger: once(el, 'top 72%') });
  });

  // Créditos de película: los nombres suben de a uno.
  gsap.from('.credits__list li', { yPercent: 70, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'expo.out', scrollTrigger: once('.credits', 'top 75%') });

  // Citas: se aclaran como tinta que se seca.
  $$('.bodas__quote p, .noche__quote p').forEach((p) => {
    gsap.from(p, { opacity: 0, filter: 'blur(6px)', duration: 1.8, ease: 'power2.out', scrollTrigger: once(p, 'top 80%') });
  });

  // Cifras: suben desde la línea.
  gsap.from('.specs__num, .specs__word', { yPercent: 45, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: once('.specs', 'top 80%') });
}

/* ---------- Profundidad: las fotos del collage se mueven a distinto ritmo ---------- */
function initParallax() {
  if (reduce || mobile) return;
  const mm = gsap.matchMedia();
  mm.add({ wide: '(min-width: 900px)', narrow: '(max-width: 899px)' }, (ctx) => {
    const k = ctx.conditions.wide ? 10 : 4;
    $$('[data-speed]').forEach((el) => {
      const s = parseFloat(el.dataset.speed) || 0;
      gsap.fromTo(el, { y: s * k }, {
        y: -s * k,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });
}

/* ---------- Los que vuelven: el odómetro de edades ---------- */
function initAges() {
  const track = $('.odo__track');
  const label = $('.odo__label');
  const text = $('[data-odo-label]');
  const LABELS = ['antes de nacer', 'añitos', 'años', 'años', 'años', 'años'];
  let current = 0;
  const set = (i) => {
    if (i === current) return;
    current = i;
    track.style.setProperty('--i', i);
    if (text.textContent !== LABELS[i]) {
      label.setAttribute('data-changing', '');
      setTimeout(() => { text.textContent = LABELS[i]; label.removeAttribute('data-changing'); }, reduce ? 0 : 280);
    }
  };
  $$('.edad').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) set(i); },
    });
  });
}

/* ---------- Adentro / afuera ---------- */
function initSplit() {
  const split = $('[data-split-compare]');
  const range = $('.split__range', split);
  const labelIn = $('.split__label--in', split);
  const labelOut = $('.split__label--out', split);
  let pos = 50;
  const set = (v) => {
    pos = clamp(v, 0, 100);
    split.style.setProperty('--pos', `${pos}%`);
    range.value = Math.round(pos);
    range.setAttribute('aria-valuetext', pos < 35 ? 'Más parque' : pos > 65 ? 'Más salón' : 'Mitad salón, mitad parque');
    labelIn.style.opacity = pos > 20 ? 1 : 0;
    labelOut.style.opacity = pos < 80 ? 1 : 0;
  };
  range.addEventListener('input', () => set(+range.value));

  let start = null;
  let dragging = false;
  const fromEvent = (e) => {
    const r = split.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * 100;
  };
  split.addEventListener('pointerdown', (e) => {
    start = { x: e.clientX, y: e.clientY, id: e.pointerId, type: e.pointerType };
    dragging = false;
    if (e.pointerType === 'mouse') {
      dragging = true;
      split.setPointerCapture(e.pointerId);
      split.setAttribute('data-dragging', '');
      set(fromEvent(e));
    }
  });
  split.addEventListener('pointermove', (e) => {
    if (!start) return;
    if (!dragging) {
      const dx = Math.abs(e.clientX - start.x);
      const dy = Math.abs(e.clientY - start.y);
      if (dx > 6 && dx > dy) {
        dragging = true;
        split.setPointerCapture(e.pointerId);
        split.setAttribute('data-dragging', '');
      } else if (dy > 8) { start = null; return; }
    }
    if (dragging) set(fromEvent(e));
  });
  const end = (e) => {
    if (start && !dragging && e.type === 'pointerup' && start.type !== 'mouse') {
      const to = fromEvent(e);
      const o = { v: pos };
      gsap.to(o, { v: to, duration: reduce ? 0 : 0.6, ease: 'expo.out', onUpdate: () => set(o.v) });
    }
    start = null;
    dragging = false;
    split.removeAttribute('data-dragging');
  };
  split.addEventListener('pointerup', end);
  split.addEventListener('pointercancel', end);
  split.addEventListener('lostpointercapture', end);
  set(50);

  // Una pista de que se puede arrastrar
  if (!reduce) {
    const o = { v: 50 };
    let hinted = false;
    ScrollTrigger.create({
      trigger: split,
      start: 'top 60%',
      onEnter: () => {
        if (hinted) return;
        hinted = true;
        gsap.timeline()
          .to(o, { v: 30, duration: 0.9, ease: 'power2.inOut', onUpdate: () => set(o.v) })
          .to(o, { v: 70, duration: 1.2, ease: 'power2.inOut', onUpdate: () => set(o.v) })
          .to(o, { v: 50, duration: 0.9, ease: 'power2.inOut', onUpdate: () => set(o.v) });
      },
    });
  }
}

/* ---------- La noche: fotos colgadas de la guirnalda ---------- */
function initNight() {
  const viewport = $('.tendedero__viewport');
  const track = $('.tendedero__track');
  const svg = $('.tendedero__wire');
  const path = $('path', svg);
  const hangs = $$('.hang', track);
  const btns = hangs.map((h) => $('.hang__btn', h));
  let lamps = [];
  let lampX = [];

  function layout() {
    const W = track.scrollWidth;
    const H = track.clientHeight;
    const wireY = parseFloat(getComputedStyle(track).paddingTop) - 16;
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const anchors = hangs.map((h) => ({
      x: h.offsetLeft + h.offsetWidth / 2,
      y: wireY + (parseFloat(getComputedStyle(h).marginTop) || 0),
    }));
    const sag = Math.min(90, window.innerHeight * 0.08);
    let d = `M 0 ${wireY - 40}`;
    let prev = { x: 0, y: wireY - 40 };
    const mids = [];
    anchors.forEach((a, i) => {
      const cx = (prev.x + a.x) / 2;
      const cy = Math.max(prev.y, a.y) + sag;
      d += ` Q ${cx} ${cy} ${a.x} ${a.y}`;
      if (i > 0) mids.push({ x: cx, y: 0.25 * prev.y + 0.5 * cy + 0.25 * a.y });
      prev = a;
    });
    const endX = W;
    const cx = (prev.x + endX) / 2;
    const cy = prev.y + sag;
    d += ` Q ${cx} ${cy} ${endX} ${wireY - 40}`;
    mids.push({ x: cx, y: 0.25 * prev.y + 0.5 * cy + 0.25 * (wireY - 40) });
    path.setAttribute('d', d);

    lamps.forEach((l) => l.remove());
    lamps = mids.map((m) => {
      const lamp = document.createElement('span');
      lamp.className = 'lamp';
      lamp.style.transform = `translate(${m.x}px, ${m.y + 6}px)`;
      track.append(lamp);
      return lamp;
    });
    lampX = mids.map((m) => m.x);
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    if (!wireDrawn) path.style.strokeDashoffset = `${len}`;
  }

  let wireDrawn = reduce;
  if (!pinNight) {
    // Celular: el título sale del carrusel para no deslizarse con las fotos.
    const t = $('[data-tendedero]');
    t.classList.add('is-swipe');
    t.before($('.noche__head', t));
  }
  let x = 0;
  layout();

  if (reduce) {
    lamps.forEach((l) => l.setAttribute('data-on', ''));
    path.style.strokeDashoffset = '0';
    window.addEventListener('resize', layout);
    return;
  }

  // Se enciende la noche: el cable se dibuja y las lamparitas se prenden en fila
  const turnOn = () => {
    if (wireDrawn) return;
    wireDrawn = true;
    gsap.to(path, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' });
    lamps.forEach((l, i) => {
      if (!pinNight || lampX[i] + x < window.innerWidth * 0.95) setTimeout(() => l.setAttribute('data-on', ''), 500 + i * 180);
    });
    if (pinNight) setTimeout(lightUp, 600);
  };
  const onST = ScrollTrigger.create({ trigger: viewport, start: 'top 75%', onEnter: turnOn });
  syncers.push(() => { if (window.scrollY >= onST.start) turnOn(); });

  const dist = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
  const lightUp = () => {
    lamps.forEach((l, i) => { if (lampX[i] + x < window.innerWidth * 0.85 && wireDrawn) l.setAttribute('data-on', ''); });
  };

  // Vaivén: cada foto se mece según la velocidad del scroll, como colgada de verdad
  let swing = 0;
  const phases = btns.map(() => Math.random() * Math.PI * 2);
  const setters = btns.map((b) => gsap.quickSetter(b, 'rotation', 'deg'));
  const tick = (time) => {
    swing *= 0.93;
    btns.forEach((b, i) => setters[i](swing * (0.7 + (i % 3) * 0.2) + Math.sin(time * 0.9 + phases[i]) * 0.9));
  };
  ScrollTrigger.create({
    trigger: viewport,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => { if (self.isActive) gsap.ticker.add(tick); else gsap.ticker.remove(tick); },
  });

  if (!pinNight) {
    // Celular: se desliza con el dedo; las fotos solo se mecen suave.
    let w = window.innerWidth;
    window.addEventListener('resize', () => { if (window.innerWidth !== w) { w = window.innerWidth; layout(); } });
    return;
  }

  gsap.to(track, {
    x: () => -dist(),
    ease: 'none',
    scrollTrigger: {
      trigger: viewport,
      start: 'top top',
      end: () => `+=${dist()}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onRefresh: layout,
      onUpdate: (self) => {
        x = gsap.getProperty(track, 'x');
        swing = clamp(swing + (-self.getVelocity() / 900), -8, 8);
        lightUp();
      },
    },
  });
}

/* ---------- Capítulos: guirnalda de la cabecera, tono del header ---------- */
const HERO_PIN = 1.35;
let heroDark = false;
let lightIsDark = false;
let currentTone = pinHero ? 'hero' : 'lino';
const hdr = $('[data-hdr]');
const floatCta = $('[data-float-cta]');
function updateHeader() {
  // El modo de la cabecera sigue a la luz real (el fondo), salvo sobre el video del hero.
  const dark = currentTone === 'hero' ? heroDark : currentTone === 'pie' || lightIsDark;
  hdr.toggleAttribute('data-dark', dark);
  hdr.toggleAttribute('data-pie', currentTone === 'pie');
  floatCta?.toggleAttribute('data-dark', dark);
}
let currentChapter = 'llegada';

function initChapters() {
  // Pasado el hero, la cabecera toma el color de la luz del momento
  // (Los triggers sobre el hero fijado usan posiciones absolutas: su "top" ya incluye el pin.)
  const solidAt = () => (pinHero ? window.innerHeight * (HERO_PIN + 1) - 80 : 40);
  const order = $$('[data-bulb]').map((a) => a.dataset.bulb);
  const bulbs = new Map($$('[data-bulb]').map((a) => [a.dataset.bulb, a]));
  const setChapter = (name) => {
    currentChapter = name;
    const idx = order.indexOf(name);
    const night = name === 'noche';
    bulbs.forEach((a, key) => {
      const i = order.indexOf(key);
      a.toggleAttribute('data-lit', night || i <= idx);
      if (i === idx) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    updateHeader();
  };
  // Capítulo actual = el último cuyo comienzo ya pasó (robusto ante saltos por ancla).
  const secs = $$('[data-chapter]');
  const marks = secs.map((sec) => {
    const pinned = sec.classList.contains('hero') && pinHero;
    return {
      chapter: sec.dataset.chapter,
      tone: pinned ? 'hero' : sec.tagName === 'FOOTER' ? 'pie' : sec.dataset.tone,
      // El hero fijado usa posiciones absolutas (su "top" ya incluye el pin)
      at: ScrollTrigger.create({ trigger: pinned ? null : sec, start: pinned ? 0 : 'top 50%' }),
      under: ScrollTrigger.create({ trigger: pinned ? null : sec, start: pinned ? 0 : 'top top+=36' }),
    };
  });
  let lastChapter = '';
  const update = () => {
    const y = window.scrollY;
    let chapter = marks[0].chapter;
    let tone = marks[0].tone;
    marks.forEach((m) => {
      if (y >= m.at.start) chapter = m.chapter;
      if (y >= m.under.start) tone = m.tone;
    });
    hdr.toggleAttribute('data-solid', y >= solidAt());
    if (tone !== currentTone) { currentTone = tone; updateHeader(); }
    if (chapter !== lastChapter) { lastChapter = chapter; setChapter(chapter); }
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update });
  ScrollTrigger.addEventListener('refresh', update);
  syncers.push(update);
  setChapter('llegada');
}

/* ---------- CTA flotante en mobile ---------- */
function initFloatCta() {
  if (!floatCta) return;
  const hide = new Set();
  const refresh = () => floatCta.toggleAttribute('data-show', hide.size === 0);
  [['hero', $('.hero')], ['inv', $('#invitacion')], ['llegar', $('#llegar')]].forEach(([key, el]) => {
    ScrollTrigger.create({
      trigger: key === 'hero' ? null : el,
      start: key === 'hero' ? 0 : 'top bottom',
      end: key === 'hero' ? () => window.innerHeight * 0.4 : 'bottom top',
      onToggle: (self) => { if (self.isActive) hide.add(key); else hide.delete(key); refresh(); },
    });
  });
  hide.add('hero');
  refresh();
}
