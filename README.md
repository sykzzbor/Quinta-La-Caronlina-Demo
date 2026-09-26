# Quinta La Carolina — demo web

Sitio de una sola página para [@quintalacarolina.eventos](https://www.instagram.com/quintalacarolina.eventos/) (Colonia Caroya, Córdoba). Vite + HTML/CSS/JS, GSAP (ScrollTrigger, SplitText) y Lenis.

```bash
npm install
npm run dev      # desarrollo
npm run build    # genera /dist listo para publicar
```

## La idea

El sitio es **un día en la quinta**: el scroll es el paso de las horas y el fondo cambia de luz (lino de mañana, ladrillo de tarde, verde al atardecer, noche, lino otra vez al día siguiente).

- **Guirnalda de luces** en la cabecera: es el índice y el progreso. Cada lamparita es un capítulo; de noche se prenden todas.
- **Hero**: "Un lugar al que volver" (frase de un post de la quinta). La ventana dentro del título es la toma aérea real del parque y se abre hasta cubrir la pantalla.
- **Los que vuelven**: odómetro de edades reales celebradas ahí (¿nena o nene?, 3, 30, 50, 70, 80).
- **Adentro / afuera**: comparador arrastrable salón ↔ parque.
- **La noche**: las fotos cuelgan de broches en una guirnalda que se enciende y se mecen con el scroll. Abren el álbum (41 fotos con enlace a cada publicación).
- **Cotizá tu evento**: cinco preguntas que se escriben en vivo en una tarjeta tipo invitación y terminan en un mensaje de WhatsApp armado.

## Identidad

- Monograma QC + picaflor: trazado a SVG desde el post "Nueva identidad" (`scripts/trace-logo.mjs` → `src/qc-mark.svg`).
- Colores: verde del logo `#1d4424`, lino del papel `#ede4d9`, ladrillo del salón, noche del parque y luz de guirnalda.
- Tipografías: Bodoni Moda (eco de las mayúsculas didonas del logo) + Hanken Grotesk, autohospedadas.

## Material y datos (nada inventado)

- Fotos y videos: publicaciones públicas de Instagram y la portada de Facebook de la quinta (originales en `raw/`). `npm run images` → `node scripts/build-media.mjs` regenera WebP responsivos, fotogramas y loops de video (se borró la fecha impresa en la toma aérea).
- Datos del Facebook oficial: salón para eventos de hasta 100 personas, casa quinta para 10 con alquiler diario, gran parque, dirección Calle José Romanutti esquina 144 y WhatsApp +54 9 3525 51-1516. "Ingreso por calle 144" sale del cartel de la entrada (reel de abril de 2026).
- Fundadores y opción de hospedaje: ficha de [paraeventoscordoba.com.ar](https://paraeventoscordoba.com.ar/proveedores/quinta-la-carolina/).
- Las citas son textos de las publicaciones de la quinta. Sin precios, testimonios ni servicios no publicados.

## Antes de publicar

- Confirmar con la quinta el uso de las fotos (aparecen clientes; la boda de Alfonsina y Fernando es de @sentirfotografialorenap, acreditada en el sitio).
- Hoy el sitio tiene `noindex` por ser demo.
