import type { Metadata } from "next";
import KairosLab from "@/components/kairos/KairosLab";
export const metadata: Metadata = { title: "Projetos", description: "Conheça projetos desenvolvidos pela KAIROS, com telas e detalhes das funcionalidades.", alternates:{canonical:"/projetos"} };
export default function ProjectsPage() {
  return <main id="conteudo" style={{paddingTop:80}}><KairosLab /></main>;
}
