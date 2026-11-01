import type { Metadata } from "next";
export const metadata: Metadata = { alternates: { canonical: "/" } };
import IntroHero from "@/components/home/IntroHero";
import ProjectList from "@/components/home/ProjectList";
import LiveDemos from "@/components/home/LiveDemos";
import BeforeAfter from "@/components/home/BeforeAfter";
import PlanFinder from "@/components/home/PlanFinder";
import Solutions from "@/components/home/Solutions";
import { ActionBand, Faq, FinalCall, Process } from "@/components/home/HomeClosing";

export default function Home() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KAIROS",
    description: "Sites, agendas online e sistemas de pedidos para pequenos negócios.",
  };

  return (
    <main id="conteudo">
      <IntroHero />
      <Solutions />
      <ProjectList />
      <ActionBand title="Vamos encontrar a solução para o seu projeto" text="Conte o que atrapalha o seu dia. Em três perguntas, a gente entende o que faz sentido para você." cta="Contar meu problema" source="band_projects" />
      <LiveDemos />
      <BeforeAfter />
      <ActionBand title="Quer isso funcionando no seu negócio?" text="Sem compromisso: você recebe uma proposta com prazo e valor antes de contratar." cta="Pedir orçamento" source="band_compare" />
      <PlanFinder />
      <Process />
      <Faq />
      <FinalCall />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    </main>
  );
}
