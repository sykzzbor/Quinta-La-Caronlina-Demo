import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { estudio } from "@/data/estudio";
import { sitioUrl } from "@/data/navegacion";
import Encabezado from "@/components/Encabezado";
import Pie from "@/components/Pie";
import WhatsAppFlotante from "@/components/WhatsAppFlotante";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--fuente-titulo",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3A322D",
};

export const metadata: Metadata = {
  metadataBase: new URL(sitioUrl),
  title: {
    default: `${estudio.nombre} — Arquitectura en ${estudio.localidad}, ${estudio.provincia}`,
    template: `%s — ${estudio.nombre}`,
  },
  description: estudio.tesis,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: estudio.nombre,
    title: `${estudio.nombre} — Arquitectura en ${estudio.localidad}`,
    description: estudio.tesis,
  },
  // Demo: no debe competir en buscadores con el sitio real del estudio.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-AR"
      className={archivo.variable}
      // El script de abajo agrega la clase `js` antes de hidratar.
      suppressHydrationWarning
    >
      <head>
        <script
          // Marca que hay JS antes del primer pintado: sin JS, el texto del
          // hero se muestra directamente en vez de esperar una animación.
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>
        <a className="salto" href="#contenido">
          Ir al contenido
        </a>
        <Encabezado />
        <main id="contenido">{children}</main>
        <Pie />
        <WhatsAppFlotante />
      </body>
    </html>
  );
}
