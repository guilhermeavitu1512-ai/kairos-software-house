"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useRef, type PointerEvent } from "react";
import type { Project } from "@/data/projects";

export default function ProjectVisual({ project, large = false }: { project: Project; large?: boolean }) {
  const visualRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const move = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${(-y * 3.5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(x * 4.5).toFixed(2)}deg`);
  }, []);
  const reset = useCallback((event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }, []);

  return (
    <m.div ref={visualRef} className="project-visual-motion" style={{ y: reduceMotion ? 0 : parallaxY }}>
      <div className={`project-visual project-visual--${project.visual}${large ? " project-visual--large" : ""}`} style={{ "--project-accent": project.accent } as React.CSSProperties} onPointerMove={move} onPointerLeave={reset}>
        <div className="mock-browser">
          <div className="mock-bar"><span /><span /><span /><i>vyne</i></div>
          <div className="commerce-ui">
            <div className="commerce-nav"><b>VYNE</b><span>SELEÇÃO &nbsp; COLEÇÃO &nbsp; SOBRE</span></div>
            <div className="watch-dial"><i /><b>12</b><span>6</span></div>
            <div className="commerce-copy"><strong>Tempo com<br />presença.</strong><span>Explorar coleção →</span></div>
          </div>
        </div>
      </div>
    </m.div>
  );
}
