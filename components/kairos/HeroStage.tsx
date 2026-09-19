"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { createHeroEntrance } from "./hero-entrance";
import styles from "./Hero.module.css";

export default function HeroStage({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = root.current;
    if (!stage) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 761px)");
    let entered = false, inView = false, frame = 0;
    let entrance: gsap.core.Timeline | undefined;
    let entranceFrame = 0, entranceTime = 0, previousEntranceTime = 0, entranceRate = 1;
    const tickEntrance = (now: number) => {
      entranceFrame = 0;
      if (!entrance || document.hidden) return;
      entranceTime += (now - previousEntranceTime) / 1000 * entranceRate;
      previousEntranceTime = now;
      // Use elapsed time locally: GSAP's global lag smoothing must not stretch
      // this short reveal when the existing WebGL backgrounds occupy a slow frame.
      entrance.totalTime(Math.min(entrance.duration(), entranceTime));
      if (entrance.progress() < 1) entranceFrame = requestAnimationFrame(tickEntrance);
    };
    const plates = Array.from(stage.querySelectorAll<HTMLElement>("[data-hero-parallax]"));
    const ctx = gsap.context(() => {}, stage);
    const mobile = matchMedia("(max-width: 760px)");
    let scrollFrame = 0;
    let stageTop = 0, stageHeight = 1, stageWidth = 0;
    let entranceReduced = motion.matches;
    const layers = Array.from(stage.querySelectorAll<HTMLElement>("[data-depth]")).map(el => ({
      factor: Number(el.dataset.depth),
      setY: gsap.quickSetter(el, "y", "px"),
      setX: gsap.quickSetter(el, "x", "px"),
      element: el,
    }));
    const renderScroll = () => {
      scrollFrame = 0;
      if (document.hidden) return;
      const distance = Math.max(0, Math.min(stageHeight, scrollY - stageTop));
      const intensity = mobile.matches ? .24 : 1;
      layers.forEach(layer => {
        layer.setY(motion.matches?0:distance*layer.factor*intensity);
        layer.setX(0);
      });
    };
    const scheduleScroll = () => {
      if (!scrollFrame && !document.hidden) scrollFrame = requestAnimationFrame(renderScroll);
    };
    const measure = () => {
      const rect = stage.getBoundingClientRect();
      // A responsive reflow during reveal must never leave a stale row mask.
      if (entered && stageWidth && Math.abs(rect.width - stageWidth) > 1 && entrance && entrance.progress() < 1) entrance.progress(1);
      stageTop = rect.top + scrollY;
      stageHeight = rect.height;
      stageWidth = rect.width;
      scheduleScroll();
    };
    const followers = plates.map(() => ({ x: null as ReturnType<typeof gsap.quickTo> | null, y: null as ReturnType<typeof gsap.quickTo> | null }));
    ctx.add(() => {
      plates.forEach((plate, i) => {
        followers[i].x = gsap.quickTo(plate, "x", { duration: .65, ease: "power2.out" });
        followers[i].y = gsap.quickTo(plate, "y", { duration: .65, ease: "power2.out" });
      });
    });
    const sync = () => {
      const intro = document.querySelector("[data-entry-intro]");
      const blocked = Boolean(intro || stage.closest("[inert]"));
      const revealBlocked = blocked && !intro?.hasAttribute("data-hero-overlap");
      const active = !blocked && inView && !document.hidden && !motion.matches;
      stage.dataset.active = String(active);
      if (entrance && motion.matches !== entranceReduced) {
        entranceReduced = motion.matches;
        if (entered) entrance.progress(1);
        else { entrance.revert(); entrance = undefined; }
      }
      if (blocked && !entrance && !entered) ctx.add(() => {
        entrance = createHeroEntrance(stage, motion.matches, mobile.matches);
      });
      if (!revealBlocked && inView && !document.hidden && !entered) {
        entered = true;
        stage.dataset.heroReady = "true";
        // No intro / failed JS overlay: keep the already visible HTML as-is.
        if (entrance) {
          // Re-measure final font wrapping at release. Revert + prepare happen
          // synchronously, so the browser cannot paint the unmasked intermediate state.
          entrance.revert();
          ctx.add(() => { entrance = createHeroEntrance(stage, motion.matches, mobile.matches); });
          stage.dataset.heroEntrance = "running";
          entranceTime = 0;
          entranceRate = 1;
        }
        else stage.dataset.heroEntrance = "complete";
      }
      if (entered && entrance && entrance.progress() < 1) {
        if (document.hidden || revealBlocked) { cancelAnimationFrame(entranceFrame); entranceFrame = 0; }
        else if (!entranceFrame) { previousEntranceTime = performance.now(); entranceFrame = requestAnimationFrame(tickEntrance); }
      }
      if (!active || !pointer.matches) followers.forEach(f => { f.x?.(0); f.y?.(0); });
      if (motion.matches) renderScroll();
      else scheduleScroll();
    };
    const move = (event: PointerEvent) => {
      if (stage.dataset.active !== "true" || !pointer.matches) return;
      // Viewport-normalized input: no layout read or new tween per pointer event.
      const x = (event.clientX / innerWidth - .5) * 8;
      const y = (event.clientY / innerHeight - .5) * 6;
      followers.forEach((f, i) => { f.x?.(x * (i ? -1 : 1)); f.y?.(y * (i ? -.7 : 1)); });
    };
    const leave = () => followers.forEach(f => { f.x?.(0); f.y?.(0); });
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["inert", "data-hero-overlap"] });
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    intersection.observe(stage);
    const resize = new ResizeObserver(measure);
    resize.observe(stage);
    measure();
    window.addEventListener("scroll", scheduleScroll, { passive: true });
    const finishOnScroll = () => {
      if (entered && scrollY > stageTop + 2 && entrance && entrance.progress() < 1 && entranceRate === 1) {
        entranceRate = Math.max(1, (entrance.duration() - entranceTime) / .18);
      }
    };
    window.addEventListener("scroll", finishOnScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    mobile.addEventListener("change", measure);
    motion.addEventListener("change", sync);
    pointer.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(() => { frame = requestAnimationFrame(sync); });
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
      cancelAnimationFrame(entranceFrame);
      cancelAnimationFrame(scrollFrame); resize.disconnect();
      window.removeEventListener("scroll", scheduleScroll);
      window.removeEventListener("scroll", finishOnScroll);
      window.removeEventListener("resize", measure);
      mobile.removeEventListener("change", measure);
      layers.forEach(layer => { layer.element.style.removeProperty("transform"); });
      motion.removeEventListener("change", sync); pointer.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      stage.removeEventListener("pointermove", move); stage.removeEventListener("pointerleave", leave);
      ctx.revert();
    };
  }, []);
  return <div ref={root} className={styles.stage}>{children}</div>;
}
