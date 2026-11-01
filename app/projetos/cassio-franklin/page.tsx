import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import styles from "../barbearia-tony/page.module.css";
const description = "Projeto de demonstração: site e agenda online para barbearia: escolha de barbeiro, serviço e horário, sem criar conta e sem esperar resposta no WhatsApp.";
export const metadata: Metadata = { title: "Cássio Franklin — projeto de demonstração", description, alternates: { canonical: "/projetos/cassio-franklin" }, openGraph: { title: "Cássio Franklin — KAIROS", description, images: [{ url: "/portfolio/cassio/home-1440.webp", width: 1440, height: 900, alt: "Página inicial da barbearia Cássio Franklin" }] } };
export default function CassioCase() {
 return <main id="conteudo" className={styles.page}><div className={styles.shell}>
  <Link href="/projetos" className={styles.back}>← Ver projetos</Link>
  <header className={styles.header}><div><p className={styles.eyebrow}>PROJETO DE DEMONSTRAÇÃO · KAIROS</p><h1>Cássio Franklin<span>Seu degradê, na régua.</span></h1></div><div><p>Um site para barbearia em que o cliente marca sozinho, a qualquer hora: escolhe o barbeiro, o serviço e um horário livre, sem criar conta.</p><p className={styles.note}>Projeto de demonstração da KAIROS, não um cliente. Preços e fotos são exemplos, para apresentação.</p><a className={styles.link} href="https://cassiofranklin.vercel.app/" target="_blank" rel="noopener noreferrer">Abrir o site publicado ↗</a></div></header>
  <figure className={styles.screen}><Image unoptimized src="/portfolio/cassio/home-1440.webp" alt="Página inicial da barbearia Cássio Franklin com o título Seu degradê, na régua" width={1440} height={900} priority sizes="(max-width:760px) 100vw, 1232px"/><figcaption>01 / Abertura com acesso direto ao agendamento.</figcaption></figure>
  <section className={styles.story} aria-label="Decisões do projeto">{[
   ["Problema", "Agenda presa no WhatsApp", "Em muitas barbearias, cada horário depende de uma conversa. Com a porta fechada, o cliente fica sem resposta."],
   ["Decisão", "Agendar em 3 passos", "Sem cadastro: o cliente escolhe o barbeiro, o corte e o horário, vendo preço e duração de cada serviço."],
   ["Solução", "Agenda aberta o tempo todo", "Só aparecem horários livres, o barbeiro confirma pelo painel e o cliente acompanha a confirmação na própria tela."]
  ].map(([label,title,text])=><div key={label}><p className={styles.eyebrow}>{label}</p><h2>{title}</h2><p>{text}</p></div>)}</section>
  <section className={styles.product}><div className={styles.sectionHead}><p className={styles.eyebrow}>POR DENTRO DO SITE</p><h2>Marcar leva poucos toques.</h2><p>O agendamento começa pela escolha do barbeiro, ou pelo primeiro horário livre da equipe.</p></div>
   <figure className={styles.screen}><Image unoptimized src="/portfolio/cassio/agenda-1440.webp" alt="Primeira etapa do agendamento, com a escolha do barbeiro" width={1440} height={900} sizes="(max-width:760px) 100vw, 1232px"/><figcaption>02 / Primeira etapa do agendamento.</figcaption></figure>
  </section>
  <section className={styles.mobile}><div><p className={styles.eyebrow}>NO CELULAR</p><h2>A barbearia<br/>no bolso do cliente.</h2><p>O site pode ser instalado no celular e reúne preços, galeria, localização com rota no mapa e equipe.</p></div><div className={styles.phones}><Image unoptimized src="/portfolio/cassio/agenda-390.webp" alt="Agendamento da barbearia Cássio Franklin no celular" width={780} height={1688} sizes="(max-width:760px) 44vw, 280px"/></div></section>
  <section className={styles.closing}><div><p className={styles.eyebrow}>QUER UMA AGENDA ASSIM?</p><h2>Vamos abrir<br/>a sua agenda.</h2><p>Funcionalidades e condições comerciais são definidas em uma proposta própria.</p></div><ProblemFlowTrigger className={styles.button} subject="Um site com agenda online inspirado na Cássio Franklin">Pedir orçamento <span aria-hidden="true">↗</span></ProblemFlowTrigger></section>
 </div></main>;
}
