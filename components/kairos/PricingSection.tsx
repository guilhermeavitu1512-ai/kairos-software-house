import { sitePlans, customSolutions } from "@/data/pricing";
import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";
import styles from "./PricingSection.module.css";

export default function PricingSection() {
  return <section id="precos" className={styles.section} aria-labelledby="pricing-title">
    <div className={styles.shell}>
      <header className={styles.heading}>
        <h2 id="pricing-title">Planos para criar seu site.</h2>
        <p>Uma página de apresentação ou um site com mais conteúdo. Compare o espaço e as revisões de cada plano.</p>
      </header>

      <div className={styles.plans}>
        {sitePlans.map(plan => <article key={plan.id} data-plan={plan.id} className={styles.plan + (plan.id === "business" ? " " + styles.featured : "")} aria-labelledby={"plan-" + plan.id}>
          <h3 id={"plan-" + plan.id}>{plan.name}</h3>
          <p className={styles.price}>
            <span className={styles.installments}>10x de</span>
            <strong>R$ {plan.installment}</strong>
            <span className={styles.upfront}>R$ {plan.upfront} à vista</span>
          </p>
          <p className={styles.description}>{plan.description}</p>
          <p className={styles.scope}>{plan.pages}<span aria-hidden="true"> · </span>{plan.revisions}</p>
          <p className={styles.delivery}><span>Prazo</span>{" "}{plan.delivery}{plan.id === "essencial" && <small>{" "}Após receber todo o conteúdo necessário.</small>}</p>
          <ul className={styles.features}>{plan.features.slice(2).map(feature => <li key={feature}>{feature}</li>)}</ul>
          <ProblemFlowTrigger
            className={styles.choose}
            subject={`${plan.name} — R$ ${plan.upfront} ou 10x de R$ ${plan.installment}`}
            aria-label={`Contar meu problema — ${plan.name}`}
            data-conversion="plan_contact" data-plan-id={plan.id}
          >Contar meu problema<span aria-hidden="true">→</span></ProblemFlowTrigger>
        </article>)}
      </div>

      <div className={styles.terms}><p><strong>Criação do site em até 10 parcelas.</strong> Sem mensalidade obrigatória da KAIROS.</p><p>Domínio e hospedagem não estão incluídos. Você pode contratar seu provedor e pedir auxílio à KAIROS na configuração. Páginas, recursos, cronograma e eventuais serviços adicionais são detalhados na proposta.</p><a href="#duvidas">Tirar dúvidas sobre os planos →</a></div>

      <div className={styles.custom}>
        <h3>Precisa de algo além de um site?</h3>
        <ul className={styles.solutions}>
          {customSolutions.map(solution => <li key={solution}>
            <ProblemFlowTrigger className={styles.solution} subject={solution} aria-label={solution + " — contar meu problema"}>
              <span>{solution}</span>
              <span className={styles.quote}>Contar meu problema <span className={styles.arrow} aria-hidden="true">→</span></span>
            </ProblemFlowTrigger>
          </li>)}
        </ul>
      </div>
    </div>
  </section>;
}
