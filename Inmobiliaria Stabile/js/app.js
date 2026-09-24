/* ==========================================================================
   STABILE INMOBILIARIA — Lógica del sitio
   Render del listado, filtros client-side, ficha individual, links de
   WhatsApp y formulario de tasación. Sin dependencias externas.
   Depende de js/propiedades.js (PROPIEDADES y EMPRESA).
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     Utilidades
     ====================================================================== */

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const esc = (v) =>
    String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const nf = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });

  const capitalizar = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

  /** "USD 63.000" · "$ 1.000.000" */
  function formatPrecio(precio, moneda) {
    if (typeof precio !== 'number' || isNaN(precio)) return 'Consultar';
    return moneda === 'USD' ? 'USD ' + nf.format(precio) : '$ ' + nf.format(precio);
  }

  /** Texto secundario de expensas. null = no informa · 0 = sin expensas */
  function textoExpensas(prop) {
    if (prop.expensas === 0) return 'Sin expensas';
    if (typeof prop.expensas === 'number' && prop.expensas > 0) {
      return '+ $ ' + nf.format(prop.expensas) + ' expensas';
    }
    return '';
  }

  const etiquetaOperacion = (op) => (op === 'venta' ? 'Venta' : 'Alquiler');

  /** Primer tramo de la dirección, para el mensaje de WhatsApp. */
  const direccionCorta = (prop) => prop.direccion.split(',')[0].trim();

  /** https://wa.me/549...?text=... */
  function linkWhatsapp(texto) {
    return 'https://wa.me/' + EMPRESA.whatsapp + '?text=' + encodeURIComponent(texto);
  }

  function linkWhatsappPropiedad(prop) {
    return linkWhatsapp(
      'Hola, me interesa la propiedad ' + prop.id + ' (' + direccionCorta(prop) + ')'
    );
  }

  const urlPropiedad = (prop) => 'propiedad.html?id=' + encodeURIComponent(prop.id);

  /* ======================================================================
     Íconos (SVG inline, monocromo, heredan currentColor)
     ====================================================================== */

  const ICONOS = {
    dormitorio:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2.5 18.8V7.2"/><path d="M2.5 12h13.6a5 5 0 0 1 5 5v1.8"/><path d="M2.5 15.6h18.6"/><path d="M6.2 12V9.4h5V12"/></svg>',
    bano:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2.6 11.6h18.8"/><path d="M4.2 11.6v3a4 4 0 0 0 4 4h7.6a4 4 0 0 0 4-4v-3"/><path d="M6.6 11.6V6.4a2.2 2.2 0 0 1 4.2-.9"/><path d="M6.2 21l1.3-2.4"/><path d="M17.8 21l-1.3-2.4"/></svg>',
    cochera:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2.6 16.4v-3.1l1.9-4.4a1.5 1.5 0 0 1 1.4-.9h12.2a1.5 1.5 0 0 1 1.4.9l1.9 4.4v3.1"/><path d="M2.6 13.3h18.8"/><circle cx="6.9" cy="16.6" r="1.8"/><circle cx="17.1" cy="16.6" r="1.8"/></svg>',
    whatsapp:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-2.6.7.7-2.6-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.1 4c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.7 4.2 3.7 2 .8 2.5.7 2.9.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5s0-.3-.1-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.4Z"/></svg>',
  };

  /* ======================================================================
     Tarjeta de propiedad
     ====================================================================== */

  function specHtml(icono, texto, activo) {
    return (
      '<li class="spec' + (activo === false ? ' spec--off' : '') + '">' +
      ICONOS[icono] +
      '<span>' + esc(texto) + '</span></li>'
    );
  }

  function renderCard(prop, index) {
    const expensas = textoExpensas(prop);
    const imagen = prop.imagenes && prop.imagenes[0] ? prop.imagenes[0] : 'img/og-default.jpg';
    const alt =
      capitalizar(prop.tipo) + ' en ' + etiquetaOperacion(prop.operacion).toLowerCase() +
      ', ' + prop.direccion + ', barrio ' + prop.barrio + ', Córdoba';

    return (
      '<article class="card">' +
        '<div class="card__media">' +
          '<img src="' + esc(imagen) + '" alt="' + esc(alt) + '" width="1200" height="900" ' +
            'loading="' + (index < 3 ? 'eager' : 'lazy') + '" decoding="async">' +
          '<div class="card__badges">' +
            '<span class="badge badge--op' +
              (prop.operacion === 'alquiler' ? ' badge--op-alquiler' : '') + '">' +
              esc(etiquetaOperacion(prop.operacion)) +
            '</span>' +
            (prop.destacada ? '<span class="badge badge--destacada">Destacada</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="card__body">' +
          '<p class="card__price">' + esc(formatPrecio(prop.precio, prop.moneda)) +
            (expensas ? '<span class="card__expensas">' + esc(expensas) + '</span>' : '') +
          '</p>' +
          '<div>' +
            '<h3 class="card__title"><a href="' + esc(urlPropiedad(prop)) + '">' +
              esc(prop.titulo) + '</a></h3>' +
            '<p class="card__address">' + esc(prop.barrio) + ' · ' + esc(prop.direccion) + '</p>' +
          '</div>' +
          '<ul class="card__specs">' +
            specHtml('dormitorio', prop.dormitorios + (prop.dormitorios === 1 ? ' dorm.' : ' dorm.')) +
            specHtml('bano', prop.banos + (prop.banos === 1 ? ' baño' : ' baños')) +
            specHtml('cochera', prop.cochera ? 'Cochera' : 'Sin cochera', prop.cochera) +
          '</ul>' +
        '</div>' +
      '</article>'
    );
  }

  /* ======================================================================
     HOME — filtros y listado
     ====================================================================== */

  const FILTROS_INICIALES = {
    operacion: '',
    tipo: '',
    barrio: '',
    dormitorios: '',
    moneda: 'ARS',
    precioMin: '',
    precioMax: '',
  };

  function initHome() {
    const grid = $('#grid');
    if (!grid) return;

    const form = $('#filtros');
    const vacio = $('#vacio');
    const contador = $('#resultados');

    const campos = {
      operacion: $('#f-operacion'),
      tipo: $('#f-tipo'),
      barrio: $('#f-barrio'),
      dormitorios: $('#f-dormitorios'),
      moneda: $('#f-moneda'),
      precioMin: $('#f-precio-min'),
      precioMax: $('#f-precio-max'),
    };

    // Select de barrios poblado dinámicamente desde el array.
    const barrios = Array.from(new Set(PROPIEDADES.map((p) => p.barrio))).sort((a, b) =>
      a.localeCompare(b, 'es')
    );
    barrios.forEach((b) => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      campos.barrio.appendChild(opt);
      const heroOpt = opt.cloneNode(true);
      const heroBarrio = $('#hero-barrio');
      if (heroBarrio) heroBarrio.appendChild(heroOpt);
    });

    function leerFiltros() {
      return {
        operacion: campos.operacion.value,
        tipo: campos.tipo.value,
        barrio: campos.barrio.value,
        dormitorios: campos.dormitorios.value,
        moneda: campos.moneda.value,
        precioMin: campos.precioMin.value.trim(),
        precioMax: campos.precioMax.value.trim(),
      };
    }

    function aplicarFiltros(f) {
      const min = f.precioMin === '' ? null : Number(f.precioMin);
      const max = f.precioMax === '' ? null : Number(f.precioMax);
      const usaPrecio = min !== null || max !== null;
      const dorm = f.dormitorios === '' ? null : Number(f.dormitorios);

      return PROPIEDADES.filter((p) => {
        if (f.operacion && p.operacion !== f.operacion) return false;
        if (f.tipo && p.tipo !== f.tipo) return false;
        if (f.barrio && p.barrio !== f.barrio) return false;
        if (dorm !== null && p.dormitorios < dorm) return false;
        // El rango de precio sólo compara valores de la misma moneda.
        if (usaPrecio) {
          if (p.moneda !== f.moneda) return false;
          if (min !== null && !isNaN(min) && p.precio < min) return false;
          if (max !== null && !isNaN(max) && p.precio > max) return false;
        }
        return true;
      });
    }

    function ordenar(lista) {
      return lista.slice().sort((a, b) => {
        if (a.destacada !== b.destacada) return a.destacada ? -1 : 1;
        return a.id.localeCompare(b.id, 'es');
      });
    }

    function sincronizarUrl(f) {
      const params = new URLSearchParams();
      Object.keys(FILTROS_INICIALES).forEach((k) => {
        if (f[k] && f[k] !== FILTROS_INICIALES[k]) params.set(k, f[k]);
      });
      const qs = params.toString();
      const url = location.pathname + (qs ? '?' + qs : '') + location.hash;
      history.replaceState(null, '', url);
    }

    function render() {
      const f = leerFiltros();
      const resultados = ordenar(aplicarFiltros(f));

      grid.innerHTML = resultados.map(renderCard).join('');
      grid.hidden = resultados.length === 0;
      vacio.hidden = resultados.length !== 0;

      contador.textContent =
        resultados.length === 1
          ? '1 propiedad encontrada'
          : resultados.length + ' propiedades encontradas';

      sincronizarUrl(f);
    }

    function limpiar() {
      Object.keys(campos).forEach((k) => {
        campos[k].value = FILTROS_INICIALES[k];
      });
      render();
    }

    // Lectura inicial desde la query string (links compartibles).
    const params = new URLSearchParams(location.search);
    Object.keys(campos).forEach((k) => {
      const v = params.get(k);
      if (v === null) return;
      const campo = campos[k];
      if (campo.tagName === 'SELECT') {
        if ($$('option', campo).some((o) => o.value === v)) campo.value = v;
      } else {
        campo.value = v;
      }
    });

    form.addEventListener('input', render);
    form.addEventListener('change', render);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      render();
    });
    $$('[data-limpiar]').forEach((b) => b.addEventListener('click', limpiar));

    // Buscador del hero: escribe en los filtros y baja al listado.
    const heroForm = $('#buscador');
    if (heroForm) {
      heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        campos.operacion.value = $('#hero-operacion').value;
        campos.tipo.value = $('#hero-tipo').value;
        campos.barrio.value = $('#hero-barrio').value;
        render();
        const destino = $('#propiedades');
        if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    render();
    initFormTasacion();
  }

  /* ======================================================================
     Formulario de tasación → WhatsApp
     ====================================================================== */

  function initFormTasacion() {
    const form = $('#form-tasacion');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valido = true;
      $$('[data-required]', form).forEach((campo) => {
        const wrapper = campo.closest('.field');
        const ok = campo.value.trim() !== '';
        wrapper.classList.toggle('field--invalid', !ok);
        campo.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && valido) campo.focus();
        if (!ok) valido = false;
      });
      if (!valido) return;

      const datos = {
        nombre: $('#t-nombre').value.trim(),
        telefono: $('#t-telefono').value.trim(),
        operacion: $('#t-operacion').value,
        tipo: $('#t-tipo').value,
        direccion: $('#t-direccion').value.trim(),
        mensaje: $('#t-mensaje').value.trim(),
      };

      const texto =
        'Hola, quiero tasar mi propiedad.\n' +
        'Nombre: ' + datos.nombre + '\n' +
        'Teléfono: ' + datos.telefono + '\n' +
        'Operación: ' + (datos.operacion || 'a definir') + '\n' +
        'Tipo: ' + (datos.tipo || 'a definir') + '\n' +
        'Ubicación: ' + (datos.direccion || 'a informar') +
        (datos.mensaje ? '\nComentarios: ' + datos.mensaje : '');

      window.open(linkWhatsapp(texto), '_blank', 'noopener');
    });

    form.addEventListener('input', (e) => {
      const campo = e.target;
      if (!campo.hasAttribute('data-required')) return;
      if (campo.value.trim() !== '') {
        campo.closest('.field').classList.remove('field--invalid');
        campo.setAttribute('aria-invalid', 'false');
      }
    });
  }

  /* ======================================================================
     FICHA INDIVIDUAL — propiedad.html
     ====================================================================== */

  function initPropiedad() {
    const root = $('#ficha');
    if (!root) return;

    const id = new URLSearchParams(location.search).get('id');
    const prop = PROPIEDADES.find((p) => p.id === id);

    if (!prop) {
      root.innerHTML =
        '<div class="wrap prop-error">' +
          '<h1>No encontramos esa propiedad</h1>' +
          '<p>Puede que ya no esté publicada o que el enlace sea incorrecto. ' +
          'Mirá el resto de las propiedades disponibles o escribinos y te ayudamos.</p>' +
          '<a class="btn btn--primary" href="index.html#propiedades">Ver todas las propiedades</a>' +
        '</div>';
      document.title = 'Propiedad no encontrada | STABILE INMOBILIARIA';
      return;
    }

    actualizarMeta(prop);
    inyectarJsonLd(prop);

    const expensas = textoExpensas(prop);
    const precio = formatPrecio(prop.precio, prop.moneda);
    const wa = linkWhatsappPropiedad(prop);
    const opLabel = etiquetaOperacion(prop.operacion);
    const altBase = capitalizar(prop.tipo) + ' en ' + prop.direccion + ', barrio ' + prop.barrio;

    const galeria =
      '<figure class="gallery">' +
        '<div class="gallery__main">' +
          '<img id="gal-main" src="' + esc(prop.imagenes[0]) + '" width="1200" height="900" ' +
            'fetchpriority="high" decoding="async" ' +
            'alt="' + esc(altBase + ' — foto 1 de ' + prop.imagenes.length) + '">' +
          '<p class="gallery__counter" id="gal-counter">1 / ' + prop.imagenes.length + '</p>' +
        '</div>' +
        (prop.imagenes.length > 1
          ? '<div class="thumbs" role="group" aria-label="Galería de fotos de la propiedad">' +
              prop.imagenes
                .map(
                  (src, i) =>
                    '<button type="button" class="thumb" data-src="' + esc(src) + '" ' +
                      'data-index="' + i + '" aria-current="' + (i === 0) + '">' +
                      '<img src="' + esc(src) + '" width="1200" height="900" loading="lazy" ' +
                        'decoding="async" alt="Ver foto ' + (i + 1) + ': ' + esc(altBase) + '">' +
                    '</button>'
                )
                .join('') +
            '</div>'
          : '') +
      '</figure>';

    const fichaTecnica =
      '<section class="prop-block" aria-labelledby="h-ficha">' +
        '<h2 id="h-ficha">Ficha técnica</h2>' +
        '<dl class="spec-grid">' +
          item('Operación', opLabel) +
          item('Tipo', capitalizar(prop.tipo)) +
          item('Dormitorios', String(prop.dormitorios)) +
          item('Baños', String(prop.banos)) +
          item('Cochera', prop.cochera ? 'Sí' : 'No') +
          item(
            'Expensas',
            prop.expensas === 0
              ? 'Sin expensas'
              : typeof prop.expensas === 'number'
              ? '$ ' + nf.format(prop.expensas)
              : 'A consultar'
          ) +
        '</dl>' +
      '</section>';

    const descripcion =
      '<section class="prop-block" aria-labelledby="h-desc">' +
        '<h2 id="h-desc">Descripción</h2>' +
        '<p>' + esc(prop.descripcion) + '</p>' +
      '</section>';

    const caracteristicas =
      prop.caracteristicas && prop.caracteristicas.length
        ? '<section class="prop-block" aria-labelledby="h-carac">' +
            '<h2 id="h-carac">Características</h2>' +
            '<ul class="list-marked">' +
              prop.caracteristicas.map((c) => '<li>' + esc(c) + '</li>').join('') +
            '</ul>' +
          '</section>'
        : '';

    const cercanias =
      prop.cercanias && prop.cercanias.length
        ? '<section class="prop-block" aria-labelledby="h-cerca">' +
            '<h2 id="h-cerca">La zona</h2>' +
            '<ul class="list-marked">' +
              prop.cercanias.map((c) => '<li>' + esc(c) + '</li>').join('') +
            '</ul>' +
          '</section>'
        : '';

    const condiciones = prop.condiciones
      ? '<section class="prop-block" aria-labelledby="h-cond">' +
          '<h2 id="h-cond">Condiciones de contratación</h2>' +
          '<div class="note-box"><p>' + esc(prop.condiciones) + '</p></div>' +
        '</section>'
      : '';

    const aside =
      '<aside class="prop-aside" aria-label="Contacto por esta propiedad">' +
        '<div class="price-card">' +
          '<p class="price-card__label">' + esc(opLabel) + '</p>' +
          '<p class="price-card__price">' + esc(precio) + '</p>' +
          (expensas ? '<p class="price-card__extra">' + esc(expensas) + '</p>' : '') +
          '<div class="price-card__actions">' +
            '<a class="btn btn--primary" href="' + esc(wa) + '" target="_blank" rel="noopener">' +
              ICONOS.whatsapp + 'Consultar por WhatsApp</a>' +
            '<a class="btn btn--outline" href="tel:+' + esc(EMPRESA.whatsapp) + '">Llamar ahora</a>' +
          '</div>' +
          '<ul class="price-card__meta">' +
            '<li>Código de referencia: ' + esc(prop.id) + '</li>' +
            '<li>' + esc(EMPRESA.horarios) + '</li>' +
          '</ul>' +
        '</div>' +
      '</aside>';

    root.innerHTML =
      '<nav class="breadcrumb wrap" aria-label="Ubicación">' +
        '<ol>' +
          '<li><a href="index.html">Inicio</a></li>' +
          '<li><a href="index.html?operacion=' + esc(prop.operacion) + '#propiedades">' +
            esc(opLabel) + '</a></li>' +
          '<li aria-current="page">' + esc(prop.id) + '</li>' +
        '</ol>' +
      '</nav>' +
      '<div class="wrap">' +
        '<header class="prop-head">' +
          '<div class="prop-head__badges">' +
            '<span class="badge badge--op' +
              (prop.operacion === 'alquiler' ? ' badge--op-alquiler' : '') + '">' +
              esc(opLabel) + '</span>' +
            '<span class="badge badge--soft">' + esc(capitalizar(prop.tipo)) + '</span>' +
            '<span class="badge badge--soft">' + esc(prop.barrio) + '</span>' +
          '</div>' +
          '<h1>' + esc(prop.titulo) + '</h1>' +
          '<p class="prop-head__address">' + esc(prop.direccion) + ' · Barrio ' +
            esc(prop.barrio) + ', Córdoba</p>' +
        '</header>' +
        '<div class="prop-layout">' +
          '<div>' + galeria + fichaTecnica + descripcion + caracteristicas + cercanias +
            condiciones + '</div>' +
          aside +
        '</div>' +
      '</div>';

    // CTA fijo en mobile
    const cta = document.createElement('div');
    cta.className = 'sticky-cta';
    cta.innerHTML =
      '<p class="sticky-cta__price"><span>' + esc(opLabel) + '</span>' + esc(precio) + '</p>' +
      '<a class="btn btn--primary" href="' + esc(wa) + '" target="_blank" rel="noopener">' +
        ICONOS.whatsapp + 'Consultar</a>';
    document.body.appendChild(cta);
    document.body.classList.add('has-sticky-cta');

    initGaleria(prop, altBase);
    renderSimilares(prop);
  }

  function item(dt, dd) {
    return '<div><dt>' + esc(dt) + '</dt><dd>' + esc(dd) + '</dd></div>';
  }

  function initGaleria(prop, altBase) {
    const main = $('#gal-main');
    const counter = $('#gal-counter');
    const thumbs = $$('.thumb');
    if (!main || !thumbs.length) return;

    function mostrar(i) {
      const src = prop.imagenes[i];
      main.src = src;
      main.alt = altBase + ' — foto ' + (i + 1) + ' de ' + prop.imagenes.length;
      counter.textContent = i + 1 + ' / ' + prop.imagenes.length;
      thumbs.forEach((t, j) => t.setAttribute('aria-current', String(i === j)));
    }

    thumbs.forEach((t) => {
      t.addEventListener('click', () => mostrar(Number(t.dataset.index)));
    });

    // Navegación con flechas dentro de la galería.
    $('.thumbs').addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const actual = thumbs.findIndex((t) => t.getAttribute('aria-current') === 'true');
      const siguiente =
        (actual + (e.key === 'ArrowRight' ? 1 : -1) + thumbs.length) % thumbs.length;
      e.preventDefault();
      mostrar(siguiente);
      thumbs[siguiente].focus();
    });
  }

  function renderSimilares(prop) {
    const cont = $('#similares');
    if (!cont) return;

    // Prioridad: mismo barrio → misma operación → mismo tipo → el resto.
    const otras = PROPIEDADES.filter((p) => p.id !== prop.id);
    const puntaje = (p) =>
      (p.barrio === prop.barrio ? 4 : 0) +
      (p.operacion === prop.operacion ? 2 : 0) +
      (p.tipo === prop.tipo ? 1 : 0);
    const lista = otras
      .slice()
      .sort((a, b) => puntaje(b) - puntaje(a) || a.id.localeCompare(b.id, 'es'))
      .slice(0, 3);

    if (!lista.length) {
      cont.remove();
      return;
    }

    $('#similares-grid').innerHTML = lista.map(renderCard).join('');
    cont.hidden = false;
  }

  /* ======================================================================
     Meta tags y datos estructurados de la ficha
     ====================================================================== */

  function setMeta(selector, valor) {
    const el = $(selector);
    if (el) el.setAttribute('content', valor);
  }

  function actualizarMeta(prop) {
    const precio = formatPrecio(prop.precio, prop.moneda);
    const titulo =
      prop.titulo + ' — ' + etiquetaOperacion(prop.operacion) + ' ' + precio +
      ' | STABILE INMOBILIARIA';
    const desc =
      capitalizar(prop.tipo) + ' en ' + etiquetaOperacion(prop.operacion).toLowerCase() +
      ' en ' + prop.barrio + ', Córdoba. ' + prop.dormitorios +
      (prop.dormitorios === 1 ? ' dormitorio, ' : ' dormitorios, ') + prop.banos +
      (prop.banos === 1 ? ' baño. ' : ' baños. ') + precio + '. ' + prop.direccion + '.';
    const imagen = new URL(prop.imagenes[0], location.href).href;

    document.title = titulo;
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', titulo);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[property="og:image"]', imagen);
    setMeta('meta[property="og:url"]', location.href);
    setMeta('meta[name="twitter:title"]', titulo);
    setMeta('meta[name="twitter:description"]', desc);
    setMeta('meta[name="twitter:image"]', imagen);

    const canonical = $('link[rel="canonical"]');
    if (canonical) canonical.href = location.href;
  }

  function inyectarJsonLd(prop) {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: prop.titulo,
      description: prop.descripcion,
      url: location.href,
      datePosted: new Date().toISOString().slice(0, 10),
      image: prop.imagenes.map((src) => new URL(src, location.href).href),
      identifier: prop.id,
      address: {
        '@type': 'PostalAddress',
        streetAddress: prop.direccion,
        addressLocality: EMPRESA.ciudad,
        addressRegion: EMPRESA.provincia,
        addressCountry: EMPRESA.pais,
      },
      offers: {
        '@type': 'Offer',
        price: prop.precio,
        priceCurrency: prop.moneda,
        availability: 'https://schema.org/InStock',
        businessFunction:
          prop.operacion === 'venta'
            ? 'http://purl.org/goodrelations/v1#Sell'
            : 'http://purl.org/goodrelations/v1#LeaseOut',
        seller: {
          '@type': 'RealEstateAgent',
          name: EMPRESA.nombre,
          telephone: '+' + EMPRESA.whatsapp,
          email: EMPRESA.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: EMPRESA.direccion,
            addressLocality: EMPRESA.ciudad,
            addressRegion: EMPRESA.provincia,
            postalCode: EMPRESA.codigoPostal,
            addressCountry: EMPRESA.pais,
          },
        },
      },
      mainEntity: {
        '@type': prop.tipo === 'casa' ? 'House' : 'Apartment',
        name: prop.titulo,
        numberOfRooms: prop.dormitorios,
        numberOfBedrooms: prop.dormitorios,
        numberOfBathroomsTotal: prop.banos,
        amenityFeature: prop.caracteristicas.map((c) => ({
          '@type': 'LocationFeatureSpecification',
          name: c,
          value: true,
        })),
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /* ======================================================================
     Header (navegación mobile) y datos de contacto compartidos
     ====================================================================== */

  function initHeader() {
    const toggle = $('#nav-toggle');
    const panel = $('#mobile-nav');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', () => {
      const abierto = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!abierto));
      panel.classList.toggle('is-open', !abierto);
    });

    panel.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A') return;
      toggle.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      toggle.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
    });
  }

  /** Rellena links de WhatsApp genéricos e íconos declarados en el HTML. */
  function initComunes() {
    const waGeneral = linkWhatsapp(
      'Hola, quiero hacer una consulta sobre las propiedades de Stabile Inmobiliaria.'
    );
    $$('[data-wa]').forEach((a) => {
      a.href = waGeneral;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('[data-icon]').forEach((el) => {
      const icono = ICONOS[el.dataset.icon];
      if (icono) el.insertAdjacentHTML('afterbegin', icono);
    });
    $$('[data-anio]').forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ====================================================================== */

  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initComunes();
    initHome();
    initPropiedad();
  });
})();
