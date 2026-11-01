import type { Metadata } from "next";
import ProjectList from "@/components/home/ProjectList";
export const metadata: Metadata = { title: "Projetos", description: "Conheça projetos desenvolvidos pela KAIROS, com telas e detalhes das funcionalidades.", alternates:{canonical:"/projetos"} };
export default function ProjectsPage() {
  return <main id="conteudo" style={{paddingTop:60,paddingBottom:96}}><ProjectList headingLevel="h1" /></main>;
}
