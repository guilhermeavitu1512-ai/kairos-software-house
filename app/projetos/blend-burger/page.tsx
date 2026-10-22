import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import styles from "../barbearia-tony/page.module.css";
const description = "Projeto autoral da KAIROS: site e cardápio digital para hamburgueria, com vitrine dos burgers, ingredientes e pedido online.";
export const metadata: Metadata = { title: "Blend Burger — projeto autoral", description, alternates: { canonical: "/projetos/blend-burger" }, openGraph: { title: "Blend Burger — KAIROS Lab", description, images: [{ url: "/portfolio/blend/home-1440.png", width: 1440, height: 900, alt: "Página inicial da Blend Burger" }] } };
export default function BlendCase() {
 return <main id="conteudo" className={styles.page}><div className={styles.shell}>
  <Link href="/projetos" className={styles.back}>← Ver projetos</Link>
  <header className={styles.header}><div><p className={styles.eyebrow}>PROJETO AUTORAL · KAIROS LAB</p><h1>Blend Burger<span>Feito para dar vontade.</span></h1></div><div><p>Um site de hamburgueria que abre o apetite antes do cardápio: vitrine dos burgers, ingredientes camada por camada e um caminho direto até o pedido.</p><p className={styles.note}>Desenvolvido por iniciativa da KAIROS como projeto de portfólio. Nomes, preços e dados da loja são ilustrativos, e as fotografias foram geradas por IA.</p><a className={styles.link} href="https://blend-burger-mocha.vercel.app/" target="_blank" rel="noopener noreferrer">Explorar o projeto publicado ↗</a></div></header>
  <figure className={styles.screen}><Image src="/portfolio/blend/home-1440.png" alt="Página inicial da Blend Burger com o título Feito para dar vontade e a foto de um hambúrguer duplo" width={1440} height={900} priority sizes="(max-width:760px) 100vw, 1232px"/><figcaption>01 / Abertura com destaque rotativo e acesso direto ao pedido.</figcaption></figure>
  <section className={styles.story} aria-label="Decisões do projeto">{[
   ["Problema", "Fazer a foto vender", "Em hamburgueria, a decisão acontece pelos olhos. O site precisava mostrar o produto grande, sem distrações, e levar ao pedido em poucos toques."],
   ["Decisão", "Produto como protagonista", "Tipografia forte, fundo escuro e fotos recortadas com transparência real. Cada seção apresenta um motivo para pedir: os favoritos, os ingredientes e o pedido."],
   ["Solução", "Do desejo ao carrinho", "Cardápio digital com personalização dos itens, delivery ou retirada, consulta de endereço por CEP e acompanhamento do pedido por link."]
  ].map(([label,title,text])=><div key={label}><p className={styles.eyebrow}>{label}</p><h2>{title}</h2><p>{text}</p></div>)}</section>
  <section className={styles.product}><div className={styles.sectionHead}><p className={styles.eyebrow}>POR DENTRO DO SITE</p><h2>Um blend para cada vontade.</h2><p>Os três burgers da casa aparecem lado a lado, com o que vai em cada um. Logo depois, os ingredientes são apresentados camada por camada.</p></div>
   <figure className={styles.screen}><Image src="/portfolio/blend/destaques-1440.png" alt="Seção Escolha o seu Blend com três hambúrgueres: Blend Original, Double Blend e Blend Bacon" width={1440} height={900} sizes="(max-width:760px) 100vw, 1232px"/><figcaption>02 / Os favoritos da casa.</figcaption></figure>
   <figure className={styles.screen} style={{ marginTop: 32 }}><Image src="/portfolio/blend/sobre-1440.png" alt="Seção O sabor está nos detalhes, com o hambúrguer separado em camadas sobre fundo laranja" width={1440} height={900} sizes="(max-width:760px) 100vw, 1232px"/><figcaption>03 / Ingredientes camada por camada.</figcaption></figure>
  </section>
  <section className={styles.mobile}><div><p className={styles.eyebrow}>NO CELULAR</p><h2>Feito para<br/>pedir com o polegar.</h2><p>Na tela pequena, o título, o botão de pedido e o produto aparecem em sequência, sem perder o impacto da foto.</p><dl className={styles.stack}><div><dt>Interface</dt><dd>Next.js · React · TypeScript · Tailwind CSS</dd></div><div><dt>Pedidos e administração</dt><dd>Supabase</dd></div><div><dt>Categoria</dt><dd>Site + cardápio digital com pedido online</dd></div></dl></div><div className={styles.phones}><Image src="/portfolio/blend/home-390.png" alt="Página inicial da Blend Burger no celular" width={780} height={1688} sizes="(max-width:760px) 44vw, 280px"/></div></section>
  <section className={styles.closing}><div><p className={styles.eyebrow}>UM PROJETO COM ESSA DIREÇÃO?</p><h2>Vamos montar<br/>o seu cardápio.</h2><p>Adaptações, funcionalidades e condições comerciais são definidas em uma proposta própria.</p></div><ProblemFlowTrigger className={styles.button} subject="Um site com cardápio digital inspirado na Blend Burger">Pedir orçamento <span aria-hidden="true">↗</span></ProblemFlowTrigger></section>
 </div></main>;
}
