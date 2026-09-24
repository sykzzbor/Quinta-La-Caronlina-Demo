/**
 * Fuente única de datos del estudio.
 *
 * ESTADO: demo. Los canales de contacto son de muestra, con el prefijo real
 * de Jesús María (3525) para que el sitio se vea completo. Están marcados con
 * `demo: true`: al cargar los datos reales, poner ese flag en false y el aviso
 * del pie desaparece solo.
 */

export const estudio = {
  nombre: "OZ Arquitectos",
  nombreCorto: "OZ",
  localidad: "Jesús María",
  provincia: "Córdoba",
  pais: "Argentina",

  tesis:
    "Estudio de arquitectura en Jesús María. Proyecto, dirección de obra y reformas para el norte de Córdoba.",

  canales: {
    demo: true,
    telefonoDisplay: "+54 9 3525 41-2860",
    telefonoE164: "5493525412860",
    whatsappMensaje:
      "Hola OZ, quería consultar por un proyecto. Les cuento: ",
    email: "estudio@ozarquitectos.com.ar",
    instagramUsuario: "@oz.arquitectos",
    instagramUrl: "https://www.instagram.com/",
    horario: "Lunes a viernes, 9 a 18 h",
  },

  /** Barra de confianza bajo el hero. Datos verificables, no métricas inventadas. */
  respaldo: [
    { titulo: "Proyecto y dirección", detalle: "Del anteproyecto al final de obra" },
    { titulo: "Norte de Córdoba", detalle: "Jesús María, Caroya, Sinsacate y zona" },
    { titulo: "Obra nueva y reforma", detalle: "Vivienda, ampliación y taller" },
    { titulo: "Respuesta en 48 h", detalle: "Consultas por WhatsApp o correo" },
  ],

  proceso: [
    {
      titulo: "Visita al terreno",
      texto:
        "Vamos al lote. Miramos de dónde viene el sol, dónde pega el viento norte y qué árboles conviene dejar en pie.",
    },
    {
      titulo: "Anteproyecto",
      texto:
        "Plantas, cortes y una maqueta de trabajo. Se discute sobre el papel, que es donde los cambios todavía son baratos.",
    },
    {
      titulo: "Documentación y obra",
      texto:
        "Legajo completo para presupuestar y construir, con seguimiento de obra según lo que cada encargo necesite.",
    },
  ],

  servicios: [
    {
      titulo: "Vivienda unifamiliar",
      texto:
        "Casas nuevas pensadas desde la orientación: dónde cae la sombra antes de dónde va cada ambiente.",
    },
    {
      titulo: "Reforma y ampliación",
      texto:
        "Intervenciones sobre lo que ya está construido, sin tirar abajo lo que todavía sirve.",
    },
    {
      titulo: "Espacios de trabajo",
      texto:
        "Talleres, galpones y locales: resolver luz, ventilación y circulación con el presupuesto que hay.",
    },
    {
      titulo: "Dirección técnica",
      texto:
        "Seguimiento de obra, control de avance y decisiones tomadas en el lugar, con el constructor al lado.",
    },
  ],

  verificacion: {
    estado: "demo" as const,
    nota:
      "Obras, textos y fotografías son material de demostración. Reemplazar por proyectos y fotos propias del estudio antes de publicar.",
  },
} as const;

export type Estudio = typeof estudio;

/** Link de WhatsApp con el mensaje ya escrito. */
export function linkWhatsApp(extra = ""): string {
  const texto = encodeURIComponent(estudio.canales.whatsappMensaje + extra);
  return `https://wa.me/${estudio.canales.telefonoE164}?text=${texto}`;
}
