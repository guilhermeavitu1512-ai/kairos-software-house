import { BUSINESS_TYPES, QUESTIONS, formatBrazilPhone, type ProblemAnswers } from "@/data/problem-flow";
import styles from "./ProblemFlow.module.css";

export type UpdateAnswer = <K extends keyof ProblemAnswers>(key: K, value: ProblemAnswers[K]) => void;
type Props = { answers: ProblemAnswers; update: UpdateAnswer; error: string };

export function ProblemStep({ answers, update, error }: Props) {
  return <>
    <label className={styles.fieldLabel} htmlFor="flow-problem">Conte em poucas palavras</label>
    <textarea id="flow-problem" value={answers.problem} onChange={e => update("problem", e.target.value)} maxLength={600} rows={5} required aria-invalid={!!error} aria-describedby="flow-error problem-count" placeholder="Ex.: quero um site para apresentar meus serviços e receber pedidos de orçamento." />
    <p id="problem-count" className={styles.hint}>{answers.problem.length} / 600 caracteres</p>
  </>;
}
export function BusinessTypeStep({ answers, update, error }: Props) {
  return <fieldset aria-describedby="flow-error" aria-invalid={!!error}>
    <legend className={styles.srOnly}>{QUESTIONS[1]}</legend>
    <div className={styles.options}>{BUSINESS_TYPES.map(option => <label key={option} className={styles.option}>
      <input type="radio" name="business" value={option} checked={answers.business === option} onChange={() => update("business", option)} required />{option}
    </label>)}</div>
    {answers.business === "Outro" && <label className={styles.field}>Tipo de negócio<input value={answers.otherBusiness} onChange={e => update("otherBusiness", e.target.value)} maxLength={120} required autoComplete="off" /></label>}
  </fieldset>;
}
export function ContactStep({ answers, update, error }: Props) {
  return <fieldset aria-describedby="flow-error">
    <legend className={styles.srOnly}>{QUESTIONS[2]}</legend>
    <div className={styles.contactFields}>
      <label className={styles.field}>Nome<input name="name" autoComplete="name" value={answers.name} maxLength={80} required aria-invalid={!!error && !answers.name.trim()} onChange={e => update("name", e.target.value)} /></label>
      <label className={styles.field}>WhatsApp <span>(opcional)</span><input name="tel" type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 91234-5678" value={answers.whatsapp} maxLength={22} aria-invalid={!!error && error.includes("WhatsApp")} onChange={e => update("whatsapp", e.target.value)} onBlur={() => update("whatsapp", formatBrazilPhone(answers.whatsapp))} /></label>
      <label className={styles.field}>E-mail <span>(opcional)</span><input name="email" type="email" autoComplete="email" value={answers.email} maxLength={120} aria-invalid={!!error && error.includes("e-mail")} onChange={e => update("email", e.target.value)} /></label>
      <label className={styles.field}>Empresa <span>(opcional)</span><input name="organization" autoComplete="organization" value={answers.company} maxLength={100} onChange={e => update("company", e.target.value)} /></label>
    </div>
  </fieldset>;
}
