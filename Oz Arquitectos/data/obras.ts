/**
 * Selección de obras.
 *
 * ESTADO: demo. Ninguna de estas obras corresponde a un encargo real de
 * OZ Arquitectos: son piezas de muestra para probar la composición del sitio.
 * Los textos describen decisiones de proyecto, no resultados medibles: no hay
 * superficies, años, presupuestos ni nombres de comitentes, porque no hay
 * forma de verificarlos. Al cargar obras reales, mantener ese criterio salvo
 * que el dato esté confirmado.
 *
 * Las localidades sí son reales y pertenecen al norte de Córdoba, en el
 * entorno de Jesús María.
 */

import { imagenes, type Imagen } from "./imagenes";

export type Obra = {
  slug: string;
  /** Número de índice. La selección es una secuencia curada, no un ranking. */
  indice: string;
  titulo: string;
  tipo: string;
  lugar: string;
  /** Una línea para el listado. Dice qué es la obra, no qué se siente. */
  resumen: string;
  /** Situación de partida. */
  encargo: string;
  /** La decisión de proyecto: el movimiento que define la obra. */
  decision: string;
  /** Qué quedó construido, sin exagerar. */
  estado: string;
  portada: Imagen;
  galeria: { imagen: Imagen; pie?: string }[];
  /** Marca la obra que abre la home. Solo una. */
  destacada?: boolean;
};

export const obras: Obra[] = [
  {
    slug: "casa-umbral",
    indice: "01",
    titulo: "Casa umbral",
    tipo: "Vivienda unifamiliar",
    lugar: "Jesús María",
    resumen: "Un lote angosto entre medianeras, resuelto desde la sombra del acceso.",
    encargo:
      "Un terreno de diez metros de frente entre dos medianeras altas. La casa entraba, pero entraba mal: contra el norte no quedaba fondo y contra el sur no entraba sol.",
    decision:
      "Correr el acceso hasta el fondo del lote. Entre la vereda y la puerta hay ahora catorce metros de patio en sombra, con el muro medianero pintado de verde oscuro para que la luz rebote menos y el recorrido baje de temperatura antes de llegar a la casa.",
    estado:
      "Construida en mampostería revocada, con carpinterías de madera y cubierta liviana sobre el patio de acceso.",
    portada: imagenes.umbralPortada,
    galeria: [
      { imagen: imagenes.umbralPortada, pie: "El acceso al fondo del lote, con la sombra del alero cortando el muro." },
      { imagen: imagenes.muroHaz, pie: "El muro medianero de ladrillo, a media tarde." },
      { imagen: imagenes.umbralRamas },
      { imagen: imagenes.umbralRevoque, pie: "Revoque grueso al fratás: la textura se lee cuando el sol pega de costado." },
    ],
    destacada: true,
  },
  {
    slug: "patio-encalado",
    indice: "02",
    titulo: "Patio encalado",
    tipo: "Reforma y puesta en valor",
    lugar: "Colonia Caroya",
    resumen: "Una galería de arcos sin uso, reparada y devuelta al patio.",
    encargo:
      "Una galería de arcos de mampostería encalada, con humedad de cimiento y el patio rellenado con tierra hasta tapar el zócalo original.",
    decision:
      "No cerrarla con carpinterías, que era lo que pedía el presupuesto. Reparar los arcos, rehacer el revoque de cal, bajar el patio a su nivel y volver a plantar el árbol del centro. La galería sigue siendo galería.",
    estado:
      "Arcos consolidados, revoque de cal reparado y solado de ladrillo de campo asentado en arena.",
    portada: imagenes.patioEncalado,
    galeria: [
      { imagen: imagenes.patioEncalado, pie: "Los arcos encalados: el patio vuelve a mirarse desde la sombra." },
      { imagen: imagenes.patioGaleria, pie: "La galería alta, con el árbol otra vez en el eje del patio." },
      { imagen: imagenes.revoqueSombra, pie: "La sombra del alero marca la altura original del zócalo." },
      { imagen: imagenes.sombraRama },
    ],
  },
  {
    slug: "casa-baja",
    indice: "03",
    titulo: "Casa baja",
    tipo: "Vivienda unifamiliar",
    lugar: "Colonia Vicente Agüero",
    resumen: "Una sola planta larga, con el alero como fachada.",
    encargo:
      "Un lote de campo sin árboles al norte y con la mejor vista al oeste, que es también por donde entra el peor sol de la tarde.",
    decision:
      "Estirar la casa en una sola planta y dejar que el alero haga de fachada. Los vanos al oeste son pocos y profundos; la vista se toma desde la galería, no desde el interior.",
    estado:
      "Muros de bloque revocado, cubierta de chapa sobre estructura de madera y un alero continuo de dos metros veinte.",
    portada: imagenes.casaBaja,
    galeria: [
      { imagen: imagenes.casaBaja, pie: "El acceso, bajo el árbol que ya estaba en el frente." },
      { imagen: imagenes.casaBajaPuerta },
    ],
  },
  {
    slug: "taller-guanusacate",
    indice: "04",
    titulo: "Taller Guanusacate",
    tipo: "Espacio de trabajo",
    lugar: "Jesús María",
    resumen: "Un galpón entre medianeras, abierto en el techo en vez de en los muros.",
    encargo:
      "Un galpón de fondo de lote, sin frente propio y con las dos medianeras construidas hasta el límite.",
    decision:
      "Si no hay muro que abrir, se abre el techo. Una lucerna corrida sobre el muro sur baña el ladrillo de luz indirecta durante todo el día, y la escalera se ubicó justo debajo para que el recorrido pase por la parte iluminada.",
    estado:
      "Estructura existente conservada, entrepiso nuevo de hormigón y lucerna corrida orientada al sur.",
    portada: imagenes.tallerEscalera,
    galeria: [
      { imagen: imagenes.tallerEscalera, pie: "La escalera bajo la lucerna: el muro de ladrillo trabaja como reflector." },
      { imagen: imagenes.escaleraSombra },
    ],
  },
  {
    slug: "casa-del-algarrobo",
    indice: "05",
    titulo: "Casa del algarrobo",
    tipo: "Vivienda unifamiliar",
    lugar: "Villa del Totoral",
    resumen: "La casa se corrió para no tocar el árbol que ya estaba.",
    encargo:
      "Un algarrobo grande, casi en el centro del lote, en el lugar donde entraba cómoda la casa.",
    decision:
      "Mover la casa y no el árbol. La planta se quebró en dos alas alrededor de la copa, y el patio que queda entre ambas recibe sombra filtrada buena parte del día.",
    estado:
      "Dos cuerpos de una planta unidos por una galería vidriada, con el algarrobo en el patio interior.",
    portada: imagenes.algarroboLuz,
    galeria: [
      { imagen: imagenes.algarroboLuz, pie: "La sombra del postigo hace de cortina en el ala oeste." },
      { imagen: imagenes.algarroboInterior, pie: "Postigos de madera: la sombra rayada reemplaza a la cortina." },
    ],
  },
  {
    slug: "galeria-norte",
    indice: "06",
    titulo: "Galería norte",
    tipo: "Ampliación",
    lugar: "Sinsacate",
    resumen: "Una galería agregada al norte, calculada para el sol de invierno.",
    encargo:
      "Una casa de los años sesenta con buena orientación desaprovechada: el norte daba a un patio de servicio.",
    decision:
      "Agregar una galería de tres metros de profundidad sobre la cara norte. El alero deja entrar el sol bajo de invierno hasta el fondo de la sala y corta el sol alto de verano en el borde del solado.",
    estado:
      "Estructura independiente de hormigón, apoyada sin tocar la mampostería existente.",
    portada: imagenes.galeriaEscalones,
    galeria: [
      { imagen: imagenes.galeriaEscalones, pie: "Las vigas de la galería y la sombra que marcan sobre el muro en diciembre." },
      { imagen: imagenes.galeriaNorte },
    ],
  },
];

export const obraDestacada = obras.find((o) => o.destacada) ?? obras[0];
export const restoDeObras = obras.filter((o) => o !== obraDestacada);

export function obraPorSlug(slug: string): Obra | undefined {
  return obras.find((o) => o.slug === slug);
}

export function obraSiguiente(slug: string): Obra {
  const i = obras.findIndex((o) => o.slug === slug);
  return obras[(i + 1) % obras.length];
}
