import BrandProblemStory from "@/components/kairos/BrandProblemStory";
import Hero from "@/components/kairos/Hero";
import KairosLab from "@/components/kairos/KairosLab";
import FinalContact from "@/components/kairos/problem-flow/FinalContact";
import ServicesSection from "@/components/kairos/ServicesSection";
import AfterDelivery from "@/components/kairos/AfterDelivery";
import PricingSection from "@/components/kairos/PricingSection";
import EntryIntro from "@/components/kairos/EntryIntro";
import OpeningTransition from "@/components/kairos/OpeningTransition";

export default function Home() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KAIROS",
    description: "Software house que transforma necessidades em produtos digitais.",
  };

  return (
    <main id="conteudo">
      <EntryIntro />
      <OpeningTransition>
        <Hero />
        <BrandProblemStory />
      </OpeningTransition>

      <KairosLab />

      <ServicesSection />
      <PricingSection />
      <AfterDelivery />

      <FinalContact />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    </main>
  );
}
