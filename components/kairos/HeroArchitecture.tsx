import Image from "next/image";
import styles from "./Hero.module.css";

export default function HeroArchitecture() {
  return <div className={styles.architecture} aria-hidden="true" data-hero-architecture>
    <div className={`${styles.echo} ${styles.echoLeft}`}><div className={styles.depth} data-depth="0.055"><div className={styles.echoPlate} /></div></div>
    <div className={`${styles.echo} ${styles.echoRight}`}><div className={styles.depth} data-depth="0.085"><div className={styles.echoPlate} /></div></div>
    <div className={`${styles.plateSlot} ${styles.left}`} data-hero-parallax>
      <div className={styles.depth} data-depth="0.17"><div className={styles.entranceLayer} data-hero-enter="left"><div className={styles.plateDrift}><div className={styles.plate}><span className={styles.highlight} /></div></div></div></div>
    </div>
    <div className={`${styles.plateSlot} ${styles.right}`} data-hero-parallax>
      <div className={styles.depth} data-depth="0.23"><div className={styles.entranceLayer} data-hero-enter="right"><div className={styles.plateDrift}><div className={styles.plate}><span className={styles.highlight} /></div></div></div></div>
    </div>
    <div className={styles.foreground} data-hero-foreground>
      <div className={styles.depth} data-depth="-0.3"><div className={styles.entranceLayer} data-hero-enter="surface"><Image src="/hero/forged-surface.webp" alt="" width={1536} height={512} sizes="100vw" loading="lazy" fetchPriority="low" className={styles.surface} /></div></div>
    </div>
  </div>;
}
