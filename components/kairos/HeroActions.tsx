import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";
import styles from "./Hero.module.css";

export default function HeroActions() {
  return <div className={styles.actionGroup} data-hero-actions>
    <div className={styles.actions} data-hero-action-exit>
      <ProblemFlowTrigger className={styles.primary}>Contar meu problema <span aria-hidden="true">→</span></ProblemFlowTrigger>
      <a className={styles.secondary} href="#projetos">Ver projetos</a>
    </div>
  </div>;
}
