import Link from "next/link";
import { solutions } from "@/data/site-copy";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import styles from "./Home.module.css";

export default function Solutions() {
  return (
    <section id="solucoes" className={styles.section} aria-labelledby="solutions-title">
      <div className={styles.shell}>
        <header className={styles.head}>
          <p className={styles.kicker}>Soluções</p>
          <h2 id="solutions-title">Qual problema você quer resolver?</h2>
          <p>Não vendemos código. Resolvemos o que atrasa o seu negócio.</p>
        </header>
        <div className={styles.solutions}>
          {solutions.map((item) => (
            <article key={item.title} className={styles.solution}>
              <p className={styles.solutionPain}>{item.problem}</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className={styles.solutionActions}>
                <ProblemFlowTrigger className={styles.solutionCta} subject={item.title}>{item.cta} <span aria-hidden="true">→</span></ProblemFlowTrigger>
                <Link href={item.example.href}>{item.example.label}</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
