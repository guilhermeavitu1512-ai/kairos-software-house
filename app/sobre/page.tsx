import type { Metadata } from "next";
import Reveal from "@/components/kairos/Reveal";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";

export const metadata: Metadata = { title: "Sobre", description: "Estratégia, design e desenvolvimento, em um só lugar." };
export default function AboutPage() {
  return <main id="conteudo" className="inner-page about-page">
    <header className="about-page-hero"><div className="section-shell"><h1>Software com propósito.</h1><p>Estratégia, design e desenvolvimento, em um só lugar.</p></div></header>
    <section className="about-page-story section--light"><div className="section-shell about-story-grid">
      <Reveal><h2>O momento certo.</h2></Reveal>
      <Reveal><p>Kairós é o momento oportuno: quando uma ideia encontra clareza para se tornar produto.</p><p>Começamos entendendo o contexto. Depois, construímos o que faz sentido.</p></Reveal>
    </div><div className="section-shell principles-band">
      <Reveal><span>Estratégia</span><p>Entender antes de construir.</p></Reveal>
      <Reveal><span>Design</span><p>Clareza em cada interação.</p></Reveal>
      <Reveal><span>Desenvolvimento</span><p>Software preparado para evoluir.</p></Reveal>
    </div></section>
    <section className="about-page-close"><div className="section-shell"><h2>Comece pelo contexto.</h2><ProblemFlowTrigger className="button">Contar meu problema <span aria-hidden="true">→</span></ProblemFlowTrigger></div></section>
  </main>;
}
