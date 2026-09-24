"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; as?: "div" | "li" | "article" };

/** Revelado corto al entrar en pantalla, una sola vez. El caso de movimiento
 *  reducido lo resuelve el CSS, que deja todo visible desde el principio. */
export default function Revelar({ children, className = "", as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || visible) return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    obs.observe(nodo);
    return () => obs.disconnect();
  }, [visible]);

  return (
    <Tag ref={ref as never} className={`revelar ${className}`.trim()} data-visible={visible || undefined}>
      {children}
    </Tag>
  );
}
