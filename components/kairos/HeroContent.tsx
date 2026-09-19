import HeroActions from "./HeroActions";
import styles from "./Hero.module.css";

export default function HeroContent() {
  return <div className={styles.content}>
    <p className={styles.eyebrow} data-hero-label>SITES · SISTEMAS · APPS · AUTOMAÇÕES</p>
    <h1 id="hero-title" className={styles.title} data-hero-title><span data-hero-word>Ainda</span>{" "}<span data-hero-word>depende</span>{" "}<span data-hero-word>de</span><br className={styles.desktopBreak} />{" "}<span data-hero-word data-hero-accent><span className={styles.accent}>WhatsApp</span>,</span>{" "}<span data-hero-word>caderno</span><br className={styles.desktopBreak} />{" "}<span data-hero-word>e</span>{" "}<span data-hero-word>planilhas?</span></h1>
    <p className={styles.description} data-hero-support><span data-hero-support-exit>Criamos sites, sistemas, apps e automações para transformar ideias, experiências e processos em soluções digitais bem construídas.</span></p>
    <HeroActions />
  </div>;
}
