"use client";

import React, { CSSProperties, forwardRef, useMemo, useRef } from "react";
import {
  motion,
  MotionValue,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useMousePositionRef } from "@/hooks/use-mouse-position-ref";

type CSSPropertiesWithValues = {
  [K in keyof CSSProperties]: string | number;
};

interface StyleValue<T extends keyof CSSPropertiesWithValues> {
  from: CSSPropertiesWithValues[T];
  to: CSSPropertiesWithValues[T];
}

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  styles: Partial<{
    [K in keyof CSSPropertiesWithValues]: StyleValue<K>;
  }>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
}

function AnimatedLetter({
  letter,
  index,
  proximity,
  styles,
  setRef,
}: {
  letter: string;
  index: number;
  proximity: MotionValue<number>;
  styles: TextProps["styles"];
  setRef: (index: number, element: HTMLSpanElement | null) => void;
}) {
  const transformedStyles = Object.entries(styles).reduce(
    (acc, [key, value]) => {
      if (!value) return acc;
      acc[key] = useTransform(proximity, [0, 1], [value.from, value.to]);
      return acc;
    },
    {} as Record<string, MotionValue<string | number | undefined>>,
  );

  return (
    <motion.span
      ref={(element) => setRef(index, element)}
      className="inline-block"
      aria-hidden="true"
      style={transformedStyles}
    >
      {letter}
    </motion.span>
  );
}

const TextCursorProximity = forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      label,
      styles,
      containerRef,
      radius = 80,
      falloff = "linear",
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const mousePositionRef = useMousePositionRef(containerRef);
    const lettersOnly = useMemo(() => label.replace(/\s/g, "").length, [label]);
    const letterProximities = useRef(
      Array(lettersOnly)
        .fill(0)
        .map(() => useMotionValue(0)),
    );

    if (letterProximities.current.length !== lettersOnly) {
      letterProximities.current = Array(lettersOnly)
        .fill(0)
        .map(() => useMotionValue(0));
    }

    const calculateFalloff = (distance: number): number => {
      const normalizedDistance = Math.min(Math.max(1 - distance / radius, 0), 1);

      switch (falloff) {
        case "exponential":
          return Math.pow(normalizedDistance, 2);
        case "gaussian":
          return Math.exp(-Math.pow(distance / (radius / 2), 2) / 2);
        case "linear":
        default:
          return normalizedDistance;
      }
    };

    useAnimationFrame(() => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return;

        const rect = letterRef.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
        const letterCenterY = rect.top + rect.height / 2 - containerRect.top;
        const distance = Math.hypot(
          mousePositionRef.current.x - letterCenterX,
          mousePositionRef.current.y - letterCenterY,
        );

        letterProximities.current[index]?.set(calculateFalloff(distance));
      });
    });

    const words = label.split(" ");
    let letterIndex = 0;

    return (
      <span ref={ref} className={className} onClick={onClick} {...props}>
        {words.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {word.split("").map((letter) => {
              const currentLetterIndex = letterIndex++;
              return (
                <AnimatedLetter
                  key={`${letter}-${currentLetterIndex}`}
                  letter={letter}
                  index={currentLetterIndex}
                  proximity={letterProximities.current[currentLetterIndex]}
                  styles={styles}
                  setRef={(index, element) => {
                    letterRefs.current[index] = element;
                  }}
                />
              );
            })}
            {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
        <span className="sr-only">{label}</span>
      </span>
    );
  },
);

TextCursorProximity.displayName = "TextCursorProximity";
export default TextCursorProximity;
