import Reveal from "./Reveal";
import styles from "./Capabilities.module.css";

const pillars = [
  { title: "Estrutura", description: "Projeto organizado e preparado para evoluir." },
  { title: "Segurança", description: "Boas práticas e configurações essenciais." },
  { title: "Autonomia", description: "Quando o projeto inclui painel, você altera o conteúdo sem código." },
  { title: "Domínio e hospedagem", description: "Configuração e gerenciamento conforme a contratação." },
];

export default function AfterDelivery() {
  return (
    <section className={styles.delivery} aria-labelledby="delivery-title">
      <div className={`${styles.shell} ${styles.layout} ${styles.deliveryLayout}`}>
        <Reveal className={`${styles.intro} ${styles.deliveryIntro}`}>
          <p className={styles.eyebrow}>Depois da entrega</p>
          <h2 id="delivery-title">Você continua no controle.</h2>
        </Reveal>
        <Reveal className={styles.pillarsReveal}>
          <dl className={styles.pillars}>
            {pillars.map((pillar) => (
              <div key={pillar.title}>
                <dt>{pillar.title}</dt>
                <dd>{pillar.description}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
