"use client";

import { useId, useState } from "react";

type Estado = "inicial" | "enviando" | "listo";

/**
 * Formulario de demostración: valida en el navegador y confirma, pero no envía
 * nada. Lo dice en pantalla para que nadie crea que hay una casilla del otro lado.
 */
export default function Formulario() {
  const id = useId();
  const [estado, setEstado] = useState<Estado>("inicial");

  if (estado === "listo") {
    return (
      <div className="form__confirmacion" role="status">
        <p className="t2">Recibimos tu consulta.</p>
        <p className="cuerpo">
          En la web publicada este mensaje llega al correo del estudio. En esta demo el
          envío está simulado: no se guardó ni se mandó nada.
        </p>
        <button type="button" className="btn btn--secundario" onClick={() => setEstado("inicial")}>
          Escribir otra consulta
        </button>
      </div>
    );
  }

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        setEstado("enviando");
        window.setTimeout(() => setEstado("listo"), 550);
      }}
    >
      <div className="form__campo">
        <label htmlFor={`${id}-nombre`}>Nombre</label>
        <input id={`${id}-nombre`} name="nombre" type="text" autoComplete="name" required />
      </div>

      <div className="form__campo">
        <label htmlFor={`${id}-email`}>Correo</label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required />
      </div>

      <div className="form__campo">
        <label htmlFor={`${id}-lugar`}>Dónde queda el proyecto</label>
        <input id={`${id}-lugar`} name="lugar" type="text" placeholder="Localidad o paraje" />
      </div>

      <div className="form__campo">
        <label htmlFor={`${id}-mensaje`}>Contanos qué necesitás</label>
        <textarea id={`${id}-mensaje`} name="mensaje" rows={5} required />
      </div>

      <button type="submit" className="btn btn--principal" disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando…" : "Enviar consulta"}
      </button>

      <p className="form__nota">
        Demo: el formulario valida y confirma, pero no envía el mensaje a ningún lado.
      </p>
    </form>
  );
}
