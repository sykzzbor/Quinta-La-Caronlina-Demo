import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

// <img data-img="nombre" data-sizes="..." alt="..."> → src, srcset, sizes, width, height y lazy.
// Los anchos disponibles salen de src/img-data.json (lo genera scripts/build-media.mjs).
function responsiveImages() {
  const load = () => JSON.parse(readFileSync('src/img-data.json', 'utf8'));
  return {
    name: 'responsive-images',
    transformIndexHtml(html) {
      const data = load();
      // Monograma QC + picaflor (trazado del logo real) como <symbol> para reusar con <use href="#qc">
      const svg = readFileSync('src/qc-mark.svg', 'utf8');
      const viewBox = /viewBox="([^"]+)"/.exec(svg)[1];
      const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
      html = html.replace('<!--qc-symbol-->',
        `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="qc" viewBox="${viewBox}">${inner}</symbol></svg>`);
      return html.replace(/<img\b([^>]*?)\sdata-img="([^"]+)"([^>]*)>/g, (tag, before, name, after) => {
        const info = data[name];
        if (!info) throw new Error(`Imagen desconocida: ${name}`);
        const attrs = `${before}${after}`;
        const sizes = /data-sizes="([^"]+)"/.exec(attrs)?.[1] ?? '100vw';
        const eager = /\sdata-eager\b/.test(attrs);
        const rest = attrs.replace(/\s?data-sizes="[^"]+"/, '').replace(/\s?data-eager\b/, '');
        const mid = info.widths[Math.min(1, info.widths.length - 1)];
        const srcset = info.widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ');
        const loading = eager ? 'fetchpriority="high"' : 'loading="lazy"';
        return `<img${rest} src="/img/${name}-${mid}.webp" srcset="${srcset}" sizes="${sizes}" width="${info.w}" height="${info.h}" ${loading} decoding="async" style="--ph:${info.color}">`;
      });
    },
  };
}

export default defineConfig({
  plugins: [responsiveImages()],
  server: { host: true },
  build: { target: 'es2020', assetsInlineLimit: 0 },
});
