import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import Reveal from "./Reveal";

const strategy = [
  ["Produto antes da interface", "Fotografia e atributos de cada relógio conduzem a composição."],
  ["Clareza antes da conversão", "Procedência, disponibilidade e especificações orientam a escolha."],
] as const;

const decisions = [
  ["Descoberta objetiva", "Busca e filtros por marca e mecanismo reduzem o esforço para chegar ao modelo certo."],
  ["Hierarquia de produto", "Marca, mecanismo, atributos, preço e disponibilidade seguem uma ordem consistente em cada ponto de contato."],
  ["Detalhe sem ruptura", "A visualização rápida mantém o contexto do catálogo enquanto aprofunda as informações do relógio."],
  ["Continuidade responsiva", "No mobile, a mesma narrativa é reorganizada para toque, leitura curta e decisão com uma mão."],
] as const;

export default function VyneCase({ project }: { project: Project }) {
  return (
    <main id="conteudo" className="vyne-case-page">
      <header className="vyne-case-hero">
        <div className="section-shell">
          <Link className="vyne-case-back" href="/projetos">← Todos os projetos</Link>

          <div className="vyne-case-intro">
            <div>
              <span className="vyne-case-kicker">E-commerce / Product Experience</span>
              <h1>{project.name}</h1>
            </div>
            <div className="vyne-case-intro-copy">
              <p>Uma experiência de compra de relógios construída para unir desejo, clareza e confiança.</p>
              <dl>
                <div><dt>Ano</dt><dd>{project.year}</dd></div>
                <div><dt>Categoria</dt><dd>{project.category}</dd></div>
              </dl>
            </div>
          </div>

          <Reveal className="vyne-case-hero-media" variant="media">
            <Image
              src="/portfolio/vyne/hero-desktop.png"
              alt="Página inicial do VYNE em desktop"
              width={1425}
              height={990}
              priority
              loading="eager"
              sizes="(max-width: 760px) 100vw, 1440px"
            />
          </Reveal>
        </div>
      </header>

      <section className="vyne-case-challenge">
        <div className="section-shell vyne-case-challenge-grid">
          <Reveal className="vyne-case-section-index">
            <p>Contexto e desafio</p>
          </Reveal>
          <Reveal className="vyne-case-challenge-copy">
            <p className="vyne-case-lead">Um catálogo premium não pode se comportar como uma grade genérica de ofertas.</p>
            <p>Apresentar a coleção com contexto, sem esconder as informações de cada relógio.</p>
          </Reveal>
        </div>

        <Reveal className="section-shell vyne-case-question">
          <span>A pergunta que orientou o produto</span>
          <h2>Como transformar um catálogo de relógios em uma experiência de produto?</h2>
        </Reveal>
      </section>

      <section className="vyne-case-strategy">
        <div className="section-shell">
          <Reveal className="vyne-case-section-head">
            <span>Estratégia</span>
            <h2>Clareza para escolher.<br />Presença para desejar.</h2>
          </Reveal>

          <div className="vyne-case-principles">
            {strategy.map(([title, body]) => (
              <Reveal className="vyne-case-principle" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="vyne-case-direction">
        <div className="section-shell vyne-case-direction-grid">
          <Reveal className="vyne-case-direction-copy">
            <span>Direção visual</span>
            <h2>Uma linguagem de luxo contemporâneo, sem excesso.</h2>
            <p>Preto, verde ácido e branco constroem contraste imediato. A interface recua para que tipografia, produto e informação formem a identidade.</p>
          </Reveal>

          <Reveal className="vyne-case-motion" variant="media">
            <video controls muted playsInline preload="none" poster="/portfolio/vyne/hero-desktop.png" aria-label="Animação da assinatura VYNE">
              <source src="/media/vyne-wordmark-transparent.webm" type="video/webm" />
            </video>
            <div className="vyne-case-palette" aria-label="Paleta visual VYNE">
              <span><i className="vyne-swatch vyne-swatch--black" />#020403</span>
              <span><i className="vyne-swatch vyne-swatch--green" />#9BFF00</span>
              <span><i className="vyne-swatch vyne-swatch--white" />#F2F4EF</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="vyne-case-product">
        <div className="section-shell">
          <Reveal className="vyne-case-section-head vyne-case-section-head--product">
            <span>Produto</span>
            <h2>O relógio ocupa o centro da experiência.</h2>
            <p>Da descoberta ao detalhe, cada estado preserva escala, contraste e informação suficiente para comparar com segurança.</p>
          </Reveal>

          <Reveal className="vyne-case-screen vyne-case-screen--wide" variant="media">
            <Image
              src="/portfolio/vyne/catalog-desktop.png"
              alt="Catálogo VYNE com busca e filtros por marca e mecanismo"
              width={1425}
              height={990}
              sizes="(max-width: 760px) 100vw, 1440px"
            />
            <figcaption><span>Descoberta</span> Busca, filtros e comparação em uma única superfície.</figcaption>
          </Reveal>

          <Reveal className="vyne-case-screen vyne-case-screen--recommended" variant="media">
            <Image
              src="/portfolio/vyne/recommended-desktop.png"
              alt="Seleção de relógios recomendados pelo VYNE"
              width={1265}
              height={712}
              sizes="(max-width: 760px) 100vw, 1440px"
            />
            <figcaption><span>Curadoria</span> Uma seleção reduzida apresenta os modelos antes do catálogo completo.</figcaption>
          </Reveal>

          <div className="vyne-case-product-pair">
            <Reveal className="vyne-case-product-shot" variant="media">
              <Image src="/media/products/seiko-5-sports.jpg" alt="Relógio Seiko 5 Sports apresentado no VYNE" width={1280} height={1274} sizes="(max-width: 760px) 100vw, 50vw" />
            </Reveal>
            <Reveal className="vyne-case-product-note">
              <span>Apresentação de produto</span>
              <h3>Imagem, informação e disponibilidade falam a mesma língua.</h3>
              <p>A direção evita banners promocionais e ruído comercial. Cada relógio recebe espaço para ser entendido antes de ser comparado.</p>
              <div className="vyne-case-specimen-list" aria-label="Marcas presentes no catálogo">
                <span>Seiko</span><span>Casio</span><span>Citizen</span><span>Orient</span><span>Timex</span>
              </div>
            </Reveal>
          </div>

          <Reveal className="vyne-case-screen vyne-case-screen--detail" variant="media">
            <Image
              src="/portfolio/vyne/product-detail-desktop.png"
              alt="Detalhe do produto Seiko 5 Sports no VYNE"
              width={1425}
              height={990}
              sizes="(max-width: 760px) 100vw, 1440px"
            />
            <figcaption><span>Detalhe sem ruptura</span> O modal aprofunda atributos, preço e disponibilidade sem tirar o usuário do catálogo.</figcaption>
          </Reveal>
        </div>
      </section>

      <section className="vyne-case-decisions">
        <div className="section-shell vyne-case-decisions-grid">
          <Reveal className="vyne-case-section-head vyne-case-section-head--sticky">
            <span>Experiência</span>
            <h2>Menos ornamento.<br />Mais intenção.</h2>
          </Reveal>
          <div className="vyne-case-decision-list">
            {decisions.map(([title, body], index) => (
              <Reveal className="vyne-case-decision" delay={index * 0.05} key={title}>
                <div><h3>{title}</h3><p>{body}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="vyne-case-responsive">
        <div className="section-shell">
          <Reveal className="vyne-case-section-head">
            <span>Responsivo</span>
            <h2>A mesma presença, em qualquer escala.</h2>
          </Reveal>
          <div className="vyne-case-responsive-stage">
            <Reveal className="vyne-case-device vyne-case-device--desktop" variant="media">
              <Image src="/portfolio/vyne/hero-desktop.png" alt="Experiência VYNE em desktop" width={1425} height={990} sizes="(max-width: 760px) 100vw, 70vw" />
            </Reveal>
            <Reveal className="vyne-case-device vyne-case-device--mobile" variant="media">
              <Image src="/portfolio/vyne/hero-mobile.png" alt="Experiência VYNE em mobile" width={375} height={811} sizes="(max-width: 760px) 44vw, 260px" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="vyne-case-outcome">
        <div className="section-shell vyne-case-outcome-grid">
          <Reveal className="vyne-case-outcome-copy">
            <span>Entrega</span>
            <h2>Marca e comércio reunidos em uma experiência coerente.</h2>
            <p>O produto final combina narrativa de marca, curadoria, catálogo, filtros, favoritos e detalhe de produto em um fluxo responsivo.</p>
            <a className="vyne-case-live-link" href="https://vyne-relogios.vercel.app" target="_blank" rel="noreferrer">Visitar experiência <span>↗</span></a>
          </Reveal>
          <Reveal className="vyne-case-build">
            <div><span>Implementação</span><p>Arquitetura em App Router, componentes reutilizáveis, dados tipados e catálogo integrado ao Supabase.</p></div>
            <div><span>Tecnologia</span><p>{project.technologies.join(" · ")} · Vercel</p></div>
          </Reveal>
        </div>
      </section>

      <Link className="vyne-case-close" href="/projetos">
        <span>Arquivo de projetos</span>
        <strong>Explorar outros projetos</strong>
        <i aria-hidden="true">→</i>
      </Link>
    </main>
  );
}
