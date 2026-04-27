"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useScroll, useTransform } from "motion/react";

export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 1] : [1.04, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -80]);

  return (
    <div ref={containerRef} className="relative flex min-h-[44rem] items-center justify-center px-4 py-16 md:min-h-[68rem] md:px-20">
      <div className="relative w-full py-8 md:py-32" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <ScrollCard rotate={rotate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  );
}

function Header({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) {
  return (
    <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
      {titleComponent}
    </motion.div>
  );
}

function ScrollCard({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026",
      }}
      className="mx-auto mt-8 h-auto min-h-[28rem] w-full max-w-5xl rounded-[30px] border border-accent/20 bg-panel/80 p-3 shadow-2xl backdrop-blur md:h-[38rem] md:p-6"
    >
      <div className="h-full w-full overflow-visible rounded-2xl bg-background/80 p-4 md:overflow-auto md:p-5">
        {children}
      </div>
    </motion.div>
  );
}
