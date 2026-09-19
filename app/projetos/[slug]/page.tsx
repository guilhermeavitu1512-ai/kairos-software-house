import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CaseNarrative from "@/components/kairos/CaseNarrative";
import VyneCase from "@/components/kairos/VyneCase";
import { getProjectBySlug, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const eyebrow = project.slug === "vyne" ? "E-commerce / Product Experience" : project.eyebrow;
  const description = project.slug === "vyne" ? "Uma experiência de compra de relógios construída para unir desejo, clareza e confiança." : project.description;
  const title = `${project.name} — ${eyebrow}`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: project.slug === "vyne" ? [{ url: "/portfolio/vyne/hero-desktop.png", width: 1425, height: 990, alt: "Experiência digital VYNE" }] : [] },
    twitter: { card: "summary_large_image", title, description, images: project.slug === "vyne" ? ["/portfolio/vyne/hero-desktop.png"] : [] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  if (project.slug === "vyne") return <VyneCase project={project} />;

  return (
    <main id="conteudo" className="inner-page case-page">
      <header className="case-hero">
        <div className="section-shell">
          <Link className="back-link" href="/projetos">← Todos os projetos</Link>
          <div className="case-title">
            <div>
              <span className="section-label">Projeto selecionado</span>
              <h1>{project.name}</h1>
              <p>{project.eyebrow}</p>
            </div>
            <dl>
              <div><dt>Ano</dt><dd>{project.year}</dd></div>
              <div><dt>Categoria</dt><dd>{project.caseCategory}</dd></div>
            </dl>
          </div>
        </div>
      </header>

      <CaseNarrative project={project} />

      <section className="case-technical-notes" aria-label="Resultado e construção">
        <div className="section-shell case-technical-grid">
          <div className="case-result">
            <span>Resultado</span>
            <h2>{project.result}</h2>
          </div>
          <div className="case-build-notes">
            <div>
              <span>Construção</span>
              <p>{project.development}</p>
            </div>
            <div>
              <span>Tecnologia</span>
              <p>{project.technologies.join(" · ")}</p>
            </div>
          </div>
        </div>
      </section>

      <Link className="case-close" href="/projetos">Explorar outros projetos <span>→</span></Link>
    </main>
  );
}
