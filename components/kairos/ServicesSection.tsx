import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";
import { services } from "@/data/services";
import { sitePlans } from "@/data/pricing";
import Reveal from "./Reveal";
import styles from "./Capabilities.module.css";

export default function ServicesSection() {
  return (
    <section id="servicos" className={styles.services} aria-labelledby="services-title">
      <div className={`${styles.shell} ${styles.layout}`}>
        <Reveal className={styles.intro}>
          <h2 id="services-title">O que você precisa criar?</h2>
          <p>Um site para seus clientes conhecerem a empresa ou uma ferramenta para o trabalho do dia a dia. Cada serviço tem seu próprio escopo.</p>
        </Reveal>

        <ol className={styles.serviceList}>
          {services.map((service) => (
            <li key={service.name}>
              <Reveal>
                <ProblemFlowTrigger className={styles.service} aria-label={`${service.name} — solicitar orçamento`}>
                  <div className={styles.serviceCopy}>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <span className={styles.price}>{service.name === "Sites" ? `A partir de R$ ${sitePlans[0].upfront}` : "Solicitar orçamento"}</span>
                  </div>
                  <span className={styles.arrow} aria-hidden="true">→</span>
                </ProblemFlowTrigger>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
