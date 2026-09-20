import HeroActions from "./HeroActions";
import styles from "./Hero.module.css";

export default function HeroContent() {
  return <div className={styles.content}>
    <p className={styles.eyebrow} data-hero-label>CRIAÇÃO DE SITES · SISTEMAS · AUTOMAÇÕES</p>
    <h1 id="hero-title" className={styles.title} data-hero-title>Um site para o cliente conhecer seu trabalho e <span className={styles.accent}>pedir um orçamento.</span></h1>
    <p className={styles.description} data-hero-support><span data-hero-support-exit>Apresente seus serviços, esclareça dúvidas e facilite o contato com sua empresa. A KAIROS cuida do desenvolvimento do seu site.</span></p>
    <p className={styles.support}>Precisa organizar pedidos, agendamentos ou tarefas internas? Também criamos sistemas e automações sob medida.</p>
    <HeroActions />
  </div>;
}
