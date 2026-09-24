import Foto, { relacion } from "./Foto";
import { imagenes } from "@/data/imagenes";

const zona = [
  "Jesús María",
  "Colonia Caroya",
  "Sinsacate",
  "Colonia Vicente Agüero",
  "Villa del Totoral",
];

/** Franja a sangre: la foto del monte y, encima, dónde trabaja el estudio. */
export default function Zona() {
  return (
    <section className="zona" aria-labelledby="zona-t">
      <div className="zona__marco" style={relacion(imagenes.monteArbol)}>
        <Foto imagen={imagenes.monteArbol} sizes="100vw" className="foto-cubre" />
        <span className="zona__velo" aria-hidden="true" />
      </div>
      <div className="marco zona__contenido">
        <p className="eyebrow">Dónde trabajamos</p>
        <h2 className="t1 zona__titulo" id="zona-t">
          El norte de Córdoba, a menos de una hora del estudio.
        </h2>
        <ul className="zona__lista" role="list">
          {zona.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
