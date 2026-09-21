import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import styles from "./page.module.css";
const description = "Projeto autoral da KAIROS: site e sistema de agendamento para barbearias, com escolha de profissional, serviços e horários.";
export const metadata: Metadata = { title: "Tony Barber — projeto autoral", description, alternates: { canonical: "/projetos/barbearia-tony" }, openGraph: { title: "Tony Barber — KAIROS Lab", description, images: [{ url: "/portfolio/tony/home-1440.png", width:1440, height:1000, alt: "Página inicial da Tony Barber" }] } };
export default function TonyCase() {
 return <main id="conteudo" className={styles.page}><div className={styles.shell}>
  <Link href="/projetos" className={styles.back}>← Ver projetos</Link>
  <header className={styles.header}><div><p className={styles.eyebrow}>PROJETO AUTORAL · KAIROS LAB</p><h1>Tony Barber<span>Da vitrine à agenda.</span></h1></div><div><p>Uma presença digital para apresentar a barbearia e um fluxo para escolher profissional, serviço e horário.</p><p className={styles.note}>Desenvolvido por iniciativa da KAIROS, com intenção de comercialização futura.</p><a className={styles.link} href="https://tonybarber.vercel.app/" target="_blank" rel="noopener noreferrer">Explorar o projeto publicado ↗</a></div></header>
  <figure className={styles.screen}><Image src="/portfolio/tony/home-1440.png" alt="Página inicial da Tony Barber com identidade escura, detalhes laranja e acesso ao agendamento" width={1440} height={1000} priority sizes="(max-width:760px) 100vw, 1232px"/><figcaption>01 / Apresentação da barbearia e entrada para o agendamento.</figcaption></figure>
  <section className={styles.story} aria-label="Decisões do projeto">{[
   ["Problema", "Unir apresentação e agendamento", "O projeto explora como uma barbearia pode apresentar seu trabalho e organizar o caminho até a escolha de um horário."],
   ["Decisão", "Uma escolha por etapa", "O agendamento é dividido em profissional, serviços, horário e dados. A pessoa acompanha em que ponto do processo está."],
   ["Solução", "O site como entrada para o sistema", "A página pública conecta apresentação, profissionais e agendamento, com uma experiência adaptada ao computador e ao celular."]
  ].map(([label,title,text])=><div key={label}><p className={styles.eyebrow}>{label}</p><h2>{title}</h2><p>{text}</p></div>)}</section>
  <section className={styles.product}><div className={styles.sectionHead}><p className={styles.eyebrow}>POR DENTRO DO PRODUTO</p><h2>O próximo passo fica à vista.</h2><p>O indicador de etapas acompanha as escolhas. A seleção começa pelo profissional e segue para os serviços disponíveis.</p></div>
   <figure className={styles.screen}><Image src="/portfolio/tony/booking-1440.png" alt="Agendamento da Tony Barber: primeira etapa com seleção de profissional e indicador de quatro etapas" width={1440} height={1000} sizes="(max-width:760px) 100vw, 1232px"/><figcaption>02 / Seleção de profissional na interface publicada.</figcaption></figure>
  </section>
  <section className={styles.mobile}><div><p className={styles.eyebrow}>NO CELULAR</p><h2>Da descoberta<br/>à escolha.</h2><p>Apresentação e agendamento em telas menores, com ações acessíveis por toque e navegação em etapas.</p><dl className={styles.stack}><div><dt>Interface</dt><dd>React · TypeScript · Vite</dd></div><div><dt>Dados e autenticação</dt><dd>Firebase</dd></div><div><dt>Categoria</dt><dd>Site + sistema de agendamento</dd></div></dl></div><div className={styles.phones}><Image src="/portfolio/tony/home-390.png" alt="Página inicial da Tony Barber no celular" width={390} height={1000} sizes="(max-width:760px) 44vw, 280px"/><Image src="/portfolio/tony/booking-390.png" alt="Seleção de profissional da Tony Barber no celular" width={390} height={1000} sizes="(max-width:760px) 44vw, 280px"/></div></section>
  <section className={styles.closing}><div><p className={styles.eyebrow}>UM PROJETO COM ESSA DIREÇÃO?</p><h2>Vamos entender<br/>a sua operação.</h2><p>Adaptações, funcionalidades e condições comerciais são definidas em uma proposta própria.</p></div><ProblemFlowTrigger className={styles.button} subject="Um sistema para barbearia inspirado na Tony Barber">Contar meu problema <span aria-hidden="true">↗</span></ProblemFlowTrigger></section>
 </div></main>;
}
