"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { portfolioProjects } from "@/data/projects";
import SiteExplorer, { type ExplorableProject } from "./SiteExplorer";
import styles from "./ProjectList.module.css";

const OUTCOMES: Record<string, string> = {
  cassio: "Agenda aberta a qualquer hora, sem esperar resposta no WhatsApp.",
  blend: "Pedidos direto no site, sem comissão de aplicativo.",
  tony: "O cliente marca sozinho, sem troca de mensagens.",
  vyne: "Uma vitrine completa para vender produtos on-line.",
  arara: "Uma loja de roupas para mexer nas peças e criar a sua.",
};

export default function ProjectList({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  const [active, setActive] = useState(0);
  const [exploring, setExploring] = useState<ExplorableProject | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useRef(false);
  const project = portfolioProjects[active];
  const upcoming = portfolioProjects[(active + 1) % portfolioProjects.length];
  const liveUrl = project.liveUrl;

  // Phones only autoplay truly muted video, and saving modes can still refuse: then the visitor gets a play button.
  const play = useCallback(() => {
    const node = video.current;
    if (!node) return;
    node.muted = true;
    node.setAttribute("muted", "");
    node.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
  }, []);

  useEffect(() => {
    const node = video.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The clip only loads and plays while it is on screen, so the page stays light.
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = Boolean(entry?.isIntersecting);
      if (inView.current) { setStarted(true); play(); } else node.pause();
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [play]);

  useEffect(() => {
    if (inView.current) play();
  }, [active, play]);

  const next = () => setActive((current) => (current + 1) % portfolioProjects.length);

  return (
    <section id="projetos" className={styles.section} aria-labelledby="projects-title">
      <div className={styles.shell}>
        <header className={styles.head}>
          <Heading id="projects-title">Cinco projetos. Cinco sites no ar.</Heading>
        </header>

        <div role="group" aria-label="Escolher projeto" className={styles.tabs}>
          {portfolioProjects.map((item, index) => (
            <button key={item.id} type="button" aria-pressed={index === active} onClick={() => setActive(index)}>{item.name}</button>
          ))}
        </div>

        <div className={styles.player}>
          <video
            ref={video} src={`/portfolio/videos/${project.id}.mp4`} poster={`/portfolio/videos/${project.id}.webp`}
            muted playsInline preload="metadata" onEnded={next}
            onWaiting={() => setLoading(true)} onPlaying={() => setLoading(false)} onCanPlay={() => setLoading(false)}
            aria-label={`Site ${project.name} no computador e no celular: abertura e página inteira`}
          />
          {/* Fetched in the background so the next project starts without a wait. */}
          {started && <video key={upcoming.id} className={styles.ahead} src={`/portfolio/videos/${upcoming.id}.mp4`} muted playsInline preload="auto" aria-hidden="true" />}
          {loading && !blocked && <span className={styles.spinner} role="status" aria-label="Carregando vídeo" />}
          {blocked && <button type="button" className={styles.playButton} onClick={play}><span aria-hidden="true">▶</span> Ver o site em vídeo</button>}
        </div>

        <div key={`${project.id}-info`} className={styles.info}>
          <div>
            <h3><Link href={project.url}>{project.name}</Link></h3>
            <p>{OUTCOMES[project.id] ?? project.description}</p>
          </div>
          {liveUrl && (
            <div className={styles.actions}>
              <button type="button" className={styles.explore} onClick={() => setExploring({ name: project.name, liveUrl })}>Explorar aqui</button>
              <a className={styles.live} href={liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${project.name} em nova aba`}>Nova aba ↗</a>
            </div>
          )}
        </div>
      </div>
      {exploring && <SiteExplorer project={exploring} onClose={() => setExploring(null)} />}
    </section>
  );
}
