import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import styles from "../barbearia-tony/page.module.css";
const description = "Projeto de demonstração: loja de roupas com arara interativa, ateliê de peças personalizadas, guia de tamanhos e pedido pelo WhatsApp.";
export const metadata: Metadata = { title: "ARARA — projeto de demonstração", description, alternates: { canonical: "/projetos/arara" }, openGraph: { title: "ARARA — KAIROS", description, images: [{ url: "/portfolio/arara/home-1440.webp", width: 1440, height: 900, alt: "Página inicial da loja de roupas ARARA" }] } };
export default function AraraCase() {
 return <main id="conteudo" className={styles.page}><div className={styles.shell}>
  <Link href="/projetos" className={styles.back}>← Ver projetos</Link>
  <header className={styles.header}><div><p className={styles.eyebrow}>PROJETO DE DEMONSTRAÇÃO · KAIROS</p><h1>ARARA<span>Feita para usar.</span></h1></div><div><p>Uma loja de roupas em que o cliente mexe nas peças como em uma arara de verdade, cria a própria camiseta ou moletom e compra pelo site ou pelo WhatsApp.</p><p className={styles.note}>Projeto de demonstração da KAIROS, não um cliente. Marca, peças, fotos e preços são exemplos, para apresentação. Nenhum pedido é cobrado.</p><a className={styles.link} href="https://arara-roupas.vercel.app/" target="_blank" rel="noopener noreferrer">Abrir o site publicado ↗</a></div></header>
  <figure className={styles.screen}><Image unoptimized src="/portfolio/arara/home-1440.webp" alt="Página inicial da loja ARARA com foto grande e título" width={1440} height={900} priority sizes="(max-width:760px) 100vw, 1232px"/><figcaption>01 / Capa com fotos passando, depois da intro.</figcaption></figure>
  <section className={styles.story} aria-label="Decisões do projeto">{[
   ["Problema", "Loja on-line parece igual a todas", "Grades de produto não mostram a roupa de perto, e quem compra pelo celular fica em dúvida sobre o tamanho."],
   ["Decisão", "Fazer a pessoa mexer na roupa", "A intro e a arara transformam a vitrine em experiência: as peças balançam, giram e abrem de perto."],
   ["Solução", "Do interesse ao pedido", "Página de cada peça, guia de tamanhos, sacola, finalização em etapas e pedido pronto no WhatsApp."]
  ].map(([label,title,text])=><div key={label}><p className={styles.eyebrow}>{label}</p><h2>{title}</h2><p>{text}</p></div>)}</section>
  <section className={styles.product}><div className={styles.sectionHead}><p className={styles.eyebrow}>POR DENTRO DO SITE</p><h2>Uma arara na própria página.</h2><p>O cliente desliza os cabides, vê cada peça de frente e escolhe o tamanho sem sair da vitrine.</p></div>
   <figure className={styles.screen}><Image unoptimized src="/portfolio/arara/arara-1440.webp" alt="Arara interativa com camisetas coloridas em cabides" width={1440} height={900} sizes="(max-width:760px) 100vw, 1232px"/><figcaption>02 / Arara interativa, logo abaixo da capa.</figcaption></figure>
   <figure className={styles.screen}><Image unoptimized src="/portfolio/arara/atelie-1440.webp" alt="Ateliê com escolha de modelo, tecido, linha e bordado" width={1440} height={900} sizes="(max-width:760px) 100vw, 1232px"/><figcaption>03 / Ateliê: a peça muda na hora, com bordado no peito.</figcaption></figure>
   <figure className={styles.screen}><Image unoptimized src="/portfolio/arara/produto-1440.webp" alt="Página de produto com galeria, cores e tamanhos" width={1440} height={900} sizes="(max-width:760px) 100vw, 1232px"/><figcaption>04 / Página de produto com cores, tamanhos e guia de medidas.</figcaption></figure>
  </section>
  <section className={styles.mobile}><div><p className={styles.eyebrow}>NO CELULAR</p><h2>A loja inteira<br/>na mão do cliente.</h2><p>A arara vira um carrossel para deslizar com o dedo, e o pedido pode terminar no WhatsApp da loja.</p></div><div className={styles.phones}><Image unoptimized src="/portfolio/arara/celular-390.webp" alt="Arara da loja ARARA no celular" width={780} height={1688} sizes="(max-width:760px) 44vw, 280px"/></div></section>
  <section className={styles.closing}><div><p className={styles.eyebrow}>TEM UMA MARCA DE ROUPAS?</p><h2>Vamos abrir<br/>a sua loja.</h2><p>Funcionalidades e condições comerciais são definidas em uma proposta própria.</p></div><ProblemFlowTrigger className={styles.button} subject="Uma loja de roupas inspirada na ARARA">Pedir orçamento <span aria-hidden="true">↗</span></ProblemFlowTrigger></section>
 </div></main>;
}
