import styles from "./Hero.module.css";
import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";

export default function HeroActions() {
  return <div className={styles.actionGroup} data-hero-actions>
    <div className={styles.actions} data-hero-action-exit>
      <ProblemFlowTrigger className={styles.primary}>Contar meu problema <span aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></span></ProblemFlowTrigger>
    </div>
  </div>;
}
