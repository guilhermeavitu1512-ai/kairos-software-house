"use client";

import { createContext, useContext, useEffect, useRef, useState, type AnchorHTMLAttributes, type ReactNode, type FormEvent } from "react";
import Link from "next/link";
import { EMPTY_PROBLEM, QUESTIONS, validateProblemStep, type ProblemAnswers } from "@/data/problem-flow";
import { BusinessTypeStep, ContactStep, CurrentProcessStep, GoalStep, ProblemStep, type UpdateAnswer } from "./ProblemSteps";
import ProblemReview from "./ProblemReview";
import styles from "./ProblemFlow.module.css";

const FlowContext = createContext<(() => void) | null>(null);
export function ProblemFlowTrigger({ children, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const open = useContext(FlowContext);
  return <Link {...props} href="/#briefing" onClick={event => {
    onClick?.(event);
    if (!open || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); open();
  }}>{children}</Link>;
}

export default function ProblemFlowProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const origin = useRef<HTMLElement | null>(null);
  const [opened, setOpened] = useState(false);
  const [answers, setAnswers] = useState<ProblemAnswers>(EMPTY_PROBLEM);
  const [step, setStep] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  function open() { origin.current = document.activeElement as HTMLElement | null; setOpened(true); }
  function close() { setOpened(false); }
  useEffect(() => {
    const openHash = () => { if (location.hash === "#briefing") setOpened(true); };
    openHash(); window.addEventListener("hashchange", openHash);
    return () => window.removeEventListener("hashchange", openHash);
  }, []);
  useEffect(() => {
    if (!opened) return;
    const node = dialog.current;
    if (!node) return;
    node.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      node.close(); document.body.style.overflow = previousOverflow;
      if (location.hash === "#briefing") history.replaceState(history.state, "", location.pathname + location.search);
      const target = origin.current;
      if (target?.isConnected && target.getClientRects().length) target.focus({ preventScroll: true });
      else document.querySelector<HTMLElement>('.menu-toggle')?.focus({ preventScroll: true });
    };
  }, [opened]);
  useEffect(() => {
    if (opened) { dialog.current?.scrollTo({ top: 0 }); heading.current?.focus({ preventScroll: true }); }
  }, [opened, step, reviewing]);

  const update: UpdateAnswer = (key, value) => { setAnswers(current => ({ ...current, [key]: value })); setError(""); };
  function continueFlow(event: FormEvent) {
    event.preventDefault();
    const issue = validateProblemStep(step, answers);
    if (issue) { setError(issue); return; }
    setError("");
    if (editing || step === 4) { setReviewing(true); setEditing(false); }
    else setStep(current => current + 1);
  }
  function back() {
    setError("");
    if (reviewing) { setReviewing(false); setStep(4); }
    else if (editing) { setEditing(false); setReviewing(true); }
    else if (step === 0) close();
    else setStep(current => current - 1);
  }
  function edit(target: number) { setStep(target); setEditing(true); setReviewing(false); setError(""); }
  const props = { answers, update, error };
  return <FlowContext.Provider value={open}>
    {children}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="problem-flow-title" onCancel={event => { event.preventDefault(); close(); }}>
      <div className={styles.topbar}><span>KAIROS</span><button type="button" onClick={close}>Fechar <span aria-hidden="true">×</span></button></div>
      <div className={styles.content}>
        <p className={styles.progress}>{reviewing ? "Revisão" : `Pergunta ${step + 1} de 5`}</p>
        <h2 id="problem-flow-title" ref={heading} tabIndex={-1}>{reviewing ? "É isso?" : QUESTIONS[step]}</h2>
        <div key={reviewing ? "review" : step} className={styles.step}>
          {reviewing ? <><ProblemReview answers={answers} edit={edit} /><button className={styles.textButton} type="button" onClick={back}>← Voltar</button></> : <form onSubmit={continueFlow} noValidate>
            {step === 0 && <ProblemStep {...props} />}
            {step === 1 && <BusinessTypeStep {...props} />}
            {step === 2 && <CurrentProcessStep {...props} />}
            {step === 3 && <GoalStep {...props} />}
            {step === 4 && <ContactStep {...props} />}
            <p id="flow-error" role="alert" className={styles.error}>{error}</p>
            <div className={styles.actions}>
              <button className={styles.textButton} type="button" onClick={back}>← Voltar</button>
              <button className={styles.primary} type="submit">{editing ? "Revisar alteração" : "Continuar"} <span aria-hidden="true">→</span></button>
            </div>
          </form>}
        </div>
      </div>
    </dialog>
  </FlowContext.Provider>;
}
