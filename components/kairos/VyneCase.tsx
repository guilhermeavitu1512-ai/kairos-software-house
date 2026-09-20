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
  ["Continuidade responsiva", "No celular, os controles e as informações se ajustam à largura da tela."],
] as const;

export default function VyneCase({ project }: { project: Project }) {
  return (
    <main id="conteudo" className="vyne-case-page">
      <header className="vyne-case-hero">
        <div className="section-shell">
          <Link className="vyne-case-back" href="/projetos">← Todos os projetos</Link>

          <div className="vyne-case-intro">
            <div>
              <span className="vyne-case-kicker">Projeto autoral · KAIROS Lab</span>
              <h1>{project.name}</h1>
            </div>
            <div className="vyne-case-intro-copy">
              <p>Um catálogo de relógios com busca, filtros, favoritos e detalhes de cada modelo.</p>
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
            <p>Problema</p>
          </Reveal>
          <Reveal className="vyne-case-challenge-copy">
            <p className="vyne-case-lead">O projeto reúne modelos de diferentes marcas em um catálogo que pode ser filtrado.</p>
            <p>Apresentar a coleção com contexto, sem esconder as informações de cada relógio.</p>
          </Reveal>
        </div>

        <Reveal className="section-shell vyne-case-question">
          <span>A pergunta que orientou o produto</span>
          <h2>Como ajudar quem visita a encontrar e comparar relógios?</h2>
        </Reveal>
      </section>

      <section className="vyne-case-strategy">
        <div className="section-shell">
          <Reveal className="vyne-case-section-head">
            <span>Decisão</span>
            <h2>Fotos e especificações<br />para comparar modelos.</h2>
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
            <span>Solução</span>
            <h2>Fundo escuro, fotos grandes e destaques em verde.</h2>
            <p>O verde destaca ações e informações sobre o fundo preto. As fotos têm espaço próprio, ao lado dos dados de cada relógio.</p>
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
            <h2>Do catálogo aos detalhes do relógio.</h2>
            <p>As telas mostram a busca por modelos, os filtros e a consulta às especificações.</p>
          </Reveal>

          <Reveal className="vyne-case-screen vyne-case-screen--wide" variant="media">
            <Image
              src="/portfolio/vyne/catalog-desktop.png"
              alt="Catálogo VYNE com busca e filtros por marca e mecanismo"
              width={1425}
              height={990}
              sizes="(max-width: 760px) 100vw, 1440px"
            />
            <figcaption><span>Descoberta</span> Busca, filtros e comparação em uma única tela.</figcaption>
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
              <h3>Fotos e informações de cada modelo.</h3>
              <p>As fotos acompanham as informações do produto para que a pessoa possa consultar suas características.</p>
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
            <h2>Como o catálogo<br />foi organizado.</h2>
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
            <h2>O catálogo no computador e no celular.</h2>
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
            <h2>Catálogo, filtros e favoritos em um só site.</h2>
            <p>O produto final combina narrativa de marca, curadoria, catálogo, filtros, favoritos e detalhe de produto em um fluxo responsivo.</p>
            <a className="vyne-case-live-link" href="https://vyne-relogios.vercel.app" target="_blank" rel="noreferrer">Visitar o site <span>↗</span></a>
          </Reveal>
          <Reveal className="vyne-case-build">
            <div><span>Implementação</span><p>Arquitetura em App Router, componentes reutilizáveis, dados tipados e catálogo integrado ao Supabase.</p></div>
            <div><span>Tecnologia</span><p>{project.technologies.join(" · ")} · Vercel</p></div>
          </Reveal>
        </div>
      </section>

      <Link className="vyne-case-close" href="/projetos">
        <span>Portfólio</span>
        <strong>Explorar outros projetos</strong>
        <i aria-hidden="true">→</i>
      </Link>
    </main>
  );
}
