import { sitePlans } from "@/data/pricing";
import HeroDemo from "./HeroDemo";
import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";
import styles from "./HeroLive.module.css";

const capabilities = ["Sites institucionais", "Landing pages", "Agendamento online", "Catálogos", "Painéis de gestão", "Bots de WhatsApp", "Integrações", "Aplicativos"];

export default function Hero() {
  const entry = sitePlans[0];
  return <section className={styles.hero} id="inicio" aria-labelledby="hero-title">
    <div className={styles.backdrop} aria-hidden="true"><div className={styles.grid} /><div className={styles.glowA} /><div className={styles.glowB} /></div>
    <div className={styles.inner}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}><span className={styles.pulse} aria-hidden="true" />Sites · Sistemas · Apps · Automações</p>
        <h1 id="hero-title">Seu negócio funcionando, <span>mesmo quando você não está.</span></h1>
        <p className={styles.lead}>Criamos sites, agendas online e automações sob medida para seu cliente encontrar, contratar e marcar horário sem depender de você.</p>
        <div className={styles.actions}>
          <ProblemFlowTrigger className={styles.primary}>Pedir orçamento <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></ProblemFlowTrigger>
          <a className={styles.secondary} href="#projetos">Ver projetos</a>
        </div>
        <dl className={styles.proof}>
          <div><dt>Sites a partir de</dt><dd>R$ {entry.upfront}<small>ou 10x de R$ {entry.installment}</small></dd></div>
          <div><dt>Site Essencial</dt><dd>{entry.delivery}</dd></div>
          <div><dt>Atendimento</dt><dd>Direto no WhatsApp</dd></div>
        </dl>
      </div>
      <HeroDemo />
    </div>
    <div className={styles.marquee} aria-label="O que desenvolvemos">
      <ul className={styles.track}>
        {[...capabilities, ...capabilities].map((item, index) => <li key={index} aria-hidden={index >= capabilities.length || undefined}>{item}</li>)}
      </ul>
    </div>
  </section>;
}
