import Link from "next/link";
import { problemCards } from "@/data/site-copy";
import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";
import styles from "./ProblemCards.module.css";

// Small decorative UIs: a search result, a filling agenda, a running flow.
function CardVisual({ index }: { index: number }) {
  if (index === 0) return <div className={styles.visual} aria-hidden="true">
    <div className={styles.search}><span className={styles.searchIcon} />seu serviço perto de mim</div>
    <div className={styles.result}><span className={styles.favicon} /><div><b>Seu Negócio</b><small>seunegocio.com.br · Agende online</small></div><span className={styles.resultCta}>WhatsApp</span></div>
    <div className={styles.result} data-faded><span className={styles.favicon} /><div><i /><i /></div></div>
  </div>;
  if (index === 1) return <div className={styles.visual} aria-hidden="true">
    <div className={styles.week}>{Array.from({ length: 15 }, (_, i) => <span key={i} data-filled={[0, 2, 4, 6, 7, 9, 11, 13].includes(i) || undefined} style={{ animationDelay: `${i * 90}ms` }} />)}</div>
  </div>;
  return <div className={styles.visual} aria-hidden="true">
    <div className={styles.pipe}><span>Pedido</span><i /><span>Planilha</span><i /><span>Aviso</span></div>
  </div>;
}

export default function ProblemCards() {
  return <section id="o-que-resolvemos" className={styles.section} aria-labelledby="problems-title">
    <div className={styles.shell}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>O QUE RESOLVEMOS</p>
        <h2 id="problems-title">Menos improviso, <span>mais negócio funcionando.</span></h2>
      </header>
      <ol className={styles.cards}>
        {problemCards.map((card, index) => <li key={card.title} className={styles.card} data-spotlight>
          <CardVisual index={index} />
          <span className={styles.number} aria-hidden="true">0{index + 1}</span>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
          <div className={styles.actions}>
            <ProblemFlowTrigger className={styles.cta} subject={card.subject}>{card.cta} <span aria-hidden="true">→</span></ProblemFlowTrigger>
            {"example" in card && <Link className={styles.example} href={card.example.href}>{card.example.label}</Link>}
          </div>
        </li>)}
      </ol>
    </div>
  </section>;
}
