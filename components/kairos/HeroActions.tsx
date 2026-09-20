import { buildWhatsAppUrl } from "@/lib/constants";
import styles from "./Hero.module.css";

export default function HeroActions() {
  return <div className={styles.actionGroup} data-hero-actions>
    <div className={styles.actions} data-hero-action-exit>
      <a className={styles.primary} href="#precos" data-conversion="view_plans">Ver planos de sites <span aria-hidden="true">→</span></a>
      <a className={styles.secondary} href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" data-conversion="whatsapp_open" data-source="hero">Conversar sobre meu projeto</a>
    </div>
  </div>;
}
