"use client";

import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/data/projects";

type NarrativeStepProps = {
  label: string;
  headline: string;
  body: string;
};

function NarrativeStep({ label, headline, body }: NarrativeStepProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.article
      className="case-story-step"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="case-story-label">
        <strong>{label}</strong>
      </div>
      <h2>{headline}</h2>
      <p>{body}</p>
      <span className="case-step-arrow" aria-hidden="true">
        ↓
      </span>
    </m.article>
  );
}

export default function CaseNarrative({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const productY = useTransform(scrollYProgress, [0.52, 0.86], [90, 0]);
  const productScale = useTransform(scrollYProgress, [0.52, 0.86], [0.93, 1]);
  const productOpacity = useTransform(scrollYProgress, [0.52, 0.78], [0.22, 1]);

  return (
    <section
      ref={sectionRef}
      className="case-narrative"
      aria-label={`Narrativa do case ${project.name}`}
    >
      <div className="section-shell case-narrative-layout">
        <aside className="case-narrative-rail" aria-label="Etapas do case">
          <div className="case-rail-line" aria-hidden="true">
            <m.i style={{ scaleY: reduceMotion ? 1 : scrollYProgress }} />
          </div>
          <ol>
            <li>
              Problema
            </li>
            <li>
              Decisão
            </li>
            <li>
              Solução
            </li>
            <li>
              Produto
            </li>
          </ol>
        </aside>

        <div className="case-narrative-steps">
          <NarrativeStep
            label="O problema"
            headline={project.problemTitle}
            body={project.problem}
          />
          <NarrativeStep
            label="A decisão"
            headline={project.decisionTitle}
            body={project.strategy}
          />
          <NarrativeStep
            label="A solução"
            headline={project.solutionTitle}
            body={project.solution}
          />
        </div>
      </div>

      <m.figure
        className="section-shell case-product-stage"
        style={{
          y: reduceMotion ? 0 : productY,
          scale: reduceMotion ? 1 : productScale,
          opacity: reduceMotion ? 1 : productOpacity,
        }}
      >
        <figcaption>
          <span>Produto</span>
          <h2>{project.name}</h2>
        </figcaption>
        <div className="case-product-image">
          <Image
            src={project.image}
            alt={`Interface do projeto ${project.name}`}
            fill
            sizes="(max-width: 760px) 100vw, 1320px"
          />
        </div>
      </m.figure>
    </section>
  );
}
