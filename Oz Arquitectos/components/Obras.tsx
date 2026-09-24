import Link from "next/link";
import Revelar from "./Revelar";
import TarjetaObra from "./TarjetaObra";
import { restoDeObras } from "@/data/obras";

export default function Obras() {
  return (
    <section className="bloque bloque--oscuro" id="obras" aria-labelledby="obras-t">
      <div className="marco">
        <div className="seccion-cabeza">
          <div className="seccion-cabeza__texto">
            <p className="eyebrow">Selección de obras</p>
            <h2 className="t1" id="obras-t">
              Obras seleccionadas
            </h2>
            <p className="bajada">
              Viviendas, reformas y espacios de trabajo entre Jesús María y Villa del
              Totoral. Cada ficha cuenta el encargo y la decisión de proyecto.
            </p>
          </div>
          <Link className="btn btn--secundario" href="/obras">
            Ver todas
          </Link>
        </div>

        <div className="obras-grilla">
          {restoDeObras.map((obra, i) => (
            <Revelar key={obra.slug}>
              <TarjetaObra
                obra={obra}
                destacada={i === 0}
                sizes={i === 0 ? "(min-width: 1060px) 50vw, 100vw" : "(min-width: 1060px) 33vw, (min-width: 700px) 50vw, 100vw"}
              />
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
