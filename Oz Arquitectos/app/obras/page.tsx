import type { Metadata } from "next";
import Link from "next/link";
import TarjetaObra from "@/components/TarjetaObra";
import Revelar from "@/components/Revelar";
import CabezaPagina from "@/components/CabezaPagina";
import { obras } from "@/data/obras";

export const metadata: Metadata = {
  title: "Obras",
  description:
    "Selección de obras del estudio: viviendas, reformas y espacios de trabajo en el norte de Córdoba.",
};

export default function Obras() {
  return (
    <>
      <CabezaPagina
        eyebrow="Obras"
        titulo="Seis trabajos, en el orden en que conviene mirarlos."
        bajada="Viviendas, reformas y espacios de trabajo entre Jesús María y Villa del Totoral. Cada ficha cuenta el encargo, la decisión de proyecto y lo que quedó construido."
      />

      <section className="bloque bloque--claro" aria-labelledby="indice-t">
        <div className="marco">
          <div className="seccion-cabeza">
            <div className="seccion-cabeza__texto">
              <p className="eyebrow">Índice · 01 — 06</p>
              <h2 className="t1" id="indice-t">
                Todas las obras
              </h2>
            </div>
          </div>

          <div className="obras-grilla">
            {obras.map((obra, i) => (
              <Revelar key={obra.slug}>
                <TarjetaObra
                  obra={obra}
                  destacada={i === 0 || i === 3}
                  sizes="(min-width: 1060px) 40vw, (min-width: 700px) 50vw, 100vw"
                />
              </Revelar>
            ))}
          </div>

          <div className="obras-cierre">
            <p className="t2">¿Tenés un lote o una casa para reformar?</p>
            <Link className="btn btn--principal" href="/contacto">
              Pedir presupuesto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
