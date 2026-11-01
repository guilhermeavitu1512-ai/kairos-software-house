import type { Metadata } from "next";
export const metadata: Metadata = { alternates: { canonical: "/" } };
import IntroHero from "@/components/home/IntroHero";
import ProjectList from "@/components/home/ProjectList";
import PlanFinder from "@/components/home/PlanFinder";
import Solutions from "@/components/home/Solutions";
import { ActionBand, Faq, FinalCall } from "@/components/home/HomeClosing";

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
      <ActionBand title="Vamos encontrar a solução para o seu projeto" cta="Contar meu problema" source="band_projects" />
      <PlanFinder />
      <Faq />
      <FinalCall />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    </main>
  );
}
