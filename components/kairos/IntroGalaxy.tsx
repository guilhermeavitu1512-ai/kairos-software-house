"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import useReducedMotionPreference from "./useReducedMotionPreference";

const Galaxy = dynamic(() => import("../Galaxy"), { ssr: false });
const subscribe = (notify: () => void) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
const visible = () => !document.hidden;
const server = () => false;

export default function IntroGalaxy() {
  const reduced = useReducedMotionPreference();
  const active = useSyncExternalStore(subscribe, visible, server);
  if (!active || reduced) return null;
  return <Galaxy mouseRepulsion mouseInteraction density={1.5} glowIntensity={0.5} saturation={0.8} hueShift={240} />;
}
