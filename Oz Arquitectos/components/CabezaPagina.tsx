/** Cabecera de página interna: bloque oscuro corto, bajo la cabecera fija. */
export default function CabezaPagina({
  eyebrow,
  titulo,
  bajada,
}: {
  eyebrow: string;
  titulo: string;
  bajada?: string;
}) {
  return (
    <section className="cabeza-pagina">
      <div className="marco">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="t1 cabeza-pagina__titulo">{titulo}</h1>
        {bajada && <p className="bajada cabeza-pagina__bajada">{bajada}</p>}
      </div>
    </section>
  );
}
