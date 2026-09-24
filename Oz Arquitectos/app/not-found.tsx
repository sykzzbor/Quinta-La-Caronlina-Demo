import Link from "next/link";
import CabezaPagina from "@/components/CabezaPagina";

export default function NoEncontrada() {
  return (
    <>
      <CabezaPagina
        eyebrow="Error 404"
        titulo="Esta página no existe."
        bajada="Puede que el enlace esté viejo o mal escrito. Desde el índice de obras se llega a todo lo demás."
      />
      <section className="bloque bloque--claro">
        <div className="marco">
          <Link className="btn btn--principal" href="/obras">
            Ir al índice de obras
          </Link>
        </div>
      </section>
    </>
  );
}
