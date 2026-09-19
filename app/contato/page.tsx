import type { Metadata } from "next";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import { buildWhatsAppMessageUrl } from "@/lib/constants";

export const metadata: Metadata = { title: "Contato", description: "Conte o que está dando trabalho. A KAIROS ajuda a entender o próximo passo." };

export default function ContactPage() {
  return <main id="conteudo" className="inner-page contact-page contact-page--editorial">
    <header className="contact-hero">
      <div className="section-shell">
        <h1>Conte o que está dando trabalho.</h1>
        <p>Você não precisa saber qual sistema precisa.</p>
        <ProblemFlowTrigger className="button">Contar meu problema <span aria-hidden="true">→</span></ProblemFlowTrigger>
        <p className="contact-direct">Prefere falar direto? <a href={buildWhatsAppMessageUrl("Olá! Conheci a KAIROS pelo site e queria conversar sobre um problema no meu negócio.")} target="_blank" rel="noopener noreferrer">WhatsApp →</a></p>
      </div>
    </header>
  </main>;
}
