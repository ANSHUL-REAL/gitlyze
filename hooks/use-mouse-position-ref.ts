"use client";

import { RefObject, useEffect, useRef } from "react";

export function useMousePositionRef(containerRef: RefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updatePosition = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      positionRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const leave = () => {
      positionRef.current = { x: -1000, y: -1000 };
    };

    container.addEventListener("pointermove", updatePosition);
    container.addEventListener("pointerleave", leave);

    return () => {
      container.removeEventListener("pointermove", updatePosition);
      container.removeEventListener("pointerleave", leave);
    };
  }, [containerRef]);

  return positionRef;
}
