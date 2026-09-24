import type { Metadata } from "next";
import CabezaPagina from "@/components/CabezaPagina";
import CierreContacto from "@/components/CierreContacto";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escribinos para empezar un proyecto en Jesús María y alrededores: contanos dónde queda el lote y qué necesitás.",
};

export default function ContactoPagina() {
  return (
    <>
      <CabezaPagina
        eyebrow="Contacto"
        titulo="Empecemos por el terreno."
        bajada="Respondemos consultas de Jesús María y alrededores. Si ya tenés plano de mensura, medidas o fotos del lote, se avanza más rápido."
      />
      <CierreContacto />
    </>
  );
}
