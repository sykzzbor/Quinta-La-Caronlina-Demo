// Cotizador "La invitación": cinco preguntas que se van escribiendo en una tarjeta
// y terminan en un mensaje de WhatsApp con todo armado.

const WA_NUMBER = '5493525511516';
const TOTAL = 5;

const PHRASE = {
  Casamiento: 'un casamiento',
  Cumpleaños: 'un cumpleaños',
  '15 años': 'unos 15 años',
  Bautismo: 'un bautismo',
  'Revelación de género o baby shower': 'una revelación: ¿nena o nene?',
  'Evento de empresa o fin de año': 'un evento de empresa o fin de año',
  'Alquiler de la casa quinta': 'alquilar la casa quinta',
};

const fmtLong = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const fmtMonth = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' });
const longDate = (d) => fmtLong.format(d).replace(',', '');
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function initQuote(root, { scrollTo } = {}) {
  const form = root.querySelector('.inv__form');
  const steps = [...form.querySelectorAll('.step')];
  const prevBtn = form.querySelector('[data-prev]');
  const nextBtn = form.querySelector('[data-next]');
  const count = form.querySelector('[data-inv-count]');
  const bulbs = [...form.querySelectorAll('.inv__bulbs li')];
  const waLink = form.querySelector('[data-wa]');
  const waAgain = form.querySelector('[data-wa-again]');
  const sent = form.querySelector('[data-sent]');
  const copyBtn = form.querySelector('[data-copy]');
  const card = root.querySelector('.card');
  const cardField = (k) => card.querySelector(`[data-card="${k}"]`);
  const cardSmall = card.querySelectorAll('.card__small')[1];

  const today = startOfDay(new Date());
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const maxDate = new Date(today.getFullYear() + 3, today.getMonth(), 1);

  const state = {
    step: 1,
    tipo: '',
    tipoOtro: '',
    fecha: null,
    sinFecha: false,
    momento: '',
    invitados: 60,
    sinInvitados: false,
    nombre: '',
    telefono: '',
    notas: '',
  };

  /* ---------- Paso 1: tipo ---------- */
  const otherField = form.querySelector('.field--other');
  const otherInput = form.querySelector('#tipo-otro');
  form.querySelectorAll('input[name="tipo"]').forEach((input) => {
    input.addEventListener('change', () => {
      state.tipo = input.value;
      otherField.hidden = state.tipo !== 'Otro';
      clearError(1);
      renderCard();
    });
    // Con mouse o dedo avanzamos solos; con teclado no (las flechas cambian la opción).
    input.closest('label').addEventListener('click', (e) => {
      if (e.detail === 0 || input.value === 'Otro') return;
      setTimeout(() => { if (state.step === 1 && state.tipo === input.value) go(2); }, 420);
    });
  });
  otherInput.addEventListener('input', () => { state.tipoOtro = otherInput.value; renderCard(); });

  /* ---------- Paso 2: calendario ---------- */
  const calEl = form.querySelector('[data-cal]');
  const calGrid = form.querySelector('[data-cal-grid]');
  const calMonth = form.querySelector('[data-cal-month]');
  const calPrev = form.querySelector('[data-cal-prev]');
  const calNext = form.querySelector('[data-cal-next]');
  const noDate = form.querySelector('[data-nodate]');
  let view = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  let focusDay = null;

  calGrid.setAttribute('role', 'group');
  calGrid.setAttribute('aria-label', 'Días del mes');

  function renderCal(focus = false) {
    calMonth.textContent = fmtMonth.format(view);
    calPrev.disabled = view <= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    calNext.disabled = view >= maxDate;
    const frag = document.createDocumentFragment();
    ['L', 'M', 'M', 'J', 'V', 'S', 'D'].forEach((d, i) => {
      const el = document.createElement('span');
      el.className = 'cal__dow';
      el.textContent = d;
      el.setAttribute('aria-hidden', 'true');
      el.title = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'][i];
      frag.append(el);
    });
    const offset = (view.getDay() + 6) % 7;
    for (let i = 0; i < offset; i++) frag.append(document.createElement('span'));
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const target = focusDay && focusDay.getMonth() === view.getMonth() ? focusDay
      : (state.fecha && state.fecha.getMonth() === view.getMonth() && state.fecha.getFullYear() === view.getFullYear() ? state.fecha : null);
    let tabbable = null;
    for (let d = 1; d <= days; d++) {
      const date = new Date(view.getFullYear(), view.getMonth(), d);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cal__day';
      b.textContent = d;
      b.dataset.day = d;
      b.setAttribute('aria-label', longDate(date));
      b.setAttribute('aria-pressed', sameDay(date, state.fecha) ? 'true' : 'false');
      b.tabIndex = -1;
      if (date < minDate || date >= new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1)) b.disabled = true;
      const dow = date.getDay();
      if (dow === 0 || dow === 6) b.dataset.weekend = '';
      if (sameDay(date, today)) b.dataset.today = '';
      if (!b.disabled && (sameDay(date, target) || (!target && !tabbable))) tabbable = b;
      frag.append(b);
    }
    calGrid.replaceChildren(frag);
    if (tabbable) tabbable.tabIndex = 0;
    if (focus && tabbable) tabbable.focus();
  }

  calGrid.addEventListener('click', (e) => {
    const b = e.target.closest('.cal__day');
    if (!b || b.disabled) return;
    state.fecha = new Date(view.getFullYear(), view.getMonth(), +b.dataset.day);
    focusDay = state.fecha;
    state.sinFecha = false;
    noDate.checked = false;
    calEl.removeAttribute('data-disabled');
    clearError(2);
    renderCal(true);
    renderCard();
  });

  calGrid.addEventListener('keydown', (e) => {
    const b = e.target.closest('.cal__day');
    if (!b) return;
    const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!delta) return;
    e.preventDefault();
    let next = new Date(view.getFullYear(), view.getMonth(), +b.dataset.day + delta);
    if (next < minDate) next = minDate;
    focusDay = next;
    if (next.getMonth() !== view.getMonth() || next.getFullYear() !== view.getFullYear()) {
      const nv = new Date(next.getFullYear(), next.getMonth(), 1);
      if (nv > maxDate) return;
      view = nv;
    }
    renderCal(true);
  });

  calPrev.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); focusDay = null; renderCal(); });
  calNext.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); focusDay = null; renderCal(); });

  noDate.addEventListener('change', () => {
    state.sinFecha = noDate.checked;
    if (noDate.checked) state.fecha = null;
    calEl.toggleAttribute('data-disabled', noDate.checked);
    clearError(2);
    renderCal();
    renderCard();
  });
  form.querySelectorAll('input[name="momento"]').forEach((r) => r.addEventListener('change', () => { state.momento = r.value; renderCard(); }));

  /* ---------- Paso 3: invitados ---------- */
  const range = form.querySelector('#invitados');
  const out = form.querySelector('[data-guests-out]');
  const note = form.querySelector('[data-guests-note]');
  const noGuests = form.querySelector('[data-noguests]');
  const guestStep = steps.find((s) => s.dataset.step === '3');
  function setGuests(v) {
    const n = Math.max(10, Math.min(150, Math.round(v / 5) * 5));
    state.invitados = n;
    range.value = n;
    out.textContent = n >= 150 ? '150+' : String(n);
    range.setAttribute('aria-valuetext', n >= 150 ? '150 o más invitados' : `${n} invitados`);
    note.textContent = n > 100
      ? 'Para más de 100 invitados, contanos la idea y lo vemos juntos.'
      : 'El salón recibe hasta 100 personas.';
    renderCard();
  }
  range.addEventListener('input', () => setGuests(+range.value));
  form.querySelectorAll('[data-guests-step]').forEach((b) => b.addEventListener('click', () => setGuests(state.invitados + +b.dataset.guestsStep)));
  noGuests.addEventListener('change', () => {
    state.sinInvitados = noGuests.checked;
    guestStep.toggleAttribute('data-noguests', noGuests.checked);
    renderCard();
  });

  /* ---------- Paso 4: datos ---------- */
  const nameInput = form.querySelector('#nombre');
  const phoneInput = form.querySelector('#telefono');
  nameInput.addEventListener('input', () => { state.nombre = nameInput.value; nameInput.removeAttribute('aria-invalid'); renderCard(); });
  phoneInput.addEventListener('input', () => { state.telefono = phoneInput.value; phoneInput.removeAttribute('aria-invalid'); });

  /* ---------- Paso 5: observaciones ---------- */
  const notes = form.querySelector('#notas');
  notes.addEventListener('input', () => { state.notas = notes.value; syncChips(); renderCard(); });
  const chips = [...form.querySelectorAll('[data-chip]')];
  chips.forEach((chip) => {
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      const text = chip.dataset.chip;
      if (notes.value.includes(text)) {
        notes.value = notes.value.replace(text, '').replace(/\s{2,}/g, ' ').trim();
      } else {
        notes.value = `${notes.value.trim()} ${text}`.trim();
      }
      state.notas = notes.value;
      syncChips();
      renderCard();
    });
  });
  function syncChips() {
    chips.forEach((c) => c.setAttribute('aria-pressed', notes.value.includes(c.dataset.chip) ? 'true' : 'false'));
  }

  /* ---------- Navegación entre pasos ---------- */
  function errorEl(n) { return steps.find((s) => s.dataset.step === String(n))?.querySelector('[data-error]'); }
  function clearError(n) { const el = errorEl(n); if (el) el.textContent = ''; }

  function validate(n) {
    if (n === 1) {
      if (!state.tipo) return 'Elegí qué querés celebrar.';
      if (state.tipo === 'Otro' && !state.tipoOtro.trim()) { otherInput.focus(); return 'Contanos en pocas palabras qué querés celebrar.'; }
    }
    if (n === 2 && !state.fecha && !state.sinFecha) return 'Elegí un día en el calendario o marcá que todavía no tienen fecha.';
    if (n === 4) {
      if (state.nombre.trim().length < 2) {
        nameInput.setAttribute('aria-invalid', 'true');
        nameInput.focus();
        return 'Escribí tu nombre para saber a quién responder.';
      }
      if (state.telefono.replace(/\D/g, '').length < 8) {
        phoneInput.setAttribute('aria-invalid', 'true');
        phoneInput.focus();
        return 'Revisá el teléfono: necesitamos al menos 8 números, con característica.';
      }
    }
    return '';
  }

  function go(n, { focus = true, scroll = true } = {}) {
    state.step = n;
    steps.forEach((s) => { s.hidden = +s.dataset.step !== n; });
    prevBtn.hidden = n === 1 || n === 6;
    nextBtn.hidden = n === 6;
    prevBtn.parentElement.hidden = n === 6;
    nextBtn.textContent = n === 5 ? 'Revisar consulta' : 'Siguiente';
    count.textContent = n <= TOTAL ? `Paso ${n} de ${TOTAL}` : 'Lista para enviar';
    bulbs.forEach((b, i) => {
      b.toggleAttribute('data-on', i < n - 1 || n === 6);
      b.toggleAttribute('data-current', i === n - 1);
    });
    root.toggleAttribute('data-done', n === 6);
    if (n === 2) renderCal();
    if (n === 6) buildMessage();
    renderCard();
    const rect = form.getBoundingClientRect();
    if (scroll && (rect.top < 0 || rect.top > window.innerHeight * 0.6)) scrollTo?.(form, -110);
    if (focus) {
      const q = steps.find((s) => +s.dataset.step === n)?.querySelector('.step__q');
      q?.focus({ preventScroll: true });
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.step > TOTAL) return;
    const err = validate(state.step);
    const el = errorEl(state.step);
    if (err) { if (el) el.textContent = err; return; }
    if (el) el.textContent = '';
    go(state.step + 1);
  });
  prevBtn.addEventListener('click', () => go(Math.max(1, state.step - 1)));
  form.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => go(+b.dataset.goto)));

  /* ---------- Tarjeta y mensaje ---------- */
  function tipoText() {
    if (state.tipo === 'Otro') return state.tipoOtro.trim();
    return state.tipo;
  }
  function fechaText() {
    if (state.sinFecha) return state.momento ? `fecha a definir, ${state.momento}` : 'fecha a definir';
    if (!state.fecha) return '';
    return `${longDate(state.fecha)}${state.momento ? `, ${state.momento}` : ''}`;
  }
  function invitadosText() {
    if (state.sinInvitados) return 'invitados a confirmar';
    return state.invitados >= 150 ? '150 invitados o más' : `unos ${state.invitados} invitados`;
  }

  function write(key, text, placeholder) {
    const el = cardField(key);
    const value = text || placeholder;
    const blank = !text;
    if (el.textContent === value && el.classList.contains('blank') === blank) return;
    el.textContent = value;
    el.classList.toggle('blank', blank);
    if (!blank) {
      el.classList.remove('inked');
      void el.offsetWidth;
      el.classList.add('inked');
    }
  }

  function renderCard() {
    write('nombre', state.nombre.trim(), 'tu nombre');
    const isCasa = state.tipo === 'Alquiler de la casa quinta';
    cardSmall.textContent = isCasa ? 'para' : 'para celebrar';
    const t = state.tipo === 'Otro' ? state.tipoOtro.trim() : (PHRASE[state.tipo] || '');
    write('tipo', t, 'qué celebramos');
    const f = fechaText();
    write('fecha', f ? (state.sinFecha ? f : `el ${f}`) : '', 'la fecha');
    write('invitados', state.step >= 3 || state.sinInvitados ? `con ${invitadosText()}` : '', 'los invitados');
    const n = cardField('notas');
    n.hidden = !state.notas.trim();
    n.textContent = state.notas.trim() ? `“${state.notas.trim()}”` : '';
  }

  let message = '';
  function buildMessage() {
    const lines = [
      '¡Hola! Quiero consultar por un evento en Quinta La Carolina.',
      '',
      `• *Evento:* ${tipoText()}`,
      `• *Fecha:* ${state.sinFecha ? 'todavía no la tenemos' : longDate(state.fecha)}${state.momento ? ` (${state.momento})` : ''}`,
      `• *Invitados:* ${state.sinInvitados ? 'todavía no sé' : state.invitados >= 150 ? '150 o más' : `${state.invitados} aprox.`}`,
      `• *Nombre:* ${state.nombre.trim()}`,
      `• *Teléfono:* ${state.telefono.trim()}`,
    ];
    if (state.notas.trim()) lines.push(`• *Observaciones:* ${state.notas.trim()}`);
    lines.push('', 'Consulta armada desde la web.');
    message = lines.join('\n');
    const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    waLink.href = href;
    waAgain.href = href;
    sent.hidden = true;
  }

  waLink.addEventListener('click', () => { setTimeout(() => { sent.hidden = false; }, 600); });
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message);
      copyBtn.textContent = 'mensaje copiado';
    } catch {
      copyBtn.textContent = 'no se pudo copiar';
    }
  });

  renderCal();
  setGuests(state.invitados);
  renderCard();
  go(1, { focus: false, scroll: false });

  return {
    preset(tipo) {
      const input = form.querySelector(`input[name="tipo"][value="${CSS.escape(tipo)}"]`);
      if (!input) return;
      input.checked = true;
      state.tipo = tipo;
      otherField.hidden = true;
      clearError(1);
      renderCard();
      go(2, { focus: false, scroll: false });
    },
  };
}
