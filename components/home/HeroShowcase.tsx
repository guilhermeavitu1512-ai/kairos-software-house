"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import { MOTION_EASE } from "@/components/kairos/motion";
import styles from "./HeroShowcase.module.css";

// Cássio comes first: it is the site the intro phone lands on.
const PROJECTS = [
  { app: "Cássio Franklin", short: "Cássio", note: "Novo agendamento: degradê às 10h", tone: "233,122,88", image: "/portfolio/hero/cassio.webp", url: "https://cassiofranklin.vercel.app/" },
  { app: "VYNE", short: "VYNE", note: "Nova venda na loja", tone: "200,240,106", image: "/portfolio/hero/vyne.webp", url: "https://vyne-relogios.vercel.app/" },
  { app: "Blend Burger", short: "Blend", note: "Novo pedido: 2 burgers", tone: "255,122,46", image: "/portfolio/hero/blend.webp", url: "https://blend-burger-mocha.vercel.app/" },
  { app: "Tony Barber", short: "Tony", note: "Novo agendamento: corte às 18h", tone: "240,178,74", image: "/portfolio/hero/tony.webp", url: "https://tonybarber.vercel.app/" },
  { app: "ARARA", short: "ARARA", note: "Nova venda: 2 camisetas", tone: "205,210,225", image: "/portfolio/hero/arara.webp", url: "https://arara-roupas.vercel.app/" },
];

const SLIDE_MS = 4500;
const SWIPE_PX = 40;

// Position around the active phone: 0 center, 1 right, -1 left, 2 behind.
const slotOf = (index: number, active: number) => {
  const distance = (index - active + PROJECTS.length) % PROJECTS.length;
  if (distance === PROJECTS.length - 1) return -1;
  return Math.min(distance, 2);
};

const heroGroup = { hide: {}, show: { transition: { staggerChildren: 0.09 } } };
const heroItem = {
  hide: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: MOTION_EASE } },
};

export default function HeroShowcase({ phoneRef, visible, settled }: { phoneRef: RefObject<HTMLDivElement | null>; visible: boolean; settled: boolean }) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const swipeFrom = useRef<number | null>(null);
  const project = PROJECTS[active];

  useEffect(() => {
    if (!settled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Waits while the hero is out of sight; depends on active so a tap restarts the count.
    const timer = window.setInterval(() => {
      if (document.hidden || window.scrollY > window.innerHeight * 0.6) return;
      setActive((current) => (current + 1) % PROJECTS.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [settled, active]);

  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !tiltRef.current || !sectionRef.current) return;
    const box = sectionRef.current.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    tiltRef.current.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -6}deg)`;
  };

  const endSwipe = (event: PointerEvent<HTMLElement>) => {
    if (swipeFrom.current === null) return;
    const moved = event.clientX - swipeFrom.current;
    swipeFrom.current = null;
    if (Math.abs(moved) < SWIPE_PX) return;
    setActive((current) => (current + (moved < 0 ? 1 : -1) + PROJECTS.length) % PROJECTS.length);
  };

  return (
    <section ref={sectionRef} className={styles.hero} style={{ "--tone": project.tone, "--slide": `${SLIDE_MS}ms` } as CSSProperties} data-in={visible} onPointerMove={tilt} aria-labelledby="hero-title">
      <div className={styles.sky} aria-hidden="true"><span className={styles.stars} /><span className={styles.glow} /></div>

      <m.div className={styles.copy} variants={heroGroup} initial={false} animate={visible ? "show" : "hide"}>
        <m.p className={styles.tag} variants={heroItem}><span aria-hidden="true" /> Sites, agendas e pedidos on-line</m.p>
        <h1 id="hero-title">
          <m.span variants={heroItem}>Você fecha.</m.span>
          <m.em variants={heroItem}>Seu site não.</m.em>
        </h1>
        <m.p className={styles.sub} variants={heroItem}>Sites que atendem, agendam e vendem por você, a partir de R$&nbsp;49/mês + criação do site.</m.p>
        <m.div className={styles.actions} variants={heroItem}>
          <ProblemFlowTrigger className={styles.primary}>Quero o meu <span aria-hidden="true">→</span></ProblemFlowTrigger>
          <a className={styles.secondary} href="#solucoes">Testar uma demonstração</a>
        </m.div>
      </m.div>

      <div className={styles.stage} data-settled={settled}>
        <div className={styles.scene}>
          <div
            ref={tiltRef} className={styles.deck}
            onPointerDown={(event) => { swipeFrom.current = event.clientX; }}
            onPointerUp={endSwipe}
            onPointerCancel={() => { swipeFrom.current = null; }}
          >
            <div ref={phoneRef} className={styles.slot} aria-hidden="true" />
            {PROJECTS.map((item, index) => (
              <div key={item.app} className={styles.phone} data-slot={slotOf(index, active)} onClick={() => setActive(index)}>
                <Image src={item.image} alt={index === active ? `Site ${item.app} aberto no celular` : ""} fill priority unoptimized sizes="320px" draggable={false} />
              </div>
            ))}
            <a key={project.app} className={styles.notice} href={project.url} target="_blank" rel="noopener noreferrer">
              <b aria-hidden="true">{project.app[0]}</b>
              <span><strong>{project.app}</strong>{project.note}</span>
              <i aria-hidden="true">↗</i>
            </a>
          </div>
        </div>

        <div className={styles.tabs} role="group" aria-label="Escolher projeto">
          {PROJECTS.map((item, index) => (
            <button key={item.app} type="button" aria-pressed={index === active} aria-label={item.app} data-active={index === active} onClick={() => setActive(index)}>
              <span className={styles.bar}><i key={index === active ? active : "idle"} /></span>
              {item.short}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
