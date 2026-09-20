import { buildWhatsAppUrl } from "@/lib/constants";
import Reveal from "../Reveal";
import { ProblemFlowTrigger } from "./ProblemFlow";
import styles from "./ProblemFlow.module.css";
export default function FinalContact() {
  return <section className={styles.final} id="briefing" aria-labelledby="final-title"><Reveal className={styles.finalInner}>
    <h2 id="final-title">O que precisa funcionar<br /> melhor no seu negócio?</h2>
    <p>Três perguntas para organizar sua ideia. Você confere o resumo e continua a conversa no WhatsApp.</p>
    <ProblemFlowTrigger className={styles.primary}>Contar meu problema <span aria-hidden="true">→</span></ProblemFlowTrigger>
    <p className={styles.direct}><a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" data-conversion="whatsapp_open" data-source="footer">Prefiro ir direto ao WhatsApp ↗</a></p>
  </Reveal></section>;
}
