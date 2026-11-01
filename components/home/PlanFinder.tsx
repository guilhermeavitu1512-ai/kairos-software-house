"use client";

import { useState } from "react";
import { sitePlans, type PlanId } from "@/data/pricing";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import { Pricing } from "@/components/ui/pricing";
import styles from "./Home.module.css";

const NEEDS: { label: string; plan: PlanId }[] = [
  { label: "Ser encontrado e receber mensagens", plan: "simples" },
  { label: "Receber agendamentos", plan: "agendamento" },
  { label: "Receber pedidos ou vender", plan: "pedidos" },
];

export default function PlanFinder() {
  const [need, setNeed] = useState<PlanId | null>(null);
  return (
    <section id="precos" className={styles.section} aria-labelledby="plans-title">
      <div className={styles.shell}>
        <header className={styles.head}>
          <p className={styles.kicker}>Pacotes</p>
          <h2 id="plans-title">O que o seu negócio precisa fazer?</h2>
        </header>
        <div className={styles.needs} role="group" aria-label="O que você precisa">
          {NEEDS.map((item) => <button key={item.plan} type="button" aria-pressed={need === item.plan} onClick={() => setNeed(item.plan)}>{item.label}</button>)}
        </div>
        <Pricing
          plans={sitePlans}
          highlightId={need ?? "agendamento"}
          badge={need ? "Indicado para você" : "Recomendado"}
          renderAction={(plan, highlighted) => (
            <ProblemFlowTrigger className={styles.planCta} data-highlight={highlighted} subject={`${plan.name}: R$ ${plan.upfront} à vista ou 12x de R$ ${plan.installment}`} data-conversion="plan_contact" data-plan-id={plan.id}>{plan.cta} <span aria-hidden="true">→</span></ProblemFlowTrigger>
          )}
        />
        <p className={styles.planNote}>Sem mensalidade: hospedagem, suporte e até 2 pequenas alterações por mês já estão incluídos. Domínio próprio não incluído.</p>
      </div>
    </section>
  );
}
