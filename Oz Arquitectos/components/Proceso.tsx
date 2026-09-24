import Revelar from "./Revelar";
import Foto, { relacion } from "./Foto";
import { estudio } from "@/data/estudio";
import { imagenes } from "@/data/imagenes";

export default function Proceso() {
  return (
    <section className="bloque bloque--oscuro" id="proceso" aria-labelledby="proceso-t">
      <div className="marco proceso">
        <Revelar className="proceso__texto">
          <p className="eyebrow">Cómo trabajamos</p>
          <h2 className="t1" id="proceso-t">
            Tres etapas, sin sorpresas en el medio.
          </h2>
          <p className="bajada">
            Todo proyecto empieza en el terreno y termina en obra. En cada etapa sabés qué
            se entrega y qué falta.
          </p>
          <div className="proceso__foto">
            <div className="marco-foto" style={relacion(imagenes.estudioMesa)}>
              <Foto imagen={imagenes.estudioMesa} sizes="(min-width: 900px) 40vw, 100vw" className="foto-cubre" />
            </div>
          </div>
        </Revelar>

        <ol className="pasos" role="list">
          {estudio.proceso.map((paso, i) => (
            <Revelar as="li" key={paso.titulo}>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="t2">{paso.titulo}</h3>
                <p className="cuerpo">{paso.texto}</p>
              </div>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  );
}
