import { commonQuestions } from "@/data/site-copy";
import { buildWhatsAppUrl } from "@/lib/constants";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import styles from "./Home.module.css";

export function ActionBand({ title, cta, source }: { title: string; cta: string; source: string }) {
  return (
    <aside className={styles.section} aria-label={title}>
      <div className={`${styles.shell} ${styles.band}`}>
        <div>
          <h2>{title}</h2>
        </div>
        <div className={styles.bandActions}>
          <ProblemFlowTrigger className={styles.bandCta}>{cta} <span aria-hidden="true">→</span></ProblemFlowTrigger>
          <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" data-conversion="whatsapp_open" data-source={source}>Falar no WhatsApp ↗</a>
        </div>
      </div>
    </aside>
  );
}

export function Faq() {
  return (
    <section id="duvidas" className={styles.section} aria-labelledby="faq-title">
      <div className={`${styles.shell} ${styles.faqGrid}`}>
        <header className={styles.head}>
          <p className={styles.kicker}>Dúvidas</p>
          <h2 id="faq-title">Antes de contratar.</h2>
          <a href={buildWhatsAppUrl("tirar uma dúvida antes de contratar")} target="_blank" rel="noopener noreferrer" data-conversion="whatsapp_open" data-source="faq">Perguntar no WhatsApp ↗</a>
        </header>
        <div className={styles.faq}>
          {commonQuestions.map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}
        </div>
      </div>
    </section>
  );
}

export function FinalCall() {
  return (
    <section className={styles.final} aria-labelledby="final-title">
      <h2 id="final-title">O próximo cliente<br />pode ser seu.</h2>
      <ProblemFlowTrigger className={styles.finalCta}>Quero o meu site <span aria-hidden="true">→</span></ProblemFlowTrigger>
      <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" data-conversion="whatsapp_open" data-source="footer">Prefiro ir direto ao WhatsApp ↗</a>
    </section>
  );
}
