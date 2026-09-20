import Link from "next/link";
import { commonQuestions, projectSteps } from "@/data/site-copy";
import { buildWhatsAppUrl } from "@/lib/constants";
import styles from "./ConversionSections.module.css";

export function ProcessSection() {
  return <section id="como-funciona" className={styles.section} aria-labelledby="process-title"><div className={`${styles.shell} ${styles.processLayout}`}>
    <header className={styles.heading}><p className={styles.label}>DO PRIMEIRO CONTATO À ENTREGA</p><h2 id="process-title">Como seu projeto sai do papel.</h2><p>Você acompanha o trabalho e fala diretamente com a KAIROS pelo WhatsApp.</p></header>
    <ol className={styles.steps}>{projectSteps.map((step,index)=><li key={step.title}><span className={styles.number}>0{index+1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
  </div></section>;
}

export function AboutSection() {
  return <section id="quem-somos" className={styles.section} aria-labelledby="about-title"><div className={`${styles.shell} ${styles.about}`}>
    <div><p className={styles.label}>SOBRE A KAIROS</p><h2 id="about-title">Atendimento direto, do começo à entrega.</h2></div>
    <div><p>Entendemos o problema, definimos o que precisa ser construído e desenvolvemos sites, sistemas, apps e automações.</p><p>O atendimento é direto com a KAIROS. Você acompanha o desenvolvimento e alinha as decisões pelo WhatsApp.</p><Link className={styles.link} href="/sobre">Conhecer a KAIROS <span aria-hidden="true">→</span></Link></div>
  </div></section>;
}

export function FaqSection() {
  return <section id="duvidas" className={styles.section} aria-labelledby="faq-title"><div className={`${styles.shell} ${styles.faqLayout}`}>
    <header className={styles.heading}><h2 id="faq-title">Antes de contratar.</h2><p>As respostas para as dúvidas sobre prazos, pagamento e entrega.</p></header>
    <div className={styles.faq}>{commonQuestions.map(item=><details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
    <a className={styles.link} href={buildWhatsAppUrl("tirar uma dúvida antes de contratar")} target="_blank" rel="noopener noreferrer" data-conversion="whatsapp_open" data-source="faq">Prefiro tirar uma dúvida no WhatsApp <span aria-hidden="true">→</span></a>
  </div></section>;
}
