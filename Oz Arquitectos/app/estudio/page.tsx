import type { Metadata } from "next";
import Link from "next/link";
import Foto, { relacion } from "@/components/Foto";
import Revelar from "@/components/Revelar";
import CabezaPagina from "@/components/CabezaPagina";
import Proceso from "@/components/Proceso";
import CierreContacto from "@/components/CierreContacto";
import { imagenes } from "@/data/imagenes";
import { estudio } from "@/data/estudio";

export const metadata: Metadata = {
  title: "Estudio",
  description:
    "Cómo trabaja OZ Arquitectos: pocos proyectos a la vez, decisiones tomadas desde el sol y la sombra, y el mismo arquitecto de la primera visita al final de la obra.",
};

export default function Estudio() {
  return (
    <>
      <CabezaPagina
        eyebrow="El estudio"
        titulo="Un estudio chico que proyecta para el clima que tiene enfrente."
        bajada="En el norte de Córdoba el problema no es el frío: es el sol de la tarde y la falta de agua. Un proyecto que ignore eso funciona en los planos y se vuelve incómodo el primer verano."
      />

      <section className="bloque bloque--claro">
        <div className="marco estudio-pag">
          <Revelar className="estudio-pag__texto">
            <p className="eyebrow">Cómo pensamos</p>
            <h2 className="t1">Primero el sol, después la planta.</h2>
            <p className="cuerpo">
              Empezamos siempre por el mismo lado: dónde cae la sombra a las cinco de la
              tarde en enero, qué árboles ya están y conviene no tocar, de qué lado entra el
              viento norte. Recién después aparecen las plantas.
            </p>
            <p className="cuerpo">
              Trabajamos con pocos proyectos a la vez. No es una postura: es la única manera
              de que la persona que dibujó la casa sea la misma que después la mira en obra
              y decide, con el constructor al lado, cómo se resuelve un encuentro que en el
              plano era una línea.
            </p>
            <p className="cuerpo">
              Los materiales son los que se consiguen cerca y los que la gente de la zona
              sabe poner: mampostería, revoque, hormigón, madera, chapa. No hay virtud en
              traer un sistema de otro lado si nadie lo puede reparar en diez años.
            </p>
            <Link className="btn btn--principal estudio-pag__cta" href="/obras">
              Ver las obras
            </Link>
          </Revelar>

          <Revelar className="estudio-pag__lateral">
            <div className="marco-foto" style={relacion(imagenes.monteArboleda)}>
              <Foto
                imagen={imagenes.monteArboleda}
                sizes="(min-width: 960px) 42vw, 100vw"
                className="foto-cubre"
              />
            </div>
            <p className="pie-foto">
              Monte bajo entre Jesús María y Sinsacate. Casi todos los lotes con los que
              trabajamos se parecen a esto antes de empezar.
            </p>

            <h3 className="pie__rotulo estudio-pag__rotulo">Qué hacemos</h3>
            <ul role="list" className="estudio-pag__lista">
              {estudio.servicios.map((s) => (
                <li key={s.titulo}>{s.titulo}</li>
              ))}
            </ul>
          </Revelar>
        </div>
      </section>

      <Proceso />
      <CierreContacto />
    </>
  );
}
