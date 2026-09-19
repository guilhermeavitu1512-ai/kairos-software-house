import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";
import { services } from "@/data/services";
import Reveal from "./Reveal";
import styles from "./Capabilities.module.css";

export default function ServicesSection() {
  return (
    <section id="servicos" className={styles.services} aria-labelledby="services-title">
      <div className={`${styles.shell} ${styles.layout}`}>
        <Reveal className={styles.intro}>
          <h2 id="services-title">Serviços</h2>
          <p>Da presença digital à operação. Software na medida do seu negócio.</p>
        </Reveal>

        <ol className={styles.serviceList}>
          {services.map((service) => (
            <li key={service.name}>
              <Reveal>
                <ProblemFlowTrigger className={styles.service} aria-label={`${service.name} — contar meu problema`}>
                  <div className={styles.serviceCopy}>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <span className={styles.price}>{service.name === "Sites" ? "A partir de R$ 400" : "Sob orçamento"}</span>
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
