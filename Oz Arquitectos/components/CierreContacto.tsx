import Formulario from "./Formulario";
import Revelar from "./Revelar";
import IconoWhatsApp from "./IconoWhatsApp";
import IconoTelefono from "./IconoTelefono";
import { estudio, linkWhatsApp } from "@/data/estudio";

export default function CierreContacto() {
  const { canales } = estudio;
  return (
    <section className="bloque bloque--claro" id="contacto" aria-labelledby="contacto-t">
      <div className="marco contacto">
        <Revelar className="contacto__texto">
          <p className="eyebrow">Contacto</p>
          <h2 className="t1" id="contacto-t">
            Contanos dónde queda el lote y qué necesitás.
          </h2>
          <p className="bajada">
            Respondemos consultas de Jesús María y alrededores. Si ya tenés plano de mensura,
            medidas o fotos del terreno, mejor: se avanza más rápido.
          </p>

          <div className="contacto__canales">
            <a
              className="btn btn--wa"
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer noopener"
            >
              <IconoWhatsApp size={19} />
              Escribir por WhatsApp
            </a>
            <a className="btn btn--secundario" href={`tel:+${canales.telefonoE164}`}>
              <IconoTelefono />
              {canales.telefonoDisplay}
            </a>
          </div>

          <dl className="contacto__datos">
            <div>
              <dt>Correo</dt>
              <dd>
                <a href={`mailto:${canales.email}`}>{canales.email}</a>
              </dd>
            </div>
            <div>
              <dt>Horario</dt>
              <dd>{canales.horario}</dd>
            </div>
            <div>
              <dt>Estudio</dt>
              <dd>
                {estudio.localidad}, {estudio.provincia}
              </dd>
            </div>
          </dl>
        </Revelar>

        <Revelar className="contacto__form">
          <Formulario />
        </Revelar>
      </div>
    </section>
  );
}
