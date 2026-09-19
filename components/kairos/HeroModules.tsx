"use client";
import { m, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import useReducedMotionPreference from "./useReducedMotionPreference";
import styles from "./Hero.module.css";

function Module({ index, progress, still }: { index: number; progress: MotionValue<number>; still: boolean }) {
  const x = useTransform(progress, [0, .7], [[-28, 24, -15, 32][index], 0]);
  const turn = useTransform(progress, [0, .7], [[-6, 5, -3, 7][index], 0]);
  return <m.g style={{ x: still ? 0 : x, rotate: still ? 0 : turn, transformOrigin: "250px 250px" }}>
    <rect x="90" y={80 + index * 88} width="320" height="68" rx="6" fill={index === 2 ? "#102742" : "#0b1625"} stroke={index === 2 ? "#3978b5" : "#455567"} />
    <rect x="110" y={102 + index * 88} width="24" height="24" rx="3" fill={index === 2 ? "#2797ff" : "#8291a3"} />
    <path d={`M155 ${108 + index * 88}h145 M155 ${122 + index * 88}h90`} stroke="#8291a3" strokeWidth="3" strokeLinecap="round" />
  </m.g>;
}
export default function HeroModules() {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  return <div ref={ref} className={styles.modules} aria-hidden="true"><svg viewBox="0 0 500 500" fill="none">
    <path d="M250 60v380" stroke="#455567" strokeWidth="1" />
    {[0, 1, 2, 3].map(index => <Module key={index} index={index} progress={scrollYProgress} still={still} />)}
  </svg></div>;
}
