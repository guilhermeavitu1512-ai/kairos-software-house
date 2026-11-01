"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { solutions } from "@/data/site-copy";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import styles from "./Solutions.module.css";

// One question, then one suggestion built from the answer.
export default function Solutions() {
  const [chosen, setChosen] = useState<number | null>(null);
  const moved = useRef(false);
  const focusTarget = useRef<HTMLElement>(null);
  const item = chosen === null ? null : solutions[chosen];

  useEffect(() => {
    if (moved.current) focusTarget.current?.focus({ preventScroll: true });
  }, [chosen]);

  const answer = (index: number | null) => { moved.current = true; setChosen(index); };

  return (
    <section id="solucoes" className={styles.section} aria-labelledby="solutions-title">
      <div className={styles.shell}>
        {item ? (
          <div key={item.problem} className={styles.suggestion}>
            <p className={styles.said}>{item.problem}</p>
            <h2 id="solutions-title" ref={focusTarget as React.Ref<HTMLHeadingElement>} tabIndex={-1}>{item.title}</h2>
            <div className={styles.actions}>
              <ProblemFlowTrigger className={styles.cta} subject={item.title}>{item.cta} <span aria-hidden="true">→</span></ProblemFlowTrigger>
              <Link href={item.example.href}>{item.example.label}</Link>
            </div>
            <button type="button" className={styles.back} onClick={() => answer(null)}>← Escolher outra resposta</button>
          </div>
        ) : (
          <div className={styles.question}>
            <h2 id="solutions-title" ref={focusTarget as React.Ref<HTMLHeadingElement>} tabIndex={-1}>Qual problema você quer resolver?</h2>
            <div className={styles.options} role="group" aria-labelledby="solutions-title">
              {solutions.map((option, index) => (
                <button key={option.problem} type="button" onClick={() => answer(index)}>{option.problem}<span aria-hidden="true">→</span></button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
