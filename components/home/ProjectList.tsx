"use client";

import { useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { portfolioProjects } from "@/data/projects";
import SiteExplorer, { type ExplorableProject } from "./SiteExplorer";
import styles from "./Home.module.css";

const OUTCOMES: Record<string, string> = {
  cassio: "Agenda aberta a qualquer hora, sem esperar resposta no WhatsApp.",
  blend: "Pedidos direto no site, sem comissão de aplicativo.",
  tony: "O cliente marca sozinho, sem troca de mensagens.",
  vyne: "Uma vitrine completa para vender produtos on-line.",
  arara: "Uma loja de roupas para mexer nas peças e criar a sua.",
};

export default function ProjectList({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  const [active, setActive] = useState<string | null>(null);
  const [exploring, setExploring] = useState<ExplorableProject | null>(null);
  const preview = useRef<HTMLDivElement>(null);

  // Writes straight to the element: re-rendering on every pointer move would stutter.
  const follow = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !preview.current) return;
    const box = event.currentTarget.getBoundingClientRect();
    preview.current.style.transform = `translate(${event.clientX - box.left + 28}px, ${event.clientY - box.top - 130}px)`;
  };

  return (
    <section id="projetos" className={styles.section} aria-labelledby="projects-title">
      <div className={styles.shell}>
        <header className={styles.head}>
          <p className={styles.kicker}>Portfólio</p>
          <Heading id="projects-title">Cinco projetos. Cinco sites no ar.</Heading>
          <p>Projetos de demonstração da KAIROS, publicados e funcionando. Abra, clique e teste.</p>
        </header>
        <div className={styles.projects} onPointerMove={follow} onPointerLeave={() => setActive(null)}>
          <div ref={preview} className={styles.preview} data-visible={active !== null} aria-hidden="true">
            {portfolioProjects.map((project) => (
              <Image key={project.id} src={project.image} alt="" fill sizes="340px" unoptimized={project.image.endsWith(".webp")} data-active={project.id === active} />
            ))}
          </div>
          {portfolioProjects.map((project, index) => {
            const { liveUrl } = project;
            return (
              <article key={project.id} className={styles.project} onPointerEnter={() => setActive(project.id)}>
                <span className={styles.projectIndex}>0{index + 1}</span>
                <div className={styles.projectCopy}>
                  <h3><Link href={project.url}>{project.name}</Link></h3>
                  <p>{OUTCOMES[project.id] ?? project.description}</p>
                </div>
                <span className={styles.projectType}>{project.category}</span>
                {liveUrl && (
                  <div className={styles.projectActions}>
                    <button type="button" className={styles.projectExplore} onClick={() => setExploring({ name: project.name, liveUrl })}>Explorar aqui</button>
                    <a className={styles.projectLive} href={liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${project.name} em nova aba`}>Nova aba ↗</a>
                  </div>
                )}
                <div className={styles.projectShot}><Image src={project.image} alt={`Tela do projeto ${project.name}`} fill sizes="(max-width: 900px) 84vw, 1px" unoptimized={project.image.endsWith(".webp")} /></div>
              </article>
            );
          })}
        </div>
      </div>
      {exploring && <SiteExplorer project={exploring} onClose={() => setExploring(null)} />}
    </section>
  );
}
