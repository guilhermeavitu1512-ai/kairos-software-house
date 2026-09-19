"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { startIntroTransition } from "./intro-transition";
import styles from "./EntryIntro.module.css";

const subscribe = () => () => {};
const client = () => true;
const server = () => false;

function IntroLayer({ onEntered }: { onEntered: () => void }) {
  const scope = useRef<HTMLDivElement>(null);
  const idle = useRef<gsap.core.Timeline | null>(null);
  const transition = useRef<gsap.core.Timeline | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const requested = useRef(false);
  const cancel = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const compact = matchMedia("(max-width:760px)").matches;
      const motion = gsap.timeline({ repeat:-1, yoyo:true, defaults:{ duration:16, ease:"sine.inOut" } });
      idle.current = motion;
      motion.to("[data-lines-back]", { x:compact?12:36, y:-18, rotation:3 }, 0)
        .to("[data-orbit]", { x:compact?-16:-48, y:24, rotation:-6 }, 0)
        .to("[data-light-line]", { x:compact?16:52, y:-28, rotation:5 }, 0)
        .to("[data-frame-idle]", { y:-2, scale:1.005 }, 0)
        .to("[data-light-line]", { opacity:.3, duration:12 }, 0);
      const visibility = () => { motion.paused(document.hidden); };
      document.addEventListener("visibilitychange", visibility);
      visibility();
      return () => { document.removeEventListener("visibilitychange", visibility); idle.current = null; };
    }, scope);
    return () => { transition.current?.kill(); media.revert(); };
  }, []);

  useEffect(() => {
    const layer = scope.current as HTMLDivElement;
    const previousFocus = document.activeElement as HTMLElement | null;
    const locked = new Map<HTMLElement, boolean>();
    const lockSiblings = () => {
      for (const element of Array.from(document.body.children)) {
        if (element instanceof HTMLElement && element !== layer && !locked.has(element)) {
          locked.set(element, element.inert);
          element.inert = true;
        }
      }
    };
    lockSiblings();
    const observer = new MutationObserver(lockSiblings);
    observer.observe(document.body, { childList: true });
    const body = document.body;
    const html = document.documentElement;
    const y = window.scrollY;
    const saved = { overflow: body.style.overflow, position: body.style.position, top: body.style.top, width: body.style.width, htmlOverflow: html.style.overflow };
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `${-y}px`;
    body.style.width = "100%";
    html.style.overflow = "hidden";
    button.current?.focus({ preventScroll: true });
    return () => {
      cancel.current?.();
      observer.disconnect();
      locked.forEach((inert, element) => { element.inert = inert; });
      Object.assign(body.style, { overflow:saved.overflow, position:saved.position, top:saved.top, width:saved.width });
      html.style.overflow = saved.htmlOverflow;
      window.scrollTo({ top:y, behavior:"instant" });
      const target = requested.current ? document.getElementById("hero-title") : previousFocus;
      if (target?.isConnected) {
        const tabIndex = target.getAttribute("tabindex");
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll:true });
        // Keep the heading programmatically focusable; removing tabindex here
        // immediately blurs it in Chromium. It does not join the Tab order.
        if (!requested.current) {
          if (tabIndex === null) target.removeAttribute("tabindex");
          else target.setAttribute("tabindex", tabIndex);
        }
      }
    };
  }, [scope]);

  const enter = () => {
    if (requested.current) return;
    requested.current = true;
    const layer = scope.current as HTMLDivElement;
    layer.setAttribute("data-entering", "true");
    button.current?.setAttribute("aria-disabled", "true");
    cancel.current = startIntroTransition({
      play: () => {
        const frame = layer.querySelector<HTMLElement>("[data-frame]")!;
        const size = frame.getBoundingClientRect().width;
        const scale = Math.max(innerWidth, innerHeight) / size * 1.18;
        let resolve!: () => void;
        const done = new Promise<void>(finish => { resolve = finish; });
        const tl = gsap.timeline({ defaults:{ ease:"power2.inOut" }, onComplete:resolve });
        transition.current = tl;
        const select = gsap.utils.selector(layer);
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
          tl.to(layer, { opacity:0, duration:.35 });
          tl.call(() => layer.setAttribute("data-hero-overlap", "true"), [], .15);
        } else {
          // Accelerate the existing clock without resetting its visual progress.
          if (idle.current) tl.to(idle.current, { timeScale:5, duration:.65 }, 0);
          tl.addLabel("open", .15)
            .to(frame, { scale, duration:1.05, ease:"power1.inOut" }, "open")
            .to(frame, { opacity:1, duration:.25 }, 0)
            .to(select("[data-field]"), { scale:1.14, duration:1.2 }, 0)
            .to(select("[data-copy]"), { autoAlpha:0, duration:.3 }, .3)
            .to(select("[data-cover]"), { opacity:0, duration:.55 }, .65)
            .to(select("[data-field]"), { opacity:0, duration:.3 }, .9)
            .to(frame, { opacity:0, duration:.45 }, .75);
          tl.call(() => layer.setAttribute("data-hero-overlap", "true"), [], 1);
        }
        return { then:(success:()=>void, failure:()=>void)=>done.then(success,failure), stop:()=>tl.kill() };
      },
      fade: () => { layer.setAttribute("data-fallback", "true"); layer.setAttribute("data-hero-overlap", "true"); },
      release: onEntered,
    });
  };

  return <div ref={scope} className={styles.intro} role="dialog" aria-modal="true" aria-label="Entrada KAIROS" data-entry-intro onKeyDown={event => {
    if (event.key === "Tab") { event.preventDefault(); button.current?.focus(); }
  }}>
    <div className={styles.cover} data-cover />
    <div className={styles.field} data-field aria-hidden="true">
      <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
        <g className={styles.back} data-lines-back><path d="M-240 160 C230 -220 1270 -120 1540 430 S810 1100 170 930"/><path d="M-100 860 C150 370 620 -130 1500 80"/></g>
        <g className={styles.orbit} data-orbit><g transform="rotate(-12 720 450)"><ellipse cx="720" cy="450" rx="660" ry="310"/><circle cx="1186.69" cy="230.797" r="2.5"/><circle cx="253.31" cy="669.203" r="2"/></g></g>
        <g className={styles.light} data-light-line><path d="M110 -100 C-130 400 690 1140 1530 680"/></g>
      </svg>
    </div>
    <button ref={button} type="button" className={styles.enter} onClick={enter}>
      <span className={styles.frameIdle} data-frame-idle aria-hidden="true"><span className={styles.frame} data-frame /></span>
      <span className={styles.copy} data-copy><span className={styles.name}>KAIROS</span><span className={styles.prompt}>Explorar projetos<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></span>
    </button>
  </div>;
}

export default function EntryIntro() {
  // No server overlay or inert state: a critical JS/hydration failure leaves HTML accessible.
  const hydrated = useSyncExternalStore(subscribe, client, server);
  const [entered, setEntered] = useState(false);
  return hydrated && !entered ? createPortal(<IntroLayer onEntered={() => setEntered(true)} />, document.body) : null;
}
