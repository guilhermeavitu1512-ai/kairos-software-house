"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";
import { services } from "@/data/services";
import { sitePlans } from "@/data/pricing";
import styles from "./ServicesShowcase.module.css";

const stories = [
  { tag: "PRESENÇA DIGITAL", title: "Seu negócio merece ser visto.", detail: "Um lugar para apresentar o que você faz e transformar interesse em uma conversa.", tags: ["Institucional", "Landing page", "Portfólio"] },
  { tag: "OPERAÇÃO CONECTADA", title: "Tudo o que importa, no mesmo lugar.", detail: "Pedidos, agendas e informações organizados em uma ferramenta pensada para sua rotina.", tags: ["Gestão", "Agendamento", "Produtos SaaS"] },
  { tag: "EXPERIÊNCIA NA PALMA DA MÃO", title: "Mais perto de quem usa.", detail: "Aplicativos para facilitar o acesso dos seus clientes ou o trabalho da sua equipe.", tags: ["Clientes", "Equipes", "Serviços"] },
  { tag: "MENOS TRABALHO REPETITIVO", title: "Deixe as ferramentas conversarem.", detail: "Conecte etapas, organize informações e automatize tarefas que hoje dependem de trabalho manual.", tags: ["Integrações", "Bots", "Fluxos de trabalho"] },
] as const;

function ServiceArtwork({ index }: { index: number }) {
  const id = useId().replace(/:/g, "");
  return <svg className={styles.art} viewBox="0 0 560 420" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-glass`} x1="100" y1="50" x2="440" y2="390" gradientUnits="userSpaceOnUse"><stop stopColor="currentColor" stopOpacity=".28"/><stop offset="1" stopColor="currentColor" stopOpacity=".025"/></linearGradient>
      <linearGradient id={`${id}-line`} x1="90" y1="80" x2="450" y2="330" gradientUnits="userSpaceOnUse"><stop stopColor="currentColor"/><stop offset="1" stopColor="currentColor" stopOpacity=".14"/></linearGradient>
    </defs>
    <g className={styles.orbit}><ellipse cx="280" cy="230" rx="223" ry="131" stroke="currentColor" strokeOpacity=".12" transform="rotate(-23 280 230)"/><ellipse cx="280" cy="230" rx="188" ry="106" stroke="currentColor" strokeOpacity=".08" transform="rotate(24 280 230)"/></g>
    {index === 0 && <g className={styles.float}>
      <path d="M130 142 389 103 443 291 184 331Z" fill={`url(#${id}-glass)`} stroke={`url(#${id}-line)`}/>
      <path d="M109 113 368 74 422 262 163 302Z" fill="#081522" stroke={`url(#${id}-line)`}/>
      <path d="m118 143 259-39" stroke="currentColor" strokeOpacity=".35"/>
      <circle cx="131" cy="126" r="3" fill="currentColor"/><circle cx="143" cy="124" r="3" fill="currentColor" opacity=".5"/>
      <path d="m147 173 106-16m-101 32 76-12m-66 46 74-11" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <path d="m167 248 36-5" stroke="currentColor" strokeWidth="16" strokeLinecap="round" opacity=".4"/>
      <path d="m289 151 54-8 30 95-54 8Z" fill={`url(#${id}-glass)`} stroke="currentColor" strokeOpacity=".45"/>
      <circle cx="326" cy="194" r="22" stroke="currentColor" strokeWidth="8"/>
      <path d="m401 274 5 42 10-13 18 4Z" fill="currentColor"/>
    </g>}
    {index === 1 && <g className={styles.float}>
      {[0,1,2].map(i=><g key={i} transform={`translate(0 ${i * -57})`}><path d="m118 243 160-73 166 78-160 79Z" fill="#08151e" stroke={`url(#${id}-line)`}/><path d="m118 243 166 80 160-75v21l-160 79-166-81Z" fill={`url(#${id}-glass)`} stroke="currentColor" strokeOpacity=".25"/></g>)}
      <path d="m231 130 46-21 46 22-46 22Z" fill="currentColor" opacity=".6"/>
      <path d="M284 238v96m-109-48v37m218-40v37" stroke="currentColor" strokeDasharray="4 7"/>
      <circle cx="284" cy="350" r="8" fill="currentColor"/><circle cx="175" cy="333" r="5" fill="currentColor" opacity=".5"/><circle cx="393" cy="330" r="5" fill="currentColor" opacity=".5"/>
    </g>}
    {index === 2 && <g className={styles.float}>
      <rect x="250" y="91" width="132" height="243" rx="26" transform="rotate(15 250 91)" fill={`url(#${id}-glass)`} stroke="currentColor" strokeOpacity=".35"/>
      <rect x="168" y="60" width="145" height="274" rx="29" transform="rotate(-9 168 60)" fill="#111321" stroke={`url(#${id}-line)`} strokeWidth="2"/>
      <g transform="rotate(-9 168 60)"><path d="M224 75h32" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity=".4"/><circle cx="240" cy="169" r="39" fill={`url(#${id}-glass)`} stroke="currentColor"/><path d="m225 170 10 10 22-24" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="M208 238h65m-52 17h39" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity=".45"/><path d="M224 316h32" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></g>
      <circle cx="372" cy="117" r="22" fill="#111321" stroke="currentColor"/><path d="M365 117h14m-7-7v14" stroke="currentColor" strokeWidth="2"/>
    </g>}
    {index === 3 && <g className={styles.float}>
      <path className={styles.flow} d="M133 137h85q22 0 22 22v49m80 0v-49q0-22 22-22h85M133 302h85q22 0 22-22v-38m80 0v38q0 22 22 22h85" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8"/>
      <rect x="225" y="166" width="110" height="110" rx="28" fill={`url(#${id}-glass)`} stroke="currentColor" transform="rotate(-12 280 221)"/>
      <path d="m286 193-22 30h17l-8 26 25-34h-18Z" fill="currentColor"/>
      {[[120,137],[120,302],[440,137],[440,302]].map(([x,y],i)=><g key={i}><rect x={x-27} y={y-27} width="54" height="54" rx="16" fill="#101a1c" stroke="currentColor" strokeOpacity=".65"/><circle cx={x} cy={y} r="9" stroke="currentColor" strokeWidth="2"/></g>)}
    </g>}
  </svg>;
}

export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const story = stories[active];
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % services.length : event.key === "ArrowLeft" ? (index + services.length - 1) % services.length : event.key === "Home" ? 0 : event.key === "End" ? services.length - 1 : null;
    if (next === null) return;
    event.preventDefault(); setActive(next); tabs.current[next]?.focus();
  }
  return <section id="servicos" className={styles.section} aria-labelledby="services-title">
    <div className={styles.shell}>
      <header className={styles.heading}><div><p className={styles.eyebrow}>O QUE PODEMOS CONSTRUIR</p><h2 id="services-title">Uma ideia.<br/><span>Várias possibilidades.</span></h2></div><p>Da primeira impressão ao trabalho que acontece nos bastidores. Explore onde a tecnologia pode ajudar seu negócio.</p></header>
      <div className={styles.tabs} role="tablist" aria-label="Explore nossos serviços">{services.map((service,index)=><button key={service.name} ref={node=>{tabs.current[index]=node;}} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={active===index} aria-controls={`${id}-panel-${index}`} tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>navigate(event,index)}><span className={styles.tabNumber}>0{index+1}</span>{service.name}<span className={styles.tabArrow} aria-hidden="true">↗</span></button>)}</div>
      {services.map((service,index)=><div key={service.name} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={active!==index} tabIndex={0} className={styles.panel} data-theme={index}>
        {active===index && <><div className={styles.copy}><p className={styles.kicker}>{story.tag}</p><h3>{story.title}</h3><p className={styles.detail}>{story.detail}</p><ul className={styles.tags}>{story.tags.map(tag=><li key={tag}>{tag}</li>)}</ul><div className={styles.actions}><ProblemFlowTrigger subject={service.name} className={styles.cta}>Contar meu problema <span aria-hidden="true">↗</span></ProblemFlowTrigger><span className={styles.price}>{index===0?`Sites a partir de R$ ${sitePlans[0].upfront}`:"Projeto sob orçamento"}</span></div></div><div className={styles.visual}><div className={styles.glow}/><ServiceArtwork index={index}/><span className={styles.artCaption} aria-hidden="true">KAIROS / {String(index+1).padStart(2,"0")}</span></div></>}
      </div>)}
      <div className={styles.footnote}><p>Não sabe qual caminho seguir? Comece pelo que precisa resolver.</p><ProblemFlowTrigger>Contar meu problema <span aria-hidden="true">→</span></ProblemFlowTrigger></div>
    </div>
  </section>;
}
