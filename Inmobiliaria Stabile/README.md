# STABILE INMOBILIARIA — Sitio web

Sitio estático para inmobiliaria en Córdoba Capital. HTML5 + CSS3 + JavaScript
vanilla, sin frameworks, sin build step y sin dependencias externas más allá de
una fuente de Google Fonts.

---

## Estructura

```
/
├── index.html            Home: hero + buscador + listado con filtros + servicios + tasación
├── propiedad.html        Ficha individual (lee ?id= de la query string)
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── vercel.json           Cache headers para /img, /css y /js
├── server.js             Servidor local para previsualizar (NO se usa en producción)
├── css/
│   └── styles.css        Toda la hoja de estilos
├── js/
│   ├── propiedades.js    ← LA BASE DE DATOS. Acá vive toda la información.
│   └── app.js            Render, filtros, galería, links de WhatsApp, JSON-LD
└── img/
    ├── logo/             Logo original y sus recortes (ver img/logo/LEEME.md)
    └── ...               Fotos de las propiedades + imagen institucional + og
```

---

## Identidad visual

### Paleta

| Color | HEX | Dónde se usa |
|---|---|---|
| Azul institucional | `#01286D` | Header, footer, botones principales, badge "Venta". |
| Naranja acento | `#EF7D18` | CTA de WhatsApp del header, badge "Destacada", títulos del footer, marcadores de listas, miniatura activa de la galería. |
| Blanco | `#FFFFFF` | Tarjetas, formularios, hero. |
| Gris cálido | `#F7F6F4` | Fondo general. |
| Casi negro | `#1A1A1A` | Texto y badge "Alquiler". |

Están definidos como variables CSS al principio de `css/styles.css`
(`--accent`, `--naranja`, `--bg`, `--ink`…). Cambiando esas variables cambia
todo el sitio.

**Sobre el naranja:** tiene poco contraste sobre blanco (2.6:1), así que **no se
usa como color de texto sobre fondo claro**. Se usa como fondo (con texto casi
negro encima, 6.3:1) o sobre el azul institucional (5.0:1). Ambas combinaciones
cumplen WCAG AA. Si lo movés a texto sobre blanco, se rompe la accesibilidad.

### Logo

El logo trae el texto **en blanco**, así que necesita fondo oscuro: por eso el
header y el footer son azules. El detalle de cada archivo está en
[`img/logo/LEEME.md`](img/logo/LEEME.md).

---

## Cómo agregar una propiedad

Todo se hace en un solo archivo: **`js/propiedades.js`**. No hay que tocar el HTML.
El listado, el select de barrios, los filtros, la ficha individual, el sitemap de
propiedades similares y los datos estructurados se generan solos desde ese array.

### 1. Copiá un objeto y editalo

Abrí `js/propiedades.js`, copiá cualquiera de los objetos del array `PROPIEDADES`,
pegalo al final (antes del `];`) y cambiá los valores:

```js
{
  id: 'STB-006',                       // Único. Formato STB-000. Es lo que va en la URL.
  operacion: 'venta',                  // 'venta' | 'alquiler'
  tipo: 'departamento',                // 'departamento' | 'casa' | 'local' | 'terreno'
  titulo: 'Departamento 1 dormitorio en Nueva Córdoba',
  direccion: 'Independencia 1200, 5to piso',
  barrio: 'Nueva Córdoba',             // Se agrega solo al filtro de barrios
  precio: 48000,                       // Número, sin puntos ni símbolos
  moneda: 'USD',                       // 'USD' | 'ARS'
  expensas: 45000,                     // Número | 0 (sin expensas) | null (a consultar)
  dormitorios: 1,
  banos: 1,
  cochera: false,
  destacada: false,                    // true = badge "Destacada" y aparece primera
  caracteristicas: ['Balcón', 'Cocina equipada'],
  descripcion: 'Texto largo, un párrafo. Se muestra completo en la ficha.',
  cercanias: ['A 300 m del Parque Sarmiento'],   // [] si no aplica
  condiciones: 'Contrato 2 años. Aumento trimestral por IPC.',  // null para ventas
  imagenes: ['img/stb-006-1.jpg', 'img/stb-006-2.jpg'],
}
```

### 2. Subí las fotos a `/img`

Nombralas con el patrón `stb-006-1.jpg`, `stb-006-2.jpg`, etc. y listalas en el
mismo orden en el campo `imagenes`. **La primera imagen es la que se ve en la
tarjeta del listado y la que se comparte en WhatsApp y redes.**

- Ratio **4:3** (por ejemplo 1200 × 900 px).
- JPG optimizado, idealmente menos de 200 KB por foto.
- Si una foto no es 4:3, el CSS la recorta con `object-fit: cover` sin romper el
  layout, pero conviene recortarla antes para controlar el encuadre.

### 3. Agregá la URL al `sitemap.xml`

Una línea más:

```xml
<url><loc>https://TU-DOMINIO/propiedad.html?id=STB-006</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
```

Listo. La propiedad ya aparece en el listado, en los filtros y tiene su ficha en
`propiedad.html?id=STB-006`.

### Detalle de los campos especiales

| Campo | Comportamiento |
|---|---|
| `expensas: null` | La ficha muestra "A consultar" y la tarjeta no muestra nada. |
| `expensas: 0` | Muestra "Sin expensas". Usalo cuando la unidad realmente no paga. |
| `expensas: 84000` | Muestra "+ $ 84.000 expensas" en la tarjeta y el monto en la ficha. |
| `condiciones: null` | No se muestra el bloque "Condiciones de contratación" (típico en ventas). |
| `cercanias: []` | No se muestra el bloque "La zona". |
| `destacada: true` | Badge "Destacada" en la tarjeta y prioridad en el orden del listado. |

---

## Reemplazar las imágenes placeholder

Las imágenes actuales son placeholders grises de 1200 × 900 px con el ID de la
propiedad y el nombre del ambiente encima. Reemplazá cada archivo por la foto
real **manteniendo el mismo nombre** y no hace falta tocar nada más.

> `img/og-default.jpg` (la imagen que se ve al compartir el sitio en WhatsApp y
> redes) **ya está hecha** con el logo sobre el azul institucional. No hace falta
> reemplazarla.

| Archivo | Qué foto va acá |
|---|---|
| `img/hero.jpg` | Imagen institucional del hero (fachada de la oficina, equipo o vista de Córdoba). |
| `img/stb-001-1.jpg` | STB-001 — Fachada del edificio |
| `img/stb-001-2.jpg` | STB-001 — Living comedor |
| `img/stb-001-3.jpg` | STB-001 — Dormitorio principal |
| `img/stb-001-4.jpg` | STB-001 — Cocina equipada |
| `img/stb-001-5.jpg` | STB-001 — Balcón |
| `img/stb-002-1.jpg` | STB-002 — Frente de la casa |
| `img/stb-002-2.jpg` | STB-002 — Living |
| `img/stb-002-3.jpg` | STB-002 — Cocina comedor |
| `img/stb-002-4.jpg` | STB-002 — Dormitorio en suite |
| `img/stb-002-5.jpg` | STB-002 — Galería con asador |
| `img/stb-003-1.jpg` | STB-003 — Living comedor |
| `img/stb-003-2.jpg` | STB-003 — Dormitorio principal |
| `img/stb-003-3.jpg` | STB-003 — Cocina |
| `img/stb-003-4.jpg` | STB-003 — Baño |
| `img/stb-004-1.jpg` | STB-004 — Living planta baja |
| `img/stb-004-2.jpg` | STB-004 — Cocina comedor |
| `img/stb-004-3.jpg` | STB-004 — Dormitorio planta alta |
| `img/stb-004-4.jpg` | STB-004 — Baño |
| `img/stb-005-1.jpg` | STB-005 — Patio propio |
| `img/stb-005-2.jpg` | STB-005 — Dormitorio |
| `img/stb-005-3.jpg` | STB-005 — Cocina amoblada |
| `img/stb-005-4.jpg` | STB-005 — Baño |

---

## Datos de la inmobiliaria

Están al final de `js/propiedades.js`, en el objeto `EMPRESA`: número de
WhatsApp, teléfono, mail, dirección, horarios, redes y matrícula. Cambiar el
número ahí actualiza **todos** los links de WhatsApp del sitio.

Además hay datos que están escritos directamente en el HTML y también hay que
actualizar al personalizar el sitio:

- **Matrícula del martillero**: aparece como `Mat. XXXX - Colegio Profesional de
  Martilleros y Corredores Públicos de la Provincia de Córdoba` en el footer de
  `index.html` y `propiedad.html`.
- **Dirección, horarios, mail y redes** del footer de ambas páginas.
- **Dominio**: `https://stabile-inmobiliaria.vercel.app` aparece en los meta tags
  (`canonical`, `og:url`, `og:image`) de las dos páginas, en `robots.txt`, en
  `sitemap.xml` y en `EMPRESA.sitio`. Buscá y reemplazá por el dominio final.

---

## Cómo se ve en local

```bash
node server.js
```

Y abrí `http://localhost:4173`. `server.js` es solo para desarrollo: sirve los
archivos estáticos y nada más. No se usa en producción.

---

## Deploy en Vercel

Es un sitio estático puro, sin build step.

1. Subí la carpeta a un repositorio de Git.
2. En Vercel, **Add New → Project** e importá el repositorio.
3. En Framework Preset elegí **Other**. Dejá Build Command vacío y Output
   Directory en la raíz (`./`).
4. Deploy.

También podés deployar sin Git:

```bash
npx vercel --prod
```

`vercel.json` ya configura los headers de cache para las imágenes y los assets.

---

## Detalles técnicos

- **Mobile-first.** Breakpoints en 640 px (2 columnas), 860 px (hero a dos
  columnas), 960/1000 px (3 columnas y nav de escritorio).
- **Filtros client-side.** No recargan la página y quedan sincronizados con la
  query string, así que los links con filtros aplicados son compartibles:
  `index.html?operacion=alquiler&barrio=Alta+C%C3%B3rdoba`.
- **Rango de precio y moneda.** Como conviven propiedades en USD y en ARS, el
  rango de precio incluye un selector de moneda: cuando se completa un mínimo o
  un máximo, solo se comparan las propiedades de esa moneda.
- **SEO.** Meta tags y Open Graph completos por página, `RealEstateAgent` en la
  home y `RealEstateListing` generado dinámicamente en cada ficha, más
  `sitemap.xml` y `robots.txt`.
- **Accesibilidad.** Skip link, landmarks, labels en todos los campos, contador
  de resultados con `role="status"`, foco visible, targets de 44 px y alt text
  descriptivo generado a partir de los datos de cada propiedad.
- **Performance.** Un solo CSS, un solo JS, sin frameworks. Imágenes con
  `width`/`height` y `aspect-ratio` para evitar CLS, `loading="lazy"` fuera de la
  primera fila y `fetchpriority="high"` en la imagen principal.

---

## Formularios

El sitio no tiene backend. Los dos formularios (tasación y consulta por
propiedad) arman un mensaje de WhatsApp con los datos cargados y abren
`wa.me`. No se guarda ni se envía información a ningún servidor.

Si más adelante se quiere recibir los datos por mail, hay que reemplazar el
`window.open(...)` del final de `initFormTasacion()` en `js/app.js` por un
`fetch()` a un servicio de formularios (Formspree, Vercel Functions, etc.).
