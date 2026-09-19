"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import styles from "./Hero.module.css";

const Scene = dynamic(() => import("./HeroOrbitScene"), { ssr: false });
class OrbitBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HeroOrbit() {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!host) return;
    const media = matchMedia("(min-width: 761px) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(media.matches);
    update(); media.addEventListener("change", update);
    let visible = true;
    const visibility = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); });
    observer.observe(host);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); media.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, [host]);
  return <div ref={setHost} className={styles.orbit} aria-hidden="true">
    {enabled && !failed && host && <OrbitBoundary><Scene host={host} active={active} onFailure={() => setFailed(true)} /></OrbitBoundary>}
  </div>;
}
