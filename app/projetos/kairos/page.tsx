import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import styles from "@/components/kairos/ConversionSections.module.css";
export const metadata: Metadata = { title: "KAIROS — projeto autoral", description: "As decisões de conteúdo, navegação e movimento do site da KAIROS.", alternates: { canonical: "/projetos/kairos" } };
export default function KairosCase() {
 return <main id="conteudo" className={`${styles.section} ${styles.page}`}><div className={styles.shell}>
  <Link className={styles.link} href="/projetos">← Ver projetos</Link>
  <header className={styles.prose}><p className={styles.label}>PROJETO AUTORAL · SITE DA KAIROS</p><h1>Do que fazemos ao que você precisa.</h1><p>O próprio site da KAIROS reúne presença digital, sistemas, apps e automações em uma apresentação com planos e um caminho para explicar o projeto.</p></header>
  <figure className={styles.caseImage}><Image src="/portfolio/kairos-current.png" alt="Página inicial da KAIROS" width={1440} height={1000} sizes="(max-width:760px) 100vw, 1232px" priority /><figcaption>Abertura e navegação do site.</figcaption></figure>
  <div className={styles.caseNotes}>{[
   ["Problema", "Apresentar serviços diferentes sem perder clareza sobre o que pode ser contratado como plano de site e o que precisa de orçamento próprio."],
   ["Direção", "Uma abertura de maior impacto, seguida por projetos, serviços, planos e respostas às dúvidas de contratação."],
   ["Arquitetura", "Páginas em Next.js e componentes React, com dados de planos e perguntas frequentes compartilhados para manter as condições consistentes."],
   ["Movimento", "Transições da seção Memphis acompanham a rolagem. Há uma alternativa em SVG e suporte à preferência por movimento reduzido."],
   ["Entrega", "Portfólio, comparação de planos e resumo em três etapas. O visitante revisa a mensagem antes de continuar no WhatsApp."]
  ].map(([title,text])=><section key={title}><h2>{title}</h2><p>{text}</p></section>)}</div>
  <ProblemFlowTrigger className={styles.link}>Contar meu problema →</ProblemFlowTrigger>
 </div></main>;
}
