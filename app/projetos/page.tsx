import type { Metadata } from "next";
import ProjectFilters from "@/components/kairos/ProjectFilters";

export const metadata: Metadata = { title: "Projetos", description: "Projetos digitais selecionados da KAIROS." };

export default function ProjectsPage() {
  return <main id="conteudo" className="inner-page projects-page"><header className="page-hero page-hero--light"><div className="section-shell"><h1>Projetos</h1><p>Uma seleção de experiências digitais da KAIROS.</p></div></header><section className="projects-index section--light"><div className="section-shell"><ProjectFilters /></div></section></main>;
}
