"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navegacion } from "@/data/navegacion";
import { estudio, linkWhatsApp } from "@/data/estudio";
import Marca from "./Marca";
import IconoWhatsApp from "./IconoWhatsApp";
import IconoTelefono from "./IconoTelefono";

export default function Encabezado() {
  const ruta = usePathname();
  const [solida, setSolida] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const disparador = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const alScrollear = () => setSolida(window.scrollY > 40);
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-abierto", abierto);
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        disparador.current?.focus();
      }
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierto]);

  const esActual = (href: string) => ruta === href || ruta.startsWith(`${href}/`);

  return (
    <>
      <header className={`cabecera${solida || abierto ? " cabecera--solida" : ""}`}>
        <div className="marco cabecera__fila">
          <Link href="/" className="marca" aria-label="OZ Arquitectos, inicio">
            <Marca />
            <span className="marca__texto">
              <span className="marca__nombre">OZ Arquitectos</span>
              <span className="marca__sub">Jesús María · Córdoba</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Principal">
            {navegacion.map((e) => (
              <Link key={e.href} href={e.href} aria-current={esActual(e.href) ? "page" : undefined}>
                {e.texto}
              </Link>
            ))}
          </nav>

          <div className="cabecera__acciones">
            <a className="tel-header" href={`tel:+${estudio.canales.telefonoE164}`}>
              <IconoTelefono />
              {estudio.canales.telefonoDisplay}
            </a>
            <Link className="btn btn--principal" href="/contacto">
              <span>Pedir presupuesto</span>
            </Link>
            <button
              type="button"
              ref={disparador}
              className="boton-menu"
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setAbierto((v) => !v)}
            >
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div id="menu-movil" className="menu" data-abierto={abierto} inert={!abierto || undefined}>
        <nav aria-label="Principal, versión móvil">
          <ul>
            {navegacion.map((e, i) => (
              <li key={e.href}>
                <Link
                  href={e.href}
                  aria-current={esActual(e.href) ? "page" : undefined}
                  onClick={() => setAbierto(false)}
                >
                  {e.texto}
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu__pie">
          <a className="btn btn--wa" href={linkWhatsApp()} target="_blank" rel="noreferrer noopener">
            <IconoWhatsApp size={18} />
            Consultar por WhatsApp
          </a>
          <a className="btn btn--secundario" href={`tel:+${estudio.canales.telefonoE164}`}>
            <IconoTelefono />
            {estudio.canales.telefonoDisplay}
          </a>
        </div>
      </div>
    </>
  );
}
