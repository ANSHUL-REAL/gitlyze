"use client";

import React from "react";
import Link from "next/link";
import { NotepadTextDashed } from "lucide-react";
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

export function Footer({
  brandName = "gitlyze",
  brandDescription = "Hybrid code review powered by static analysis and real-world developer knowledge. Built for developers who care about clean, production-ready code.",
  navLinks = [],
  creatorName,
  creatorUrl,
  brandIcon,
  className,
}: FooterProps) {
  return (
    <section className={cn("relative mt-8 w-full overflow-hidden", className)}>
      <footer className="relative mt-20 border-t border-border bg-background">
        <LiquidFooterEffect />
        <div className="relative mx-auto flex min-h-[30rem] max-w-7xl flex-col items-center p-4 py-12 sm:min-h-[35rem] md:min-h-[40rem]">
          <div className="flex w-full flex-col">
            <div className="flex w-full flex-col items-center">
              <div className="flex flex-1 flex-col items-center space-y-3">
                <span className="text-3xl font-bold lowercase text-foreground">{brandName}</span>
                <p className="w-full max-w-sm px-4 text-center font-semibold text-muted-foreground sm:w-96 sm:px-0">
                  {brandDescription}
                </p>
              </div>

              <div className="mb-8 mt-5">
                <SocialIcons />
              </div>

              {navLinks.length > 0 && (
                <div className="flex max-w-full flex-wrap justify-center gap-4 px-4 text-sm font-medium text-muted-foreground">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      className="duration-300 hover:font-semibold hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto flex w-full flex-col items-center justify-center gap-2 px-4 pb-2 text-center md:px-0">
            <p className="text-center text-base text-muted-foreground md:text-left">
              (c) {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            {creatorName && creatorUrl && (
              <nav className="flex justify-center gap-4">
                <Link
                  href={creatorUrl}
                  target="_blank"
                  className="text-base text-muted-foreground transition-colors duration-300 hover:font-medium hover:text-foreground"
                >
                  Crafted by {creatorName}
                </Link>
              </nav>
            )}
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-40 left-1/2 max-w-[95vw] -translate-x-1/2 select-none bg-gradient-to-b from-accent/18 via-accent/8 to-transparent bg-clip-text px-4 text-center font-extrabold leading-none tracking-normal text-transparent md:bottom-32"
          style={{ fontSize: "clamp(3rem, 12vw, 10rem)" }}
        >
          {brandName.toUpperCase()}
        </div>

        <div className="absolute bottom-28 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-3xl border border-accent/20 bg-background/75 p-4 shadow-[0_0_70px_rgba(45,225,160,0.12)] backdrop-blur-md duration-300 hover:border-accent/45 md:bottom-24">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/12 via-panel/90 to-background shadow-[inset_0_0_26px_rgba(45,225,160,0.10)] sm:h-16 sm:w-16 md:h-24 md:w-24">
            {brandIcon || (
              <NotepadTextDashed className="h-8 w-8 text-accent drop-shadow-lg sm:h-10 sm:w-10 md:h-14 md:w-14" />
            )}
          </div>
        </div>

        <div className="absolute bottom-36 left-1/2 h-1 w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent backdrop-blur-sm" />
        <div className="absolute bottom-32 h-24 w-full bg-gradient-to-t from-background via-background/80 to-background/40 blur-[1em]" />
      </footer>
    </section>
  );
}
