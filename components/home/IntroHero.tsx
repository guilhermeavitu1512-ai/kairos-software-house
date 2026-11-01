"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import HeroShowcase from "./HeroShowcase";
import styles from "./IntroHero.module.css";

const NOTIFICATIONS = [
  { app: "Cássio Franklin", text: "Novo agendamento: degradê às 10h", icon: "C", tone: "#e97a58" },
  { app: "Cássio Franklin", text: "Novo agendamento: corte + barba às 14h", icon: "C", tone: "#e97a58" },
  { app: "VYNE", text: "Nova venda na loja", icon: "V", tone: "#c8f06a" },
];

// Scene timeline in ms. Exits overlap the next scene so nothing cuts hard.
const AT = { phone: 1000, firstNote: 1450, noteGap: 560, punchline: 3350, unlock: 4250, land: 4950, done: 6200 };

// Runs before hydration so skipped intros never show a black frame.
const skipScript = `try{if(location.hash||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.introSkip="1"}catch(e){}`;

// Plays on every full page load; moving between pages inside the site does not replay it.
let played = false;

type Scene = "sleep" | "phone" | "punchline" | "unlock" | "land" | "done";
type Flight = { x: number; y: number; scale: number };

export default function IntroHero() {
  const [scene, setScene] = useState<Scene>(() => (played ? "done" : "sleep"));
  const [notes, setNotes] = useState(0);
  const [flight, setFlight] = useState<Flight>({ x: 0, y: 0, scale: 1 });
  const camera = useRef<HTMLDivElement>(null);
  const device = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const running = scene !== "done";

  const finish = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    played = true;
    document.body.style.overflow = "";
    setScene("done");
  }, []);

  useEffect(() => {
    if (played || document.documentElement.dataset.introSkip) {
      const skip = window.setTimeout(() => setScene("done"), 0);
      return () => window.clearTimeout(skip);
    }
    document.body.style.overflow = "hidden";
    const at = (delay: number, run: () => void) => timers.current.push(window.setTimeout(run, delay));
    at(AT.phone, () => setScene("phone"));
    NOTIFICATIONS.forEach((_, index) => at(AT.firstNote + AT.noteGap * index, () => {
      setNotes(index + 1);
      device.current?.animate([{ translate: "0 0" }, { translate: "-2px 0" }, { translate: "2px 0" }, { translate: "-1px 0" }, { translate: "0 0" }], { duration: 260, iterations: 2 });
    }));
    at(AT.punchline, () => setScene("punchline"));
    at(AT.unlock, () => setScene("unlock"));
    at(AT.land, () => {
      // One continuous shot: the intro phone flies into the hero phone's exact spot.
      const from = device.current?.getBoundingClientRect();
      const to = phoneRef.current?.getBoundingClientRect();
      const zoom = camera.current ? new DOMMatrix(getComputedStyle(camera.current).transform).a : 1;
      if (from && to) setFlight({
        x: (to.left + to.width / 2 - from.left - from.width / 2) / zoom,
        y: (to.top + to.height / 2 - from.top - from.height / 2) / zoom,
        scale: to.width / from.width,
      });
      setScene("land");
    });
    at(AT.done, finish);
    const pending = timers.current;
    return () => { pending.forEach(window.clearTimeout); document.body.style.overflow = ""; };
  }, [finish]);

  useEffect(() => {
    if (!running) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, finish]);

  const heroIn = scene === "land" || scene === "done";

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: skipScript }} />
      <noscript><style>{`.${styles.intro}{display:none}`}</style></noscript>
      {running && (
        <div className={styles.intro} data-scene={scene} style={{ "--fly-x": `${flight.x}px`, "--fly-y": `${flight.y}px`, "--fly-scale": flight.scale } as CSSProperties} role="img" aria-label="Animação de abertura: às três da manhã, o dono dorme enquanto o celular recebe agendamentos e vendas.">
          <div className={styles.sky} aria-hidden="true"><i /><i /><i /></div>

          <div ref={camera} className={styles.camera}>
            <div className={styles.left}>
              <p className={styles.clock}>03<span>:</span>00</p>
              <p className={styles.line}>Você está dormindo.</p>
            </div>

            <div ref={device} className={styles.phone}>
              <span key={notes} className={styles.ring} data-on={notes > 0} aria-hidden="true" />
              <div className={styles.screen}>
                <Image className={styles.site} src="/portfolio/cassio/home-390.webp" alt="" fill priority unoptimized />
                <div className={styles.lock}>
                  <div className={styles.status} aria-hidden="true"><span>KAIROS</span><i /></div>
                  <svg className={styles.padlock} width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true"><rect x="1" y="7" width="12" height="8" rx="2" fill="currentColor" /><path d="M3.5 7V4.8a3.5 3.5 0 0 1 7 0V7" stroke="currentColor" strokeWidth="1.6" /></svg>
                  <span className={styles.lockTime}>03:00</span>
                  <span className={styles.lockDate}>Madrugada de terça-feira</span>
                  <ul className={styles.notes}>
                    {NOTIFICATIONS.slice(0, notes).map((note) => (
                      <li key={note.text}>
                        <b style={{ background: note.tone }} aria-hidden="true">{note.icon}</b>
                        <span><strong>{note.app}<small>agora</small></strong>{note.text}</span>
                      </li>
                    ))}
                  </ul>
                  <span className={styles.swipe}>Deslize para abrir</span>
                  <span className={styles.homeBar} aria-hidden="true" />
                </div>
              </div>
              <span className={styles.reflection} aria-hidden="true" />
            </div>

            <div className={styles.right}><p className={styles.line}>Seu negócio, não.</p></div>
          </div>

          <button className={styles.skip} type="button" onClick={finish}>Pular intro</button>
        </div>
      )}

      <HeroShowcase phoneRef={phoneRef} visible={heroIn} settled={scene === "done"} />
    </>
  );
}
