import Link from "next/link";
import { problemCards } from "@/data/site-copy";
import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";
import styles from "./ProblemCards.module.css";

export default function ProblemCards() {
  return <section id="o-que-resolvemos" className={styles.section} aria-labelledby="problems-title">
    <div className={styles.shell}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>O QUE RESOLVEMOS</p>
        <h2 id="problems-title">Menos improviso, mais negócio funcionando.</h2>
      </header>
      <ol className={styles.cards}>
        {problemCards.map((card, index) => <li key={card.title} className={styles.card}>
          <span className={styles.number} aria-hidden="true">0{index + 1}</span>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
          <div className={styles.actions}>
            <ProblemFlowTrigger className={styles.cta} subject={card.subject} data-conversion="problem_card" data-source={card.subject}>{card.cta} <span aria-hidden="true">→</span></ProblemFlowTrigger>
            {"example" in card && <Link className={styles.example} href={card.example.href}>{card.example.label}</Link>}
          </div>
        </li>)}
      </ol>
    </div>
  </section>;
}
