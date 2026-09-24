/**
 * Registro de imágenes. Cada entrada existe en /public/img como
 * `<nombre>-<ancho>.webp` para cada ancho declarado.
 *
 * `ratio` es alto/ancho del original: se usa para reservar la caja y evitar
 * saltos de layout. `alt` describe lo que se ve, no palabras clave.
 *
 * ESTADO: demo. Son fotografías de referencia con licencia Unsplash, elegidas
 * por luz y materialidad. Reemplazar por fotos de obra propias del estudio.
 * Autoría de cada toma en `data/creditos.ts`.
 */

export type Imagen = {
  nombre: string;
  anchos: readonly [number, number, number];
  ratio: number;
  alt: string;
  /** object-position del recorte cuando la caja no respeta el ratio original. */
  foco?: string;
};

const img = (
  nombre: string,
  anchos: readonly [number, number, number],
  ratio: number,
  alt: string,
  foco?: string,
): Imagen => ({ nombre, anchos, ratio, alt, foco });

export const imagenes = {
  muroHaz: img("muro-haz", [600, 1000, 1500], 0.6667,
    "Haz de luz cruzando en diagonal un muro de ladrillo"),
  /** Hero. Dos recortes distintos, no el mismo archivo estirado: el ancho
   *  muestra el muro entero, el alto se acerca a los árboles y su sombra. */
  heroAncho: img("hero-ancho", [1200, 1800, 2600], 0.5625,
    "Muro de piedra clara al sol, con dos árboles y su sombra dura sobre el solado"),
  heroAlto: img("hero-alto", [600, 900, 1200], 0.8667,
    "Muro de piedra clara al sol, con dos árboles y su sombra dura sobre el solado"),

  umbralPortada: img("umbral-portada", [700, 1100, 1600], 1.3333,
    "Puerta de madera en un muro verde oscuro, con la sombra del alero cortando en diagonal", "50% 46%"),
  umbralRamas: img("umbral-ramas", [600, 1000, 1500], 1.4993,
    "Sombra de ramas proyectada sobre un paramento de hormigón visto"),
  umbralRevoque: img("umbral-revoque", [600, 1000, 1500], 1.5405,
    "Revoque grueso con una franja de sol cruzando el muro"),

  patioEncalado: img("patio-encalado", [800, 1300, 1900], 0.6667,
    "Patio visto a través de los arcos encalados de la galería, con el sol pegando en el solado",
    "50% 56%"),
  patioGaleria: img("patio-galeria", [700, 1100, 1600], 0.5571,
    "Galería alta de madera alrededor del patio, con un árbol en el centro"),
  sombraRama: img("sombra-rama", [600, 1000, 1500], 1.3333,
    "Sombra de una rama sobre un paño de revoque claro"),
  revoqueSombra: img("revoque-sombra", [600, 1000, 1500], 1.5,
    "Muro revocado con la sombra del alero marcando una línea horizontal"),

  casaBaja: img("casa-baja", [700, 1100, 1600], 0.6667,
    "Puerta de madera en un muro claro, con la sombra de un árbol proyectada encima",
    "52% 68%"),
  casaBajaPuerta: img("casa-baja-puerta", [600, 1000, 1500], 0.75,
    "La sombra de la puerta recortada sobre el muro, a media mañana"),

  tallerEscalera: img("taller-escalera", [700, 1100, 1600], 1.3317,
    "Escalera de hormigón junto a un muro de ladrillo iluminado desde arriba", "52% 50%"),
  escaleraSombra: img("escalera-sombra", [700, 1100, 1600], 0.7501,
    "Sombra de una escalera exterior recortada sobre un muro blanco"),

  algarroboLuz: img("algarrobo-luz", [800, 1300, 1900], 0.6667,
    "Sombra rayada del postigo sobre un muro claro, con un helecho en el banco",
    "52% 52%"),
  algarroboInterior: img("algarrobo-interior", [800, 1300, 1900], 0.6667,
    "Interior con una planta junto a la ventana y la luz rayada del postigo sobre el muro"),

  galeriaEscalones: img("galeria-escalones", [800, 1300, 1900], 0.6667,
    "Muro claro con vigas de madera salientes y la sombra que proyectan en diagonal",
    "50% 58%"),
  galeriaNorte: img("galeria-norte", [800, 1300, 1900], 0.6667,
    "Encuentro de dos planos claros con una sombra neta en el vértice"),

  monteArbol: img("monte-arbol", [900, 1500, 2200], 0.6667,
    "Un árbol solo en un campo seco, a última hora de la tarde", "50% 56%"),
  monteArboleda: img("monte-arboleda", [800, 1300, 1900], 0.6667,
    "Arboleda de monte bajo sobre pasto seco"),
  sierraSeca: img("sierra-seca", [800, 1300, 1900], 0.6667,
    "Árboles sin hoja sobre una ladera de pasto seco"),

  estudioMesa: img("estudio-mesa", [700, 1100, 1600], 0.5627,
    "Manos dibujando sobre un plano, con el escalímetro apoyado en la mesa",
    "42% 52%"),
} as const;
