import HeroActions from "./HeroActions";
import styles from "./Hero.module.css";

export default function HeroContent() {
  return <div className={styles.content}>
    <p className={styles.eyebrow} data-hero-label>SITES · SISTEMAS · APPS · AUTOMAÇÕES</p>
    <h1 id="hero-title" className={styles.title} data-hero-title>Da presença digital aos processos que <span className={styles.accent}>movem seu negócio.</span></h1>
    <p className={styles.description} data-hero-support><span data-hero-support-exit>Criamos sites, sistemas, apps e automações para transformar ideias, experiências e processos em soluções digitais bem construídas.</span></p>
    <HeroActions />
  </div>;
}
