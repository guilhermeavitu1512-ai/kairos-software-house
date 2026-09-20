import { buildWhatsAppUrl } from "@/lib/constants";
import Reveal from "../Reveal";
import { ProblemFlowTrigger } from "./ProblemFlow";
import styles from "./ProblemFlow.module.css";
export default function FinalContact() {
  return <section className={styles.final} id="briefing" aria-labelledby="final-title"><Reveal className={styles.finalInner}>
    <h2 id="final-title">Vamos conversar sobre<br /> o que você precisa?</h2>
    <p>Conte um pouco sobre sua empresa e o que quer criar ou melhorar. Não precisa chegar com uma lista de funcionalidades.</p>
    <a className={styles.primary} href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" data-conversion="whatsapp_open" data-source="footer">Conversar no WhatsApp <span aria-hidden="true">→</span></a>
    <p className={styles.direct}><ProblemFlowTrigger>Prefiro preparar um resumo →</ProblemFlowTrigger></p>
  </Reveal></section>;
}
