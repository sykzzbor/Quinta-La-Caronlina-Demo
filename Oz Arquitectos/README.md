# OZ Arquitectos — demo

Demo comercial para un estudio de arquitectura en Jesús María, Córdoba.
Next.js 16 (App Router) + TypeScript, CSS propio con tokens, sin frameworks de estilos.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run typecheck  # tsc --noEmit
npx eslint .       # lint
```

## Estado del contenido

**Nada de lo que se ve es información verificada del estudio.** Las obras, los
textos y las fotografías son material de muestra para probar la composición.
Las localidades sí son reales y pertenecen al norte de Córdoba.

Lo que hay que reemplazar antes de publicar, en orden:

| Archivo | Qué contiene |
|---|---|
| `data/estudio.ts` | Nombre, localidad, canales de contacto, proceso y servicios. Los canales están en `null`: mientras lo estén **no se muestran**, para no publicar un teléfono o un correo inventado. |
| `data/obras.ts` | Las seis obras: título, tipo, lugar, encargo, decisión de proyecto y galería. Sin superficies, años ni nombres de comitentes, porque no había forma de verificarlos. |
| `data/imagenes.ts` | Registro de fotos: nombre de archivo, anchos disponibles, proporción, texto alternativo y recorte. |
| `data/creditos.ts` | Autoría de las fotos de demostración (licencia Unsplash). Se borra al cargar fotos propias. |
| `app/robots.ts` | Hoy bloquea la indexación. Al pasar a producción, permitirla y sumar sitemap. |

Los metadatos de cada página también declaran `robots: noindex` desde
`app/layout.tsx`, para que la demo no compita con el sitio real del estudio.

## Fotografía

No hay pipeline de imágenes en el build: cada foto vive en `public/img` en tres
anchos ya optimizados a WebP, y `components/Foto.tsx` arma el `srcset`. Para
cargar fotos nuevas:

1. Exportar cada toma en tres anchos (por ejemplo `600`, `1000`, `1500`) como
   `nombre-<ancho>.webp` en `public/img/`.
2. Registrarla en `data/imagenes.ts` con su proporción real (`alto / ancho`) y
   un `alt` que describa lo que se ve.
3. Usarla desde `data/obras.ts` o desde el componente que corresponda.

El hero es el único caso con dirección de arte por breakpoint: `hero-ancho`
(16:9) en escritorio y `hero-alto` (recorte propio) en pantallas angostas, vía
`components/FotoHero.tsx`.

## Sistema visual

La tesis está escrita arriba de `app/globals.css`: la página es la sombra de
una galería y las fotografías son los vanos por donde entra la luz. De ahí sale
todo lo demás.

- **Color**: seis tokens. Fondo tinta cálida, texto cal en tres niveles y un
  único acento verde (`--monte`) reservado a foco y estado actual. El color de
  la página lo ponen las fotos, no la interfaz.
- **Tipografía**: Archivo (Omnibus-Type, Buenos Aires) para títulos, rótulos e
  interfaz; Source Serif 4 para texto corrido. Dos familias, sin excepciones.
- **Columnata**: cinco hairlines verticales fijas que marcan la retícula y por
  delante de las cuales pasa el contenido. Es la única capa decorativa del
  sitio y tiene un rol: las fotos a sangre la tapan, y ahí se lee la tensión
  entre estructura y vano. Se oculta por debajo de 1024px.
- **Superficies**: sin tarjetas, sin sombras, sin radios. La jerarquía sale de
  luminancia, escala y espacio.
- **Espacio**: tres saltos (`--e1`, `--e2`, `--e3`) para dentro de un grupo,
  entre grupos y entre secciones.

Mobile no es el escritorio encogido: el hero cambia de cartel a pantalla
completa a banda de foto + bloque de texto, y las cajas de imagen respetan la
proporción original de cada toma en vez de recortarla contra un alto fijo.

## Movimiento

Tres momentos, nada más:

1. Entrada del hero, encadenada a `document.fonts.ready` para que el título no
   aparezca con una tipografía de reemplazo (con tope de 2 s por si falla).
2. Revelado corto al entrar en pantalla, una sola vez (`components/Revelar.tsx`).
3. Escala mínima de la foto al pasar el mouse por una obra, sólo en punteros
   finos.

Todo respeta `prefers-reduced-motion`, y sin JavaScript el contenido se ve
igual: la clase `js` que agrega el script del `<head>` es la que habilita los
estados iniciales invisibles.

## Formulario

`components/Formulario.tsx` valida en el navegador y confirma, pero **no envía
nada**. Lo dice en pantalla. Para conectarlo, reemplazar el `setTimeout` del
`onSubmit` por la llamada real y ajustar el texto de la confirmación.
