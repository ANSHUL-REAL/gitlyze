"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const rows = Array.from({ length: 34 });
const cols = Array.from({ length: 24 });
const glowColors = [
  "rgba(45, 225, 160, 0.32)",
  "rgba(16, 185, 129, 0.26)",
  "rgba(74, 222, 128, 0.24)",
  "rgba(110, 231, 183, 0.22)",
];

function pickColor(row: number, col: number) {
  return glowColors[(row * 7 + col * 3) % glowColors.length];
}

export function FooterBoxesEffect({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-auto absolute left-1/2 top-[54%] z-0 flex -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] skew-x-[-26deg] skew-y-[8deg] scale-[0.78] opacity-60",
        className
      )}
      aria-hidden="true"
    >
      {rows.map((_, rowIndex) => (
        <div key={rowIndex} className="h-8 w-12 border-l border-emerald-200/[0.055]">
          {cols.map((_, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className="relative h-8 w-12 border-r border-t border-emerald-200/[0.055]"
              whileHover={{
                backgroundColor: pickColor(rowIndex, colIndex),
                boxShadow: "0 0 26px rgba(45, 225, 160, 0.20)",
                transition: { duration: 0 },
              }}
              animate={{
                backgroundColor: "rgba(45, 225, 160, 0)",
                boxShadow: "0 0 0 rgba(45, 225, 160, 0)",
                transition: { duration: 1.2, ease: "easeOut" },
              }}
            >
              {rowIndex % 3 === 0 && colIndex % 4 === 0 ? (
                <span className="pointer-events-none absolute -left-2.5 -top-2.5 h-5 w-5 text-emerald-200/[0.075]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              ) : null}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
