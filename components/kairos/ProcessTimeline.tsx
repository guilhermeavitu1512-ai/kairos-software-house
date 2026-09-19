"use client";

import { m, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

const steps = [
  ["01", "Descoberta", "Entendemos o problema, objetivo e público."],
  ["02", "Estratégia", "Definimos arquitetura, funcionalidades e experiência."],
  ["03", "Design", "Construímos a interface e a forma de usar."],
  ["04", "Desenvolvimento", "Transformamos o projeto em software."],
  ["05", "Testes", "Validamos funcionamento, responsividade e qualidade."],
  ["06", "Deploy", "Colocamos o produto no ar e acompanhamos a entrega."],
];

export default function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 75%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.22 });

  return (
    <div className="process-timeline" ref={ref}>
      <div className="process-line"><m.i style={{ scaleY: reduceMotion ? 1 : scaleY }} /></div>
      {steps.map((step, index) => (
        <m.article key={step[0]} className="process-step" initial={reduceMotion ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .45 }} transition={{ duration: reduceMotion ? 0 : .55, delay: index * .04 }}>
          <span>{step[0]}</span><h3>{step[1]}</h3><p>{step[2]}</p>
        </m.article>
      ))}
    </div>
  );
}
