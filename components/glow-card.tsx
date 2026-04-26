"use client";

import React, { CSSProperties, ReactNode, PointerEvent, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

type GlowStyle = CSSProperties & {
  "--base": number;
  "--spread": number;
  "--radius": string;
  "--border": string;
  "--backdrop": string;
  "--backup-border": string;
  "--size": string;
  "--outer": string;
  "--border-size": string;
  "--spotlight-size": string;
  "--hue": string;
};

export function GlowCard({
  children,
  className = "",
  glowColor = "green",
  size = "md",
  width,
  height,
  customSize = false,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const syncPointer = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xp = x / rect.width;
    const yp = y / rect.height;

    card.style.setProperty("--x", x.toFixed(2));
    card.style.setProperty("--xp", xp.toFixed(3));
    card.style.setProperty("--y", y.toFixed(2));
    card.style.setProperty("--yp", yp.toFixed(3));
  };

  const { base, spread } = glowColorMap[glowColor];
  const inlineStyles: GlowStyle = {
    "--base": base,
    "--spread": spread,
    "--radius": "18",
    "--border": "2",
    "--backdrop": "hsl(155 18% 12% / 0.72)",
    "--backup-border": "hsl(155 16% 24% / 0.8)",
    "--size": "220",
    "--outer": "1",
    "--border-size": "calc(var(--border, 2) * 1px)",
    "--spotlight-size": "calc(var(--size, 150) * 1px)",
    "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 155) 100% 70% / 0.12), transparent
    )`,
    backgroundColor: "var(--backdrop)",
    backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
    backgroundPosition: "50% 50%",
    border: "var(--border-size) solid var(--backup-border)",
    position: "relative",
    touchAction: "none",
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <>
      <style>{`
        [data-glow-card]::before,
        [data-glow-card]::after {
          pointer-events: none;
          content: "";
          position: absolute;
          inset: calc(var(--border-size) * -1);
          border: var(--border-size) solid transparent;
          border-radius: calc(var(--radius) * 1px);
          background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
          background-repeat: no-repeat;
          background-position: 50% 50%;
          mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
          mask-clip: padding-box, border-box;
          mask-composite: intersect;
        }
        [data-glow-card]::before {
          background-image: radial-gradient(
            calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            hsl(var(--hue, 155) 100% 55% / 0.85), transparent 100%
          );
          filter: brightness(1.5);
        }
        [data-glow-card]::after {
          background-image: radial-gradient(
            calc(var(--spotlight-size) * 0.45) calc(var(--spotlight-size) * 0.45) at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            hsl(0 0% 100% / 0.8), transparent 100%
          );
        }
        [data-glow-card] > [data-glow-card-inner] {
          position: absolute;
          inset: 0;
          opacity: var(--outer, 1);
          border-radius: calc(var(--radius) * 1px);
          filter: blur(calc(var(--border-size) * 10));
          pointer-events: none;
        }
      `}</style>
      <div
        ref={cardRef}
        data-glow-card
        style={inlineStyles}
        onPointerMove={syncPointer}
        className={cn(
          !customSize && sizeMap[size],
          !customSize && "aspect-[3/4]",
          "relative overflow-hidden rounded-2xl p-4 shadow-[0_1rem_2rem_-1rem_black] backdrop-blur-[5px] transition-[border-color,background-color,box-shadow] duration-200",
          className,
        )}
      >
        <div data-glow-card-inner />
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
}
