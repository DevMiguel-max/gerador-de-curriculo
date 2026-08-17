"use client";

import { useEffect, useRef, useState } from "react";

const A4_WIDTH_PX = 794; // 210mm a 96dpi — mesma referência usada em TemplatePage

/**
 * `outerRef` vai no container que define a largura disponível.
 * `innerRef` vai no elemento com o tamanho real (não escalado) do
 * template, para medirmos a altura natural e escalar o wrapper junto.
 */
export function useScaleToFit<T extends HTMLElement>() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<T>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const width = outer.clientWidth;
      const nextScale = width > 0 ? Math.min(1, width / A4_WIDTH_PX) : 1;
      setScale(nextScale);
      setHeight(inner.offsetHeight * nextScale);
    };

    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(outer);
    resizeObserver.observe(inner);
    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { outerRef, innerRef, scale, height };
}
