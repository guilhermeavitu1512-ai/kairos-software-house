import type { Metadata } from "next";
import Link from "next/link";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import { ProcessSection } from "@/components/kairos/ConversionSections";
import styles from "@/components/kairos/ConversionSections.module.css";
export const metadata: Metadata = { title: "Sobre a KAIROS", description: "Sites, sistemas, apps e automações com atendimento direto da KAIROS, do primeiro contato à entrega.", alternates:{canonical:"/sobre"} };
export default function AboutPage() {
  return <main id="conteudo">
    <section className={`${styles.section} ${styles.page}`}><div className={`${styles.shell} ${styles.prose}`}>
      <p className={styles.label}>SITES · SISTEMAS · APPS · AUTOMAÇÕES</p>
      <h1>Você fala diretamente com quem cuida do seu projeto.</h1>
      <p>A KAIROS desenvolve sites para empresas e ferramentas para a rotina do negócio: sistemas, aplicativos e automações.</p>
      <p>O atendimento acontece diretamente com a KAIROS, principalmente pelo WhatsApp, desde a primeira conversa até a entrega. É por ali que você apresenta sua necessidade, tira dúvidas e acompanha o trabalho.</p>
      <h2>O combinado vem antes do desenvolvimento.</h2>
      <p>A proposta define as páginas, funcionalidades, prazo e revisões do projeto. Domínio, hospedagem e serviços de manutenção são tratados separadamente.</p>
      <p>Para conhecer o trabalho, veja as telas e os detalhes dos projetos disponíveis no portfólio.</p>
      <div className={styles.pageActions}><Link className="button" href="/projetos">Ver projetos →</Link><ProblemFlowTrigger className={styles.link}>Contar meu problema →</ProblemFlowTrigger></div>
    </div></section>
    <ProcessSection />
  </main>;
}
