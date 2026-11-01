"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { solutions } from "@/data/site-copy";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import { DEMOS } from "./SolutionDemos";
import styles from "./Solutions.module.css";

const AUTOPLAY_MS = 6000;

function Result({ index, onTouch }: { index: number; onTouch: () => void }) {
  const item = solutions[index];
  const Demo = DEMOS[item.demo];
  const [note, setNote] = useState<{ id: number; text: string } | null>(null);
  return (
    <div className={styles.result} onPointerDown={onTouch} onFocus={onTouch}>
      <div className={styles.phone}>
        {note && <p key={note.id} className={styles.note} role="status"><b aria-hidden="true">{item.brand[0]}</b><span><strong>{item.brand}</strong>{note.text}</span></p>}
        <div className={styles.screen}>
          <p className={styles.brand}>{item.brand}<span aria-hidden="true">●●●</span></p>
          <div className={styles.body}><Demo notify={(text) => setNote({ id: Date.now(), text })} /></div>
        </div>
      </div>
      <div className={styles.answer}>
        <p>{item.title}</p>
        <ProblemFlowTrigger className={styles.cta} subject={item.title}>{item.cta} <span aria-hidden="true">→</span></ProblemFlowTrigger>
        <Link href={item.example.href}>{item.example.label}</Link>
      </div>
    </div>
  );
}

export default function Solutions() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const section = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 861px)");
  const playing = isDesktop && !touched;

  useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only advances while the section is on screen, and stops for good once someone interacts.
    const timer = window.setInterval(() => {
      const box = section.current?.getBoundingClientRect();
      if (document.hidden || !box || box.bottom < 0 || box.top > window.innerHeight) return;
      setActive((current) => (current + 1) % solutions.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [playing, active]);

  const choose = (index: number) => { setTouched(true); setActive(index); };
  const style = { "--tone": solutions[active].tone, "--on-tone": solutions[active].onTone, "--slide": `${AUTOPLAY_MS}ms` } as CSSProperties;

  return (
    <section ref={section} id="solucoes" className={styles.section} style={style} data-playing={playing} aria-labelledby="solutions-title">
      <span className={styles.glow} aria-hidden="true" />
      <div className={styles.shell}>
        <div className={styles.side}>
          <h2 id="solutions-title">Qual problema você quer resolver?</h2>
          <p className={styles.lead}>Toque no seu e teste a solução aqui mesmo.</p>
          <div className={styles.problems}>
            {solutions.map((item, index) => (
              <div key={item.demo} className={styles.problem} data-active={index === active}>
                <button type="button" aria-expanded={index === active} onClick={() => choose(index)}><span>{item.problem}</span><i aria-hidden="true">→</i></button>
                {index === active && <u key={active} className={styles.progress} aria-hidden="true" />}
                {!isDesktop && index === active && <Result key={item.demo} index={index} onTouch={() => setTouched(true)} />}
              </div>
            ))}
          </div>
        </div>
        {isDesktop && <Result key={solutions[active].demo} index={active} onTouch={() => setTouched(true)} />}
      </div>
    </section>
  );
}
