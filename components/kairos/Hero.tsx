import HeroContent from "./HeroContent";
import HeroStage from "./HeroStage";
import HeroArchitecture from "./HeroArchitecture";
import HeroAurora from "./HeroAurora";
import styles from "./Hero.module.css";

export default function Hero() {
  return <section className={styles.hero} id="inicio" aria-labelledby="hero-title">
    <HeroStage>
      <HeroAurora />
      <HeroArchitecture />
      <div className={styles.inner} data-hero-exit><HeroContent /></div>
    </HeroStage>
  </section>;
}
