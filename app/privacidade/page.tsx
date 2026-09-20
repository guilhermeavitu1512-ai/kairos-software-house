import type { Metadata } from "next";
import { buildWhatsAppUrl } from "@/lib/constants";
import styles from "@/components/kairos/ConversionSections.module.css";
export const metadata: Metadata = { title: "Privacidade", alternates: { canonical: "/privacidade" } };
export default function Privacy() {
  return <main id="conteudo" className={`${styles.section} ${styles.page}`}><div className={`${styles.shell} ${styles.prose}`}>
    <p className={styles.label}>SEUS DADOS</p><h1>Privacidade e contato.</h1>
    <h2>Ao preparar um resumo</h2><p>O formulário pede seu projeto, tipo de negócio e nome. WhatsApp, e-mail e empresa são opcionais. As respostas ficam na memória desta página enquanto ela está aberta; o formulário não as envia a um servidor da KAIROS nem as salva no navegador.</p>
    <h2>Ao continuar no WhatsApp</h2><p>O botão abre o WhatsApp com o resumo no endereço do link. Esse conteúdo é repassado ao serviço para preparar a mensagem, e você decide se quer enviá-la à KAIROS. A conversa passa a seguir também as regras de privacidade do WhatsApp. Compartilhe apenas o necessário para explicar seu projeto.</p>
    <h2>Uso no atendimento</h2><p>As informações que você enviar à KAIROS serão usadas para conversar sobre sua solicitação, preparar a proposta e acompanhar o projeto.</p>
    <h2>Navegação</h2><p>A hospedagem pode processar dados técnicos de acesso, como endereço IP e registros de requisições, para disponibilizar e proteger o site.</p>
    <h2>Dúvidas sobre seus dados</h2><p>Para perguntar sobre o uso das suas informações ou solicitar sua correção ou exclusão, fale diretamente com a KAIROS.</p>
    <a className={styles.link} href={buildWhatsAppUrl("uma dúvida sobre meus dados")} target="_blank" rel="noopener noreferrer">Falar com a KAIROS →</a>
  </div></main>;
}
