"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import styles from "./HeroLive.module.css";

// Real screenshots of KAIROS projects, scrolled like a visit.
const scenes = [
  { id: "blend", label: "Cardápio", project: "Blend Burger", url: null, duration: 8000, mobile: "/portfolio/blend/home-390.png",
    frames: ["/portfolio/blend/home-1440.png", "/portfolio/blend/destaques-1440.png", "/portfolio/blend/sobre-1440.png"] },
  { id: "tony", label: "Agendamento", project: "Tony Barber", url: "https://tonybarber.vercel.app/", duration: 8000, mobile: "/portfolio/tony/agenda-horario-390.png",
    frames: ["/portfolio/tony/home-hd.png", "/portfolio/tony/agenda-servicos.png", "/portfolio/tony/agenda-horario.png"] },
  { id: "vyne", label: "Loja online", project: "VYNE", url: "https://vyne-relogios.vercel.app/", duration: 8000, mobile: "/portfolio/vyne/home-390.png",
    frames: ["/portfolio/vyne/home-hd.png", "/portfolio/vyne/recomendados-hd.png", "/portfolio/vyne/catalogo-hd.png"] },
] as const;

const Lock = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;

export default function HeroDemo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const sync = () => setAutoplay(visible && !document.hidden && !motion.matches);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    const pointer = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1001px)");
    const move = (event: PointerEvent) => {
      if (!pointer.matches || motion.matches) return;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--tilt-x", `${((event.clientY - rect.top) / rect.height - .5) * -6}deg`);
      node.style.setProperty("--tilt-y", `${((event.clientX - rect.left) / rect.width - .5) * 8}deg`);
    };
    const leave = () => { node.style.setProperty("--tilt-x", "0deg"); node.style.setProperty("--tilt-y", "0deg"); };
    node.addEventListener("pointermove", move, { passive: true });
    node.addEventListener("pointerleave", leave);
    sync();
    return () => {
      observer.disconnect(); document.removeEventListener("visibilitychange", sync); motion.removeEventListener("change", sync);
      node.removeEventListener("pointermove", move); node.removeEventListener("pointerleave", leave);
    };
  }, []);

  const running = autoplay && !paused;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setActive(current => (current + 1) % scenes.length), scenes[active].duration);
    return () => window.clearTimeout(timer);
  }, [running, active]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % scenes.length : event.key === "ArrowLeft" ? (index + scenes.length - 1) % scenes.length : null;
    if (next === null) return;
    event.preventDefault(); setActive(next); tabs.current[next]?.focus();
  }

  const scene = scenes[active];
  return <div ref={root} className={styles.demo} data-running={running || undefined} style={{ "--scene-duration": `${scene.duration}ms` } as CSSProperties} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <div className={styles.window}>
      <div className={styles.chrome}>
        <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
        {scene.url
          ? <a className={styles.url} href={scene.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir o site ${scene.project} em nova aba`}><Lock />{new URL(scene.url).host}<span aria-hidden="true">↗</span></a>
          : <span className={styles.url}><Lock />{scene.project} · projeto KAIROS</span>}
      </div>
      <div className={styles.tabs} role="tablist" aria-label="Projetos da KAIROS">
        {scenes.map((item, index) => <button key={item.id} ref={node => { tabs.current[index] = node; }} type="button" role="tab" id={`hero-demo-tab-${item.id}`} aria-selected={active === index} aria-controls="hero-demo-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => navigate(event, index)}>
          {item.label}{active === index && <span className={styles.progress} key={`${index}-${running}`} aria-hidden="true" />}
        </button>)}
      </div>
      <div className={styles.screen} role="tabpanel" id="hero-demo-panel" aria-labelledby={`hero-demo-tab-${scene.id}`} aria-label={`Telas do projeto ${scene.project}`}>
        <div key={scene.id} className={styles.sceneWrap}>
          <div className={styles.realSite}>
            <div className={styles.realTrack}>
              {scene.frames.map((src, i) => <Image key={src} src={src} alt={i === 0 ? `Página inicial do projeto ${scene.project}` : ""} width={1440} height={900} sizes="(max-width:1000px) 90vw, 600px" priority={active === 0 && i === 0} />)}
            </div>
            <div className={styles.realMobile}><Image src={scene.mobile} alt="" width={780} height={1688} sizes="(max-width:760px) 90vw, 1px" /></div>
          </div>
        </div>
      </div>
    </div>
    <div key={`phone-${scene.id}`} className={styles.phone} aria-hidden="true"><Image src={scene.mobile} alt="" width={780} height={1688} sizes="170px" /></div>
    <p className={styles.caption}>{scene.project}: projeto autoral da KAIROS</p>
  </div>;
}
