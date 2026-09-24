import Link from "next/link";
import { estudio, linkWhatsApp } from "@/data/estudio";
import { navegacion } from "@/data/navegacion";
import Marca from "./Marca";
import IconoWhatsApp from "./IconoWhatsApp";

export default function Pie() {
  const { canales } = estudio;
  return (
    <footer className="pie">
      <div className="marco pie__grilla">
        <div className="pie__marca">
          <Link href="/" className="marca" aria-label="OZ Arquitectos, inicio">
            <Marca size={44} />
            <span className="marca__texto">
              <span className="marca__nombre">OZ Arquitectos</span>
              <span className="marca__sub">Jesús María · Córdoba</span>
            </span>
          </Link>
          <p className="t2 pie__frase">Proyecto y obra en el norte de Córdoba.</p>
          <a className="btn btn--wa" href={linkWhatsApp()} target="_blank" rel="noreferrer noopener">
            <IconoWhatsApp size={18} />
            Consultar por WhatsApp
          </a>
        </div>

        <nav className="pie__col" aria-label="Pie de página">
          <p className="pie__rotulo">Secciones</p>
          <ul role="list">
            {navegacion.map((e) => (
              <li key={e.href}>
                <Link href={e.href}>{e.texto}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pie__col">
          <p className="pie__rotulo">Contacto</p>
          <ul role="list">
            <li>
              <a href={`tel:+${canales.telefonoE164}`}>{canales.telefonoDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${canales.email}`}>{canales.email}</a>
            </li>
            <li>
              <a href={canales.instagramUrl} target="_blank" rel="noreferrer noopener">
                {canales.instagramUsuario}
              </a>
            </li>
          </ul>
        </div>

        <div className="pie__col">
          <p className="pie__rotulo">Dónde</p>
          <address>
            {estudio.localidad}, {estudio.provincia}
            <br />
            {estudio.pais}
            <br />
            <span className="meta">{canales.horario}</span>
          </address>
        </div>
      </div>

      <div className="marco pie__legal">
        <p>
          Demo comercial. Obras, textos y fotografías son material de muestra.
          {canales.demo ? " Los datos de contacto son de ejemplo." : ""}
        </p>
        <p>
          © {new Date().getFullYear()} {estudio.nombre}
        </p>
      </div>
    </footer>
  );
}
