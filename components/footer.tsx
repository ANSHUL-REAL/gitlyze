"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowUp, Github, Linkedin, Mail, NotepadTextDashed } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { LiquidFooterEffect } from "@/components/liquid-footer-effect";
import { SocialIcons } from "@/components/social-icons";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

const footerStyles = `
@keyframes gitlyze-footer-breathe {
  0% { transform: translate(-50%, -50%) scale(0.96); opacity: 0.52; }
  100% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.95; }
}

@keyframes gitlyze-footer-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.gitlyze-footer-shell {
  -webkit-font-smoothing: antialiased;
}

.gitlyze-footer-aurora {
  animation: gitlyze-footer-breathe 8s ease-in-out infinite alternate;
}

.gitlyze-footer-marquee {
  animation: gitlyze-footer-marquee 36s linear infinite;
}

.gitlyze-footer-pill {
  background: linear-gradient(145deg, rgba(45, 225, 160, 0.10), rgba(6, 11, 9, 0.78));
  border: 1px solid rgba(45, 225, 160, 0.18);
  box-shadow:
    0 18px 50px -24px rgba(45, 225, 160, 0.55),
    inset 0 1px 1px rgba(255, 255, 255, 0.08),
    inset 0 -1px 2px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition: border-color 300ms ease, background 300ms ease, color 300ms ease, transform 300ms ease;
}

.gitlyze-footer-pill:hover {
  border-color: rgba(45, 225, 160, 0.42);
  background: linear-gradient(145deg, rgba(45, 225, 160, 0.16), rgba(6, 11, 9, 0.88));
  color: hsl(var(--foreground));
}

.gitlyze-footer-giant {
  font-size: clamp(6rem, 24vw, 22rem);
  line-height: 0.75;
  font-weight: 950;
  letter-spacing: -0.06em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(45, 225, 160, 0.10);
  background: linear-gradient(180deg, rgba(45, 225, 160, 0.18), rgba(45, 225, 160, 0.02) 58%, transparent);
  -webkit-background-clip: text;
  background-clip: text;
}

.gitlyze-footer-title {
  background: linear-gradient(180deg, hsl(var(--foreground)) 0%, rgba(45, 225, 160, 0.55) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 24px rgba(45, 225, 160, 0.18));
}
`;

const marqueeItems = [
  "Static analysis",
  "Real repository scans",
  "Structured findings",
  "Quality scoring",
  "Best-practice references",
  "Production-ready code",
];

function MarqueeRow() {
  return (
    <div className="flex items-center gap-10 px-5">
      {marqueeItems.map((item) => (
        <React.Fragment key={item}>
          <span>{item}</span>
          <span className="text-accent/60">+</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function MagneticPill({
  href,
  children,
  onClick,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const classes = cn(
    "gitlyze-footer-pill inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-bold text-muted-foreground",
    className
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className={classes}
        whileHover={{ y: -4, scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={classes}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

export function Footer({
  brandName = "gitlyze",
  brandDescription = "Hybrid code review powered by static analysis and real-world developer knowledge. Built for developers who care about clean, production-ready code.",
  navLinks = [],
  creatorName,
  creatorUrl,
  brandIcon,
  className,
}: FooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end end"],
  });
  const giantY = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const giantScale = useTransform(scrollYProgress, [0, 1], [0.84, 1]);
  const contentY = useTransform(scrollYProgress, [0.15, 1], [70, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      ref={wrapperRef}
      className={cn("relative h-screen w-full overflow-hidden", className)}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: footerStyles }} />
      <footer className="gitlyze-footer-shell fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden border-t border-border bg-background text-foreground">
        <LiquidFooterEffect />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[64vh] w-[84vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(circle,rgba(45,225,160,0.18),rgba(16,185,129,0.12)_42%,transparent_70%)] blur-[82px] gitlyze-footer-aurora" />

        <motion.div
          style={{ y: giantY, scale: giantScale }}
          className="gitlyze-footer-giant pointer-events-none absolute -bottom-[2vh] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap"
        >
          {brandName.toUpperCase()}
        </motion.div>

        <div className="absolute left-0 top-12 z-10 w-full -rotate-2 scale-110 overflow-hidden border-y border-accent/15 bg-background/55 py-4 shadow-2xl backdrop-blur-md">
          <div className="gitlyze-footer-marquee flex w-max text-xs font-black uppercase tracking-[0.28em] text-muted-foreground md:text-sm">
            <MarqueeRow />
            <MarqueeRow />
          </div>
        </div>

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-20 mx-auto mt-20 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 text-center"
        >
          <div className="mb-8 flex items-center justify-center rounded-3xl border border-accent/20 bg-background/72 p-4 shadow-[0_0_80px_rgba(45,225,160,0.14)] backdrop-blur-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/12 via-panel/90 to-background shadow-[inset_0_0_26px_rgba(45,225,160,0.10)] md:h-20 md:w-20">
              {brandIcon || <NotepadTextDashed className="h-10 w-10 text-accent" />}
            </div>
          </div>

          <p className="text-sm font-black uppercase tracking-[0.35em] text-accent">Ready when you are</p>
          <h2 className="gitlyze-footer-title mt-4 max-w-4xl text-5xl font-black tracking-normal md:text-8xl">
            Review better code.
          </h2>
          <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-muted-foreground md:text-lg">
            {brandDescription}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <MagneticPill href="https://github.com/ANSHUL-REAL">
              <Github className="size-4" />
              GitHub
            </MagneticPill>
            <MagneticPill href="https://www.linkedin.com/in/anshul-nautiyal-42760236b/">
              <Linkedin className="size-4" />
              LinkedIn
            </MagneticPill>
            <MagneticPill href="mailto:anshulnautiyal51@gmail.com">
              <Mail className="size-4" />
              Email
            </MagneticPill>
          </div>

          <div className="mt-5">
            <SocialIcons />
          </div>

          {navLinks.length > 0 && (
            <div className="mt-6 flex max-w-full flex-wrap justify-center gap-4 px-4 text-sm font-bold text-muted-foreground">
              {navLinks.map((link) => (
                <Link key={link.label} className="transition hover:text-foreground" href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        <div className="relative z-30 flex w-full flex-col items-center justify-between gap-5 px-6 pb-8 text-center md:flex-row md:px-12">
          <p className="order-2 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground md:order-1">
            (c) {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>

          <div className="gitlyze-footer-pill order-1 rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground md:order-2">
            {creatorName && creatorUrl ? (
              <Link href={creatorUrl} target="_blank" className="transition hover:text-foreground">
                Built by {creatorName}
              </Link>
            ) : (
              <span>Built by ANSHUL-REAL</span>
            )}
          </div>

          <MagneticPill onClick={scrollToTop} className="order-3 h-12 w-12 px-0" aria-label="Back to top">
            <ArrowUp className="size-5" />
          </MagneticPill>
        </div>
      </footer>
    </section>
  );
}
