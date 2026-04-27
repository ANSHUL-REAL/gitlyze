"use client";

export function LiquidFooterEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-90">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(45,225,160,0.18),transparent_34rem),linear-gradient(180deg,transparent,rgba(7,16,13,0.92))]" />
      <div className="absolute -left-24 top-16 h-72 w-[42rem] rotate-[-10deg] rounded-[45%] bg-accent/12 blur-3xl" />
      <div className="absolute -right-28 bottom-24 h-80 w-[48rem] rotate-[12deg] rounded-[45%] bg-emerald-300/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-[48%] border border-accent/10 bg-[linear-gradient(135deg,rgba(45,225,160,0.10),rgba(4,12,10,0.05),rgba(45,225,160,0.08))] blur-sm" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
