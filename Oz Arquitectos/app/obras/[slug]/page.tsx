import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Foto, { relacion } from "@/components/Foto";
import Revelar from "@/components/Revelar";
import IconoWhatsApp from "@/components/IconoWhatsApp";
import { obras, obraPorSlug, obraSiguiente } from "@/data/obras";
import { linkWhatsApp } from "@/data/estudio";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return obras.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const obra = obraPorSlug(slug);
  if (!obra) return {};
  return {
    title: `${obra.titulo} — ${obra.lugar}`,
    description: `${obra.tipo} en ${obra.lugar}. ${obra.resumen}`,
  };
}

const CLAVES = [
  { n: "01", titulo: "El encargo", campo: "encargo" },
  { n: "02", titulo: "La decisión de proyecto", campo: "decision" },
  { n: "03", titulo: "Lo construido", campo: "estado" },
] as const;

export default async function DetalleObra({ params }: Params) {
  const { slug } = await params;
  const obra = obraPorSlug(slug);
  if (!obra) notFound();

  const siguiente = obraSiguiente(obra.slug);
  const [apertura, ...resto] = obra.galeria;

  return (
    <article>
      <section className="cabeza-pagina cabeza-pagina--obra">
        <div className="marco">
          <p className="eyebrow">
            Obra {obra.indice} · {obra.tipo}
          </p>
          <h1 className="display detalle__titulo">{obra.titulo}</h1>
          <p className="meta detalle__lugar">{obra.lugar}, Córdoba</p>
        </div>
      </section>

      <div className="detalle__apertura">
        <div className="detalle__marco" style={relacion(apertura.imagen)}>
          <Foto imagen={apertura.imagen} sizes="100vw" prioridad className="foto-cubre" />
        </div>
      </div>

      <section className="bloque bloque--claro">
        <div className="marco detalle__cuerpo">
          <ol className="claves" role="list">
            {CLAVES.map((c) => (
              <Revelar as="li" key={c.n}>
                <span className="num">/{c.n}</span>
                <div>
                  <h2 className="t2">{c.titulo}</h2>
                  <p className="cuerpo">{obra[c.campo]}</p>
                </div>
              </Revelar>
            ))}
          </ol>

          <Revelar className="detalle__aparte">
            <h2 className="pie__rotulo">Ficha</h2>
            <dl className="detalle__ficha">
              <div>
                <dt>Tipo</dt>
                <dd>{obra.tipo}</dd>
              </div>
              <div>
                <dt>Lugar</dt>
                <dd>{obra.lugar}, Córdoba</dd>
              </div>
              <div>
                <dt>Índice</dt>
                <dd>Obra {obra.indice} de {obras.length}</dd>
              </div>
            </dl>
            <a
              className="btn btn--wa detalle__wa"
              href={linkWhatsApp(`me interesó ${obra.titulo}. `)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <IconoWhatsApp size={19} />
              Consultar una obra así
            </a>
          </Revelar>
        </div>
      </section>

      {resto.length > 0 && (
        <section className="bloque bloque--oscuro" aria-label="Galería de la obra">
          <div className="marco galeria">
            {resto.map(({ imagen, pie }) => (
              <Revelar key={imagen.nombre} className="galeria__pieza">
                <div className="marco-foto" style={relacion(imagen)}>
                  <Foto
                    imagen={imagen}
                    sizes="(min-width: 900px) 48vw, 100vw"
                    className="foto-cubre"
                  />
                </div>
                {pie && <p className="pie-foto pie-foto--oscuro">{pie}</p>}
              </Revelar>
            ))}
          </div>
        </section>
      )}

      <section className="bloque bloque--claro bloque--ceñido" aria-label="Siguiente obra">
        <div className="marco siguiente">
          <div>
            <p className="eyebrow">Siguiente obra</p>
            <Link href={`/obras/${siguiente.slug}`} className="siguiente__enlace">
              <span className="t1">{siguiente.titulo}</span>
              <span className="meta">
                {siguiente.tipo} · {siguiente.lugar}
              </span>
            </Link>
          </div>
          <Link className="btn btn--secundario" href="/obras">
            Ver todas las obras
          </Link>
        </div>
      </section>
    </article>
  );
}
