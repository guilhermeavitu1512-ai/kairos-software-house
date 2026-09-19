"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const move = (event: MouseEvent) => {
      cursorRef.current?.style.setProperty("transform", `translate3d(${event.clientX}px, ${event.clientY}px, 0)`);
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      const nextLabel = target?.dataset.cursor ?? "";
      if (nextLabel !== labelRef.current) {
        labelRef.current = nextLabel;
        setLabel(nextLabel);
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div ref={cursorRef} className={`custom-cursor${label ? " is-active" : ""}`} aria-hidden="true"><span>{label}</span></div>;
}
