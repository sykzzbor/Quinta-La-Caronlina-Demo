import Link from "next/link";
import Foto from "./Foto";
import type { Obra } from "@/data/obras";

/**
 * Ficha de obra: foto grande con overlay, metadata arriba y título abajo.
 * El hover levanta la foto y enciende el índice; el enlace cubre toda la caja.
 */
export default function TarjetaObra({
  obra,
  destacada = false,
  sizes = "(min-width: 900px) 33vw, 100vw",
}: {
  obra: Obra;
  destacada?: boolean;
  sizes?: string;
}) {
  return (
    <Link
      href={`/obras/${obra.slug}`}
      className={`obra${destacada ? " obra--grande" : ""}`}
    >
      <div className="obra__foto">
        <Foto imagen={obra.portada} sizes={sizes} className="obra__img" />
        <span className="obra__velo" aria-hidden="true" />
      </div>
      <div className="obra__info">
        <p className="obra__meta">
          <span className="num">{obra.indice}</span>
          <span>{obra.tipo}</span>
          <span className="obra__punto" aria-hidden="true">
            ·
          </span>
          <span>{obra.lugar}</span>
        </p>
        <h3 className={destacada ? "t1" : "t2"}>{obra.titulo}</h3>
        <p className="obra__resumen">{obra.resumen}</p>
        <span className="link">
          Ver la obra <i aria-hidden="true">→</i>
        </span>
      </div>
    </Link>
  );
}
