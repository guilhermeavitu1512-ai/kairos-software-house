"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Hero.module.css";

const Aurora = dynamic(() => import("../Aurora"), { ssr: false });
const colors = ["#3B82F6", "#10B981", "#5227FF"];
class AtmosphereBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?null:this.props.children;}
}

export default function HeroAurora() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection=(navigator as Navigator & {connection?:EventTarget & {saveData?:boolean;effectiveType?:string}}).connection;
    let inView = false;
    const sync = () => setActive(inView && !document.hidden && !reduced.matches && !connection?.saveData && !['2g','slow-2g'].includes(connection?.effectiveType??'') && !document.querySelector("[data-entry-intro]") && !element.closest("[inert]"));
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    intersection.observe(element);
    const intro = new MutationObserver(sync);
    intro.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["inert"] });
    reduced.addEventListener("change", sync);
    connection?.addEventListener("change",sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      intersection.disconnect(); intro.disconnect();
      reduced.removeEventListener("change", sync);
      connection?.removeEventListener("change",sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return <div ref={root} className={styles.aurora} aria-hidden="true" data-hero-aurora>
    {active ? <AtmosphereBoundary><Aurora colorStops={colors} blend={0.5} amplitude={1.0} speed={0.5} /></AtmosphereBoundary> : null}
  </div>;
}
