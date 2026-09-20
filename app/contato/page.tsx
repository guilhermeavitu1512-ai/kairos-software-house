import type { Metadata } from "next";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import { buildWhatsAppUrl } from "@/lib/constants";
import styles from "@/components/kairos/ConversionSections.module.css";
export const metadata: Metadata = { title: "Converse sobre seu projeto", description: "Fale diretamente com a KAIROS pelo WhatsApp sobre seu site, sistema ou aplicativo.", alternates:{canonical:"/contato"} };
export default function ContactPage() {
  return <main id="conteudo"><section className={`${styles.section} ${styles.page}`}><div className={`${styles.shell} ${styles.prose}`}>
    <p className={styles.label}>ATENDIMENTO DIRETO PELO WHATSAPP</p><h1>O que você quer criar ou melhorar?</h1>
    <p>Conte um pouco sobre sua empresa e o que precisa. Pode ser um site novo, uma ideia de aplicativo ou uma tarefa que dá trabalho todos os dias.</p>
    <p>Você não precisa chegar com uma lista de funcionalidades. A conversa serve para entender o projeto e definir o que entra na proposta.</p>
    <div className={styles.pageActions}><ProblemFlowTrigger className="button">Contar meu problema →</ProblemFlowTrigger><a className={styles.link} href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" data-conversion="whatsapp_open" data-source="contact">Prefiro ir direto ao WhatsApp ↗</a></div>
    <p>Ao escolher o resumo, você responde três perguntas e confere a mensagem antes de enviá-la no WhatsApp.</p>
  </div></section></main>;
}
