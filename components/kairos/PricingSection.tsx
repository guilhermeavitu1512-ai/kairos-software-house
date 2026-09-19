import { sitePlans, customSolutions } from "@/data/pricing";
import { buildWhatsAppMessageUrl } from "@/lib/constants";
import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";
import styles from "./PricingSection.module.css";

export default function PricingSection() {
  return <section id="precos" className={styles.section} aria-labelledby="pricing-title">
    <div className={styles.shell}>
      <header className={styles.heading}>
        <h2 id="pricing-title">Escolha o ponto de partida.</h2>
        <p>Sites para diferentes momentos do seu negócio.</p>
      </header>

      <div className={styles.plans}>
        {sitePlans.map(plan => <article key={plan.id} className={styles.plan + (plan.id === "business" ? " " + styles.featured : "")} aria-labelledby={"plan-" + plan.id}>
          <h3 id={"plan-" + plan.id}>{plan.name}</h3>
          <p className={styles.price}>
            <span className={styles.installments}>10x de</span>
            <strong>R$ {plan.installment}</strong>
            <span className={styles.upfront}>R$ {plan.upfront} à vista</span>
          </p>
          <p className={styles.description}>{plan.description}</p>
          <ul className={styles.features}>{plan.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
          <a
            className={styles.choose}
            href={buildWhatsAppMessageUrl(`Olá! Conheci a KAIROS pelo site e tenho interesse no ${plan.name}: 10x de R$ ${plan.installment} ou R$ ${plan.upfront} à vista. Gostaria de conversar sobre meu negócio e os próximos passos.`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={plan.cta + " — conversar no WhatsApp"}
          >{plan.cta}<span aria-hidden="true">→</span></a>
        </article>)}
      </div>

      <div className={styles.custom}>
        <h3>Precisa de algo além de um site?</h3>
        <ul className={styles.solutions}>
          {customSolutions.map(solution => <li key={solution}>
            <ProblemFlowTrigger className={styles.solution} aria-label={solution + " — contar meu problema"}>
              <span>{solution}</span>
              <span className={styles.quote}>Sob orçamento <span className={styles.arrow} aria-hidden="true">→</span></span>
            </ProblemFlowTrigger>
          </li>)}
        </ul>
      </div>
    </div>
  </section>;
}
