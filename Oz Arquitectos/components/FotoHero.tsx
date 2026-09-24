import { imagenes } from "@/data/imagenes";

const { heroAncho, heroAlto } = imagenes;

const srcSet = (i: typeof heroAncho) =>
  i.anchos.map((a) => `/img/${i.nombre}-${a}.webp ${a}w`).join(", ");

/** El hero se recorta distinto según la pantalla: dirección de arte, no object-fit. */
export default function FotoHero() {
  const [, medio, grande] = heroAncho.anchos;
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={srcSet(heroAncho)} sizes="100vw" />
      <source srcSet={srcSet(heroAlto)} sizes="100vw" />
      <img
        className="hero__foto"
        src={`/img/${heroAncho.nombre}-${medio}.webp`}
        width={grande}
        height={Math.round(grande * heroAncho.ratio)}
        alt={heroAncho.alt}
        fetchPriority="high"
        decoding="sync"
      />
    </picture>
  );
}
