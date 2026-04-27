"use client";

import { FooterBoxesEffect } from "@/components/footer-boxes-effect";

export function LiquidFooterEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(45,225,160,0.26),transparent_30rem),radial-gradient(circle_at_18%_70%,rgba(16,185,129,0.16),transparent_24rem),radial-gradient(circle_at_84%_64%,rgba(74,222,128,0.13),transparent_28rem)]" />
      <FooterBoxesEffect />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0,transparent_18rem,rgba(6,11,9,0.42)_36rem),linear-gradient(to_bottom,rgba(6,11,9,0.10),rgba(6,11,9,0.72))]" />
      <div className="absolute left-1/2 top-1/2 h-[32rem] w-[72rem] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-[48%] border border-accent/15 bg-accent/10 blur-2xl" />
      <div className="absolute -left-28 top-20 h-72 w-[46rem] rotate-[-12deg] rounded-[45%] bg-emerald-400/12 blur-3xl" />
      <div className="absolute -right-28 bottom-20 h-80 w-[52rem] rotate-[14deg] rounded-[45%] bg-accent/14 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-background via-background/85 to-transparent" />
    </div>
  );
}
