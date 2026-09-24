import type { CSSProperties } from "react";
import type { Imagen } from "@/data/imagenes";

/**
 * Proporción de la foto como variable CSS, para que la caja la respete en
 * pantallas angostas en vez de recortarla contra un alto fijo.
 */
export function relacion(imagen: Imagen): CSSProperties {
  return { "--rel": (1 / imagen.ratio).toFixed(4) } as CSSProperties;
}

type Props = {
  imagen: Imagen;
  /** Ancho que ocupará la imagen en el layout, para el atributo `sizes`. */
  sizes: string;
  /** Solo para la imagen que abre la página: se carga con prioridad. */
  prioridad?: boolean;
  className?: string;
  /** Sobrescribe el recorte cuando la caja no respeta el ratio original. */
  foco?: string;
};

/**
 * `<img>` con srcset a partir de los tres anchos ya generados en /public/img.
 * Reserva la caja con width/height reales para que no haya salto de layout.
 */
export default function Foto({ imagen, sizes, prioridad = false, className, foco }: Props) {
  const [chico, , grande] = imagen.anchos;
  const alto = Math.round(grande * imagen.ratio);
  const objectPosition = foco ?? imagen.foco;

  return (
    <img
      src={`/img/${imagen.nombre}-${chico}.webp`}
      srcSet={imagen.anchos.map((a) => `/img/${imagen.nombre}-${a}.webp ${a}w`).join(", ")}
      sizes={sizes}
      width={grande}
      height={alto}
      alt={imagen.alt}
      className={className}
      style={objectPosition ? { objectPosition } : undefined}
      loading={prioridad ? "eager" : "lazy"}
      fetchPriority={prioridad ? "high" : "auto"}
      decoding={prioridad ? "sync" : "async"}
    />
  );
}
