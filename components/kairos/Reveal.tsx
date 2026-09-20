"use client";

import { m } from "framer-motion";
import useReducedMotionPreference from "./useReducedMotionPreference";
import type { ReactNode } from "react";
import { MOTION_DURATION, MOTION_EASE } from "./motion";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "default" | "media";
}) {
  const reduceMotion = useReducedMotionPreference();
  const mediaReveal = variant === "media";
  return (
    <m.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: mediaReveal ? 20 : 16, scale: mediaReveal ? 0.975 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0 : mediaReveal ? MOTION_DURATION.text : MOTION_DURATION.entry, delay, ease: MOTION_EASE }}
    >
      {children}
    </m.div>
  );
}
