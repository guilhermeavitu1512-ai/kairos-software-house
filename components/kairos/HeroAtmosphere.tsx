"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useId, useRef } from "react";
import styles from "./Hero.module.css";
import useReducedMotionPreference from "./useReducedMotionPreference";

export default function HeroAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const still = useReducedMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 0]);
  const opacity = useTransform(scrollYProgress, [0, .2, .85, 1], [1, 1, 0, 0]);
  return <div ref={ref} className={styles.atmosphere} aria-hidden="true">
    <m.div className={styles.curves} style={{ opacity: still ? 1 : opacity, x: still ? 0 : x, y: still ? 0 : y, rotate: still ? 0 : rotate }}>
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8d9aad" stopOpacity="0" />
            <stop offset=".48" stopColor="#8d9aad" stopOpacity=".32" />
            <stop offset=".7" stopColor="#2797ff" stopOpacity=".6" />
            <stop offset="1" stopColor="#126bff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M1280 720 C760 970 460 240 970 -120" fill="none" stroke={"url(#" + id + ")"} strokeWidth="3" />
        <path d="M1250 760 C895 905 690 540 740 320" fill="none" stroke="#126bff" strokeOpacity=".15" strokeWidth="1" />
      </svg>
    </m.div>
  </div>;
}
