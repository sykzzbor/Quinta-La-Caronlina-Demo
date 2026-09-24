"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FotoHero from "./FotoHero";
import IconoWhatsApp from "./IconoWhatsApp";
import { estudio, linkWhatsApp } from "@/data/estudio";

export default function Hero() {
  const [listo, setListo] = useState(false);
  const montado = useRef(true);

  useEffect(() => {
    montado.current = true;
    const mostrar = () => montado.current && setListo(true);
    const tope = window.setTimeout(mostrar, 1600);
    document.fonts?.ready.then(mostrar).catch(mostrar) ?? mostrar();
    return () => {
      montado.current = false;
      window.clearTimeout(tope);
    };
  }, []);

  return (
    <section className="hero" data-listo={listo}>
      <FotoHero />
      <div className="hero__velo" aria-hidden="true" />

      <div className="hero__interior">
        <div className="marco">
          <div className="hero__caja">
            <p className="eyebrow">Estudio de arquitectura · {estudio.localidad}</p>
            <h1 className="display">
              Arquitectura para el <em>sol del norte</em> de Córdoba.
            </h1>
            <p className="bajada hero__bajada">
              Proyecto, dirección de obra y reformas en Jesús María y la zona. Pocos encargos
              a la vez, con el mismo arquitecto de la primera visita al final de la obra.
            </p>
            <div className="hero__acciones">
              <a
                className="btn btn--principal"
                href={linkWhatsApp("quiero consultar por ")}
                target="_blank"
                rel="noreferrer noopener"
              >
                <IconoWhatsApp size={19} />
                Consultar mi proyecto
              </a>
              <Link className="btn btn--secundario" href="/obras">
                Ver obras
              </Link>
            </div>
          </div>
        </div>

        <div className="hero__barra">
          <ul className="marco" role="list">
            {estudio.respaldo.map((r) => (
              <li key={r.titulo}>
                <p className="t3">{r.titulo}</p>
                <p className="meta">{r.detalle}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
