import Link from "next/link";
import Revelar from "./Revelar";
import { estudio } from "@/data/estudio";

export default function Servicios() {
  return (
    <section className="bloque bloque--claro" id="servicios" aria-labelledby="servicios-t">
      <div className="marco">
        <div className="seccion-cabeza">
          <div className="seccion-cabeza__texto">
            <p className="eyebrow">Qué hacemos</p>
            <h2 className="t1" id="servicios-t">
              Qué resolvemos
            </h2>
            <p className="bajada">
              Cuatro formas de trabajar, todas con el mismo criterio: primero el sol y la
              sombra, después el resto.
            </p>
          </div>
          <Link className="btn btn--secundario" href="/estudio">
            Conocer el estudio
          </Link>
        </div>

        <ul className="servicios" role="list">
          {estudio.servicios.map((s, i) => (
            <Revelar as="li" key={s.titulo}>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="t2">{s.titulo}</h3>
              <p className="cuerpo">{s.texto}</p>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  );
}
