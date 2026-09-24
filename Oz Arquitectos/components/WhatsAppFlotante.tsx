import { linkWhatsApp } from "@/data/estudio";
import IconoWhatsApp from "./IconoWhatsApp";

export default function WhatsAppFlotante() {
  return (
    <a
      className="wa-flotante"
      href={linkWhatsApp()}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Consultar por WhatsApp"
    >
      <IconoWhatsApp size={24} />
      <span>Consultar</span>
    </a>
  );
}
