import { businessLabel, goalsLabel, formatBrazilPhone, type ProblemAnswers } from "@/data/problem-flow";
import WhatsAppAction from "./WhatsAppAction";
import styles from "./ProblemFlow.module.css";

export default function ProblemReview({ answers, edit }: { answers: ProblemAnswers; edit: (step: number) => void }) {
  const rows = [
    ["O que está dando trabalho", answers.problem],
    ["Tipo de negócio", businessLabel(answers)],
    ["Como funciona hoje", answers.current.join(", ")],
    ["O que gostaria de melhorar", goalsLabel(answers)],
    ["Contato", [answers.name, formatBrazilPhone(answers.whatsapp), answers.email, answers.company].filter(Boolean).join("\n")],
  ];
  return <>
    <dl className={styles.review}>{rows.map(([label, value], index) => <div key={label}>
      <dt>{label}</dt><dd>{value}</dd>
      <button type="button" className={styles.textButton} onClick={() => edit(index)} aria-label={`Editar ${label.toLowerCase()}`}>Editar</button>
    </div>)}</dl>
    <WhatsAppAction answers={answers} />
  </>;
}
