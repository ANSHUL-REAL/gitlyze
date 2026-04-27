"use client";

import * as React from "react";
import { motion } from "motion/react";

interface Review {
  id: number;
  author: string;
  role: string;
  testimonial: string;
  initials: string;
}

const reviews: Review[] = [
  {
    id: 12,
    author: "Riya Sharma",
    role: "Frontend Developer",
    testimonial:
      "Gitlyze caught unused handlers and console logs I missed before pushing. The structured fixes made the cleanup obvious.",
    initials: "RS",
  },
  {
    id: 14,
    author: "Karan Mehta",
    role: "Indie Hacker",
    testimonial:
      "The score was useful, but the real value was seeing risky patterns grouped by file. It helped me prioritize what to fix first.",
    initials: "KM",
  },
  {
    id: 32,
    author: "Maya Iyer",
    role: "CS Student",
    testimonial:
      "I used it on a class project and found ignored files plus missing globals. The report explained why those issues mattered.",
    initials: "MI",
  },
  {
    id: 41,
    author: "Arjun Verma",
    role: "Backend Developer",
    testimonial:
      "It surfaced complexity and missing definitions in a service repo quickly. The report was easier to act on than a raw lint log.",
    initials: "AV",
  },
];

type CardPosition = "front" | "middle" | "back";

export function ReviewStack() {
  const [cards, setCards] = React.useState(reviews);

  const handleShuffle = () => {
    setCards((current) => {
      const [first, ...rest] = current;
      return [...rest, first];
    });
  };

  const positions: CardPosition[] = ["front", "middle", "back", "back"];

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase text-accent">Developer feedback</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-normal text-foreground md:text-6xl">
            Reviews that feel like real code review.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Swipe the front card to cycle through how developers use Gitlyze to catch issues before code reaches production.
          </p>
        </div>

        <div className="relative mx-auto h-[31rem] w-full max-w-[30rem] overflow-visible">
          {cards.map((review, index) => (
            <TestimonialCard
              key={review.id}
              handleShuffle={handleShuffle}
              review={review}
              position={positions[index] ?? "back"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  handleShuffle,
  review,
  position,
}: {
  handleShuffle: () => void;
  review: Review;
  position: CardPosition;
}) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? 2 : position === "middle" ? 1 : 0,
      }}
      animate={{
        rotate: position === "front" ? "-5deg" : position === "middle" ? "0deg" : "5deg",
        x: position === "front" ? "0%" : position === "middle" ? "12%" : "24%",
        scale: position === "front" ? 1 : position === "middle" ? 0.96 : 0.92,
      }}
      drag
      dragElastic={0.25}
      dragListener={isFront}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragStart={(event) => {
        dragRef.current = "clientX" in event ? event.clientX : 0;
      }}
      onDragEnd={(event) => {
        const clientX = "clientX" in event ? event.clientX : 0;
        if (dragRef.current - clientX > 100 || clientX - dragRef.current > 100) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid h-[27rem] w-[20rem] select-none place-content-center gap-5 rounded-3xl border border-accent/20 bg-panel/75 p-6 shadow-[0_0_70px_rgba(45,225,160,0.12)] backdrop-blur-md sm:w-[22rem] ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <div
        aria-label={`Avatar initials for ${review.author}`}
        className="pointer-events-none mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-accent/30 bg-gradient-to-br from-accent/90 via-emerald-400/70 to-background text-2xl font-black text-background shadow-[0_0_34px_rgba(45,225,160,0.18)]"
      >
        {review.initials}
      </div>
      <p className="text-center text-lg font-medium leading-8 text-foreground">
        &quot;{review.testimonial}&quot;
      </p>
      <div className="text-center">
        <p className="text-sm font-bold text-accent">{review.author}</p>
        <p className="mt-1 text-xs text-muted-foreground">{review.role}</p>
      </div>
    </motion.div>
  );
}
