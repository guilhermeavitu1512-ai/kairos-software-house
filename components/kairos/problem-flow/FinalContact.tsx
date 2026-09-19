"use client";

import { buildWhatsAppMessageUrl } from "@/lib/constants";
import Reveal from "../Reveal";
import { ProblemFlowTrigger } from "./ProblemFlow";
import { hasCompanyWhatsApp } from "./WhatsAppAction";
import styles from "./ProblemFlow.module.css";

export default function FinalContact() {
  return <section className={styles.final} id="briefing" aria-labelledby="final-title">
    <Reveal className={styles.finalInner}>
      <h2 id="final-title">Mostre onde o<br /> processo trava.</h2>
      <p>Você não precisa saber qual sistema precisa.</p>
      <ProblemFlowTrigger className={styles.primary}>Contar meu problema <span aria-hidden="true">→</span></ProblemFlowTrigger>
      {hasCompanyWhatsApp() && <p className={styles.direct}>Prefere falar direto? <a href={buildWhatsAppMessageUrl("Olá! Conheci a KAIROS pelo site e queria conversar sobre um problema no meu negócio.")} target="_blank" rel="noopener noreferrer">WhatsApp →</a></p>}
    </Reveal>
  </section>;
}
