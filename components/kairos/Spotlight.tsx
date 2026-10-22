"use client";
import { useEffect } from "react";

// Feeds pointer coordinates to any [data-spotlight] element as --mx/--my,
// so cards can paint a light that follows the cursor in CSS.
export default function Spotlight() {
  useEffect(() => {
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0, last: PointerEvent | null = null;
    const paint = () => {
      frame = 0;
      const target = last?.target instanceof Element ? last.target.closest<HTMLElement>("[data-spotlight]") : null;
      if (!target || !last) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${last.clientX - rect.left}px`);
      target.style.setProperty("--my", `${last.clientY - rect.top}px`);
    };
    const move = (event: PointerEvent) => {
      if (!pointer.matches) return;
      last = event;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => { document.removeEventListener("pointermove", move); cancelAnimationFrame(frame); };
  }, []);
  return null;
}
