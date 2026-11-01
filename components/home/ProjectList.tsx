"use client";

import { useEffect, useRef, useState } from "react";
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
  const stage = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const project = portfolioProjects[active];
  const liveUrl = project.liveUrl;

  const videos = () => [...(stage.current?.querySelectorAll("video") ?? [])];

  useEffect(() => {
    const node = stage.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The pair only loads and plays while the stage is on screen, so the page stays light.
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = Boolean(entry?.isIntersecting);
      videos().forEach((video) => { if (inView.current) video.play().catch(() => undefined); else video.pause(); });
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView.current) videos().forEach((video) => video.play().catch(() => undefined));
  }, [active]);

  const next = () => setActive((current) => (current + 1) % portfolioProjects.length);

  return (
    <section id="projetos" className={styles.section} aria-labelledby="projects-title">
      <div className={styles.shell}>
        <header className={styles.head}>
          <Heading id="projects-title">Cinco projetos. Cinco sites no ar.</Heading>
          <p>Projetos de demonstração da KAIROS, publicados e funcionando.</p>
        </header>

        <div role="group" aria-label="Escolher projeto" className={styles.tabs}>
          {portfolioProjects.map((item, index) => (
            <button key={item.id} type="button" aria-pressed={index === active} onClick={() => setActive(index)}>{item.name}</button>
          ))}
        </div>

        <div ref={stage}><div key={project.id} className={styles.stage}>
          <div className={styles.laptop}>
            <div className={styles.lid}>
              <video src={`/portfolio/videos/${project.id}-pc.mp4`} poster={project.image} muted playsInline preload="none" onEnded={next} aria-label={`Site ${project.name} no computador: abertura e página inteira`} />
            </div>
            <span className={styles.base} aria-hidden="true" />
          </div>
          <div className={styles.phone}>
            <video src={`/portfolio/videos/${project.id}-celular.mp4`} poster={`/portfolio/hero/${project.id}.webp`} muted playsInline preload="none" aria-label={`Site ${project.name} no celular: abertura e página inteira`} />
          </div>
        </div></div>

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
