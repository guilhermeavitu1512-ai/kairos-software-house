import type { Metadata } from "next";
export const metadata: Metadata = { alternates: { canonical: "/" } };
import BrandProblemStory from "@/components/kairos/BrandProblemStory";
import Hero from "@/components/kairos/Hero";
import KairosLab from "@/components/kairos/KairosLab";
import FinalContact from "@/components/kairos/problem-flow/FinalContact";
import ServicesSection from "@/components/kairos/ServicesSection";
import AfterDelivery from "@/components/kairos/AfterDelivery";
import PricingSection from "@/components/kairos/PricingSection";
import { ProcessSection, AboutSection, FaqSection } from "@/components/kairos/ConversionSections";
import OpeningTransition from "@/components/kairos/OpeningTransition";

export default function Home() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KAIROS",
    description: "Sites, sistemas, apps e automações para empresas.",
  };

  return (
    <main id="conteudo">
      <OpeningTransition>
        <Hero />
        <BrandProblemStory />
      </OpeningTransition>

      <KairosLab />

      <ServicesSection />
      <PricingSection />
      <ProcessSection />
      <AfterDelivery />
      <AboutSection />
      <FaqSection />

      <FinalContact />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    </main>
  );
}
