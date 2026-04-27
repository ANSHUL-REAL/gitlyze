"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __gitlyzeLiquidApp?: {
      dispose?: () => void;
      loadImage?: (url: string) => void;
      setRain?: (enabled: boolean) => void;
      liquidPlane?: {
        material: {
          metalness: number;
          roughness: number;
        };
        uniforms: {
          displacementScale: {
            value: number;
          };
        };
      };
    };
  }
}

export function LiquidFooterEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js';

      const canvas = document.getElementById('gitlyze-liquid-footer');
      if (canvas) {
        const app = LiquidBackground(canvas);
        app.loadImage('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/enhanced_8bfe61b0-d431-433a-8acb-49d508bf88b4-image-vWzKFKS7vQy7s8wfQYzEpaoiYaVMkr.png');
        app.liquidPlane.material.metalness = 0.75;
        app.liquidPlane.material.roughness = 0.25;
        app.liquidPlane.uniforms.displacementScale.value = 4;
        app.setRain(false);
        window.__gitlyzeLiquidApp = app;
      }
    `;

    document.body.appendChild(script);

    return () => {
      window.__gitlyzeLiquidApp?.dispose?.();
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_76%,transparent)]">
      <canvas
        ref={canvasRef}
        id="gitlyze-liquid-footer"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}
