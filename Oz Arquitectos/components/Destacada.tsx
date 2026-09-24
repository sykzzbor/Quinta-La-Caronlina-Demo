import Link from "next/link";
import Foto, { relacion } from "./Foto";
import Revelar from "./Revelar";
import { obraDestacada } from "@/data/obras";

const CLAVES = [
  { n: "01", titulo: "El encargo", campo: "encargo" },
  { n: "02", titulo: "La decisión", campo: "decision" },
  { n: "03", titulo: "Lo construido", campo: "estado" },
] as const;

export default function Destacada() {
  const obra = obraDestacada;
  return (
    <section className="bloque bloque--claro" id="destacada" aria-labelledby="destacada-t">
      <div className="marco destacada">
        <Revelar className="destacada__media">
          <div className="destacada__marco" style={relacion(obra.portada)}>
            <Foto imagen={obra.portada} sizes="(min-width: 900px) 52vw, 100vw" className="destacada__img" />
          </div>
          <p className="destacada__pie">{obra.galeria[0]?.pie}</p>
        </Revelar>

        <Revelar className="destacada__panel">
          <p className="eyebrow">Obra destacada · {obra.indice}</p>
          <h2 className="t1" id="destacada-t">
            {obra.titulo}
          </h2>
          <p className="meta destacada__lugar">
            {obra.tipo} · {obra.lugar}, Córdoba
          </p>

          <ol className="claves" role="list">
            {CLAVES.map((c) => (
              <li key={c.n}>
                <span className="num">/{c.n}</span>
                <div>
                  <h3 className="t3">{c.titulo}</h3>
                  <p className="cuerpo">{obra[c.campo]}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link className="btn btn--principal destacada__cta" href={`/obras/${obra.slug}`}>
            Ver la obra completa
          </Link>
        </Revelar>
      </div>
    </section>
  );
}
