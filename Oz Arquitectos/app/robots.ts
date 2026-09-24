import type { MetadataRoute } from "next";

/**
 * Demo: no debe indexarse. Compite con el sitio real del estudio y muestra
 * obras de muestra. Al pasar a producción, cambiar por `allow: "/"` y sumar
 * un sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
