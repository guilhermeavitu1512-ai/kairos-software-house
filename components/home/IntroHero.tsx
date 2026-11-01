"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import HeroShowcase from "./HeroShowcase";
import IntroParticles, { type ParticleMode } from "./IntroParticles";
import styles from "./IntroHero.module.css";

// Scene timeline in ms: boot, the particles slowly write the name, the logo rises, the two lines, every portfolio site is built on the phone.
const AT = { word: 1700, logo: 4400, first: 5900, second: 7500, phone: 9100, land: 14700, done: 16400 };

// Built one after the other; Cássio comes last because the hero opens on it.
const SITES = ["arara", "tony", "blend", "vyne", "cassio"];

// Runs before hydration so skipped intros never show a black frame.
const skipScript = `try{if(location.hash||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.introSkip="1"}catch(e){}`;

// Plays on every full page load; moving between pages inside the site does not replay it.
let played = false;

type Scene = "boot" | "word" | "logo" | "first" | "second" | "phone" | "land" | "done";
type Flight = { x: number; y: number; scale: number };

const particleMode = (scene: Scene): ParticleMode => (scene === "boot" ? "swirl" : scene === "phone" || scene === "land" ? "frame" : "word");

export default function IntroHero() {
  const [scene, setScene] = useState<Scene>(() => (played ? "done" : "boot"));
  const [percent, setPercent] = useState(0);
  const [flight, setFlight] = useState<Flight>({ x: 0, y: 0, scale: 1 });
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
    for (let step = 1; step <= 20; step += 1) at(step * (AT.word / 20), () => setPercent(step * 5));
    at(AT.word, () => setScene("word"));
    at(AT.logo, () => setScene("logo"));
    at(AT.first, () => setScene("first"));
    at(AT.second, () => setScene("second"));
    at(AT.phone, () => setScene("phone"));
    at(AT.land, () => {
      // One continuous shot: the intro phone flies into the hero phone's exact spot.
      const from = device.current?.getBoundingClientRect();
      const to = phoneRef.current?.getBoundingClientRect();
      if (from && to) setFlight({
        x: to.left + to.width / 2 - from.left - from.width / 2,
        y: to.top + to.height / 2 - from.top - from.height / 2,
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
        <div className={styles.intro} data-scene={scene} style={{ "--fly-x": `${flight.x}px`, "--fly-y": `${flight.y}px`, "--fly-scale": flight.scale } as CSSProperties} role="img" aria-label="Abertura: um sistema inicia, partículas formam o nome KAIROS e depois constroem um site em um celular.">
          <span className={styles.grid} aria-hidden="true" />
          <IntroParticles mode={particleMode(scene)} phone={device} />

          <Image className={styles.logo} src="/brand/kairos-logo.png" alt="" width={220} height={220} priority />

          <p className={styles.boot}><span>Sistema de última geração</span><b>{percent}%</b></p>

          <p className={styles.line} data-line="first">Seu cliente decide em segundos.</p>
          <p className={styles.line} data-line="second">Seu concorrente não vai esperar.</p>
          <p className={styles.line} data-line="third">Agora é a sua vez.</p>
          <p className={styles.touch}>Mexa nas partículas</p>

          <div ref={device} className={styles.phone}>
            <div className={styles.screen}>
              {SITES.map((site, index) => <Image key={site} className={styles.site} style={{ "--i": index } as CSSProperties} src={`/portfolio/hero/${site}.webp`} alt="" fill priority unoptimized />)}
              <i className={styles.scan} aria-hidden="true" />
            </div>
          </div>

          <button className={styles.skip} type="button" onClick={finish}>Pular intro</button>
        </div>
      )}

      <HeroShowcase phoneRef={phoneRef} visible={heroIn} settled={scene === "done"} />
    </>
  );
}
