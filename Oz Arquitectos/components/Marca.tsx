/**
 * Isologo OZ, tomado del que usa el estudio en sus redes: la O y la Z
 * separadas por una línea vertical, sobre el marrón de la marca.
 */
export default function Marca({ size = 42 }: { size?: number }) {
  return (
    <svg
      className="marca__mono"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="OZ Arquitectos"
    >
      <circle cx="24" cy="24" r="23" fill="var(--verde-2)" stroke="var(--cal)" strokeWidth="1.2" />
      <text
        x="13"
        y="30"
        textAnchor="middle"
        fill="var(--cal)"
        fontFamily="var(--titulo)"
        fontSize="19"
        fontWeight="400"
        letterSpacing="0"
      >
        O
      </text>
      <rect x="23.4" y="13" width="1.2" height="22" fill="var(--cal)" opacity=".85" />
      <text
        x="35"
        y="30"
        textAnchor="middle"
        fill="var(--cal)"
        fontFamily="var(--titulo)"
        fontSize="19"
        fontWeight="400"
      >
        Z
      </text>
    </svg>
  );
}
