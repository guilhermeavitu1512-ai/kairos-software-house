"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import styles from "./HeroLive.module.css";

const scenes = [
  { id: "site", label: "Site", url: "Blend Burger · projeto KAIROS", duration: 8000 },
  { id: "agenda", label: "Agenda", url: "seunegocio.com.br/agendar", duration: 5200 },
  { id: "bot", label: "Automação", url: "painel · automações", duration: 5200 },
] as const;
const blendFrames = ["/portfolio/blend/home-1440.png", "/portfolio/blend/destaques-1440.png", "/portfolio/blend/sobre-1440.png"];

const Phone = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18h2" /></svg>;
const Bolt = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>;
const Check = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>;

// Real screenshots of Blend Burger, a KAIROS project, scrolled like a visit.
function SiteScene() {
  return <div className={styles.realSite}>
    <div className={styles.realTrack}>
      {blendFrames.map((src, i) => <Image key={src} src={src} alt="" width={1440} height={900} sizes="(max-width:1000px) 90vw, 600px" priority={i === 0} />)}
    </div>
    <div className={styles.realMobile}><Image src="/portfolio/blend/home-390.png" alt="" width={780} height={1688} sizes="(max-width:760px) 90vw, 1px" /></div>
  </div>;
}

function AgendaScene() {
  const slots = [["09:00", "Rafael", "Corte"], ["10:30", "Ana", "Barba"], ["13:00", "Bruno", "Combo"], ["15:30", "Lucas", "Corte"], ["17:00", "Livre", ""]];
  return <div className={styles.scene}>
    <div className={styles.agendaHead}><div><small>Hoje</small><b>Terça, 14</b></div><div className={styles.agendaDays}>{["S", "T", "Q", "Q", "S"].map((d, i) => <span key={i} data-active={i === 1 || undefined}>{d}</span>)}</div></div>
    <ul className={styles.slots}>{slots.map(([time, name, service], i) => <li key={time} style={{ animationDelay: `${150 + i * 260}ms` }} data-free={!service || undefined}>
      <span className={styles.slotTime}>{time}</span><span className={styles.slotName}>{name}<small>{service || "Disponível para agendar"}</small></span>{service ? <span className={styles.slotCheck}><Check /></span> : <span className={styles.slotOpen}>+</span>}
    </li>)}</ul>
    <div className={`${styles.toast} ${styles.toastLate}`}><span className={styles.toastIcon} data-tone="green"><Check /></span><div><b>Horário confirmado</b><small>Lucas · Corte · 15:30</small></div></div>
  </div>;
}

function BotScene() {
  const nodes = [["Formulário do site", "Novo pedido"], ["Planilha", "Linha criada"], ["WhatsApp", "Cliente avisado"]];
  const logs = ["Pedido #1042 salvo na planilha", "Confirmação enviada ao cliente", "Equipe avisada no grupo"];
  return <div className={styles.scene}>
    <div className={styles.flow}>{nodes.map(([title, note], i) => <div key={title} className={styles.node} style={{ animationDelay: `${i * 180}ms` }}><span className={styles.nodeIcon} data-node={i} /><b>{title}</b><small>{note}</small></div>)}
      <span className={styles.wire}><i /><i /></span>
    </div>
    <ul className={styles.logs}>{logs.map((log, i) => <li key={log} style={{ animationDelay: `${900 + i * 450}ms` }}><span className={styles.slotCheck}><Check /></span>{log}<small>agora</small></li>)}</ul>
    <div className={styles.counter}><span>Tarefas feitas sozinhas hoje</span><b className={styles.counterValue} /></div>
  </div>;
}

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
  return <div ref={root} className={styles.demo} data-running={running || undefined} data-scene={scene.id} style={{ "--scene-duration": `${scene.duration}ms` } as CSSProperties} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <div className={styles.window}>
      <div className={styles.chrome}>
        <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.url}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>{scene.url}</span>
      </div>
      <div className={styles.tabs} role="tablist" aria-label="Exemplos do que a KAIROS constrói">
        {scenes.map((item, index) => <button key={item.id} ref={node => { tabs.current[index] = node; }} type="button" role="tab" id={`hero-demo-tab-${item.id}`} aria-selected={active === index} aria-controls="hero-demo-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => navigate(event, index)}>
          {item.label}{active === index && <span className={styles.progress} key={`${index}-${running}`} aria-hidden="true" />}
        </button>)}
      </div>
      <div className={styles.screen} role="tabpanel" id="hero-demo-panel" aria-labelledby={`hero-demo-tab-${scene.id}`} aria-roledescription="demonstração" aria-label={`Demonstração ilustrativa: ${scene.label}`}>
        <div key={scene.id} className={styles.sceneWrap} aria-hidden="true">
          {scene.id === "site" ? <SiteScene /> : scene.id === "agenda" ? <AgendaScene /> : <BotScene />}
        </div>
      </div>
    </div>
    {scene.id === "site" && <div key="phone" className={styles.phone} aria-hidden="true"><Image src="/portfolio/blend/home-390.png" alt="" width={780} height={1688} sizes="170px" /></div>}
    <div className={`${styles.badge} ${styles.badgeTop}`} aria-hidden="true"><span><Phone /></span>Pronto para celular</div>
    <div className={`${styles.badge} ${styles.badgeBottom}`} aria-hidden="true"><span><Bolt /></span>Integra com WhatsApp</div>
    <p className={styles.caption}>{scene.id === "site" ? "Blend Burger: projeto autoral da KAIROS" : "Demonstração ilustrativa"}</p>
  </div>;
}
