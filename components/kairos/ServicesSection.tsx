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
          <p>Da apresentação da empresa às ferramentas da operação. Definimos o que construir a partir do seu problema.</p>
        </Reveal>

        <ol className={styles.serviceList}>
          {services.map((service, index) => (
            <li key={service.name}>
              <Reveal>
                <ProblemFlowTrigger className={styles.service} subject={service.name} aria-label={`${service.name} — contar meu problema`}>
                  <span className={styles.index} aria-hidden="true">0{index + 1}</span><div className={styles.serviceCopy}>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <span className={styles.price}>{service.name === "Sites" ? `A partir de R$ ${sitePlans[0].upfront}` : "Sob orçamento"}</span>
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
