"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useMemo, useState, type FormEvent, type MouseEvent } from "react";
import BriefingReview from "@/components/kairos/briefing/BriefingReview";
import {
  BudgetStep,
  ContactStep,
  FeaturesStep,
  NeedStep,
  ProjectTypeStep,
  StageStep,
  TimelineStep,
} from "@/components/kairos/briefing/BriefingSteps";
import {
  BUDGET_RANGES,
  DEADLINE_OPTIONS,
  EMPTY_BRIEFING,
  PROJECT_STAGE_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  getOptionLabel,
  type BriefingAnswers,
} from "@/data/briefing";
import { buildWhatsAppMessageUrl } from "@/lib/constants";

const STEP_COUNT = 7;

export default function ProjectBriefing() {
  const [answers, setAnswers] = useState<BriefingAnswers>(EMPTY_BRIEFING);
  const [step, setStep] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [editingFromReview, setEditingFromReview] = useState(false);
  const [focusHeading, setFocusHeading] = useState(false);
  const [stepError, setStepError] = useState("");
  const [whatsAppReady, setWhatsAppReady] = useState(false);
  const [whatsAppError, setWhatsAppError] = useState("");
  const reduceMotion = useReducedMotion();

  const update = <K extends keyof BriefingAnswers>(key: K, value: BriefingAnswers[K]) => {
    setAnswers((current) => {
      if (key === "projectType" && current.projectType !== value) {
        return { ...current, projectType: value as BriefingAnswers["projectType"], features: [] };
      }
      return { ...current, [key]: value };
    });
    setStepError("");
    setWhatsAppReady(false);
    setWhatsAppError("");
  };

  const validateStep = () => {
    if (step === 0 && !answers.projectType) return "Selecione uma opção para continuar.";
    if (step === 1 && !answers.need.trim()) return "Conte brevemente o que precisa funcionar.";
    if (step === 2 && !answers.stage) return "Selecione o estágio atual do projeto.";
    if (step === 3 && answers.features.length === 0) return "Selecione pelo menos uma funcionalidade.";
    if (step === 4 && !answers.deadline) return "Selecione uma opção de prazo.";
    if (step === 4 && answers.deadline === "specific" && !answers.deadlineDate) return "Informe a data desejada.";
    if (step === 5 && !answers.budget) return "Selecione uma faixa de investimento.";
    if (step === 6) {
      const contactErrors: string[] = [];
      const phoneDigits = answers.whatsapp.replace(/\D/g, "");
      if (!answers.name.trim()) contactErrors.push("name:Informe seu nome.");
      if (!phoneDigits) contactErrors.push("whatsapp:Informe seu WhatsApp para continuar.");
      else if (phoneDigits.length < 10 || phoneDigits.length > 15) contactErrors.push("whatsapp:Confira o número do WhatsApp.");
      if (answers.email && !/^\S+@\S+\.\S+$/.test(answers.email)) contactErrors.push("email:Confira o endereço de e-mail.");
      return contactErrors.join("|");
    }
    return "";
  };

  const continueFlow = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validateStep();
    setStepError(error);
    if (error) return;

    setFocusHeading(true);
    if (editingFromReview) {
      setEditingFromReview(false);
      setReviewing(true);
      return;
    }
    if (step === STEP_COUNT - 1) {
      setReviewing(true);
      return;
    }
    setStep((current) => current + 1);
  };

  const goBack = () => {
    setStepError("");
    setFocusHeading(true);
    if (editingFromReview) {
      setEditingFromReview(false);
      setReviewing(true);
      return;
    }
    setStep((current) => Math.max(0, current - 1));
  };

  const editStep = (targetStep: number) => {
    setStep(targetStep);
    setStepError("");
    setReviewing(false);
    setEditingFromReview(true);
    setFocusHeading(true);
  };

  const whatsAppUrl = useMemo(() => {
    if (!reviewing) return "";
    const deadline = answers.deadline === "specific"
      ? `Data específica: ${answers.deadlineDate.split("-").reverse().join("/")}`
      : getOptionLabel(DEADLINE_OPTIONS, answers.deadline);
    const message = [
      "Olá! Conheci a KAIROS pelo site e gostaria de solicitar um orçamento.",
      "",
      `Projeto: ${getOptionLabel(PROJECT_TYPE_OPTIONS, answers.projectType)}`,
      "",
      "Necessidade:",
      answers.need.trim(),
      "",
      `Estágio: ${getOptionLabel(PROJECT_STAGE_OPTIONS, answers.stage)}`,
      "",
      `Funcionalidades: ${answers.features.join(", ")}`,
      "",
      `Prazo: ${deadline}`,
      "",
      `Faixa de investimento: ${getOptionLabel(BUDGET_RANGES, answers.budget)}`,
      "",
      `Nome: ${answers.name.trim()}`,
      answers.company.trim() ? `Empresa: ${answers.company.trim()}` : null,
      `WhatsApp: ${answers.whatsapp.trim()}`,
      answers.email.trim() ? `E-mail: ${answers.email.trim()}` : null,
    ].filter((line): line is string => line !== null).join("\n");

    try {
      return buildWhatsAppMessageUrl(message);
    } catch {
      return "";
    }
  }, [answers, reviewing]);

  const openWhatsApp = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!whatsAppUrl) {
      event.preventDefault();
      setWhatsAppError("Não foi possível abrir o WhatsApp. Tente novamente.");
      return;
    }
    setWhatsAppReady(true);
    setWhatsAppError("");
  };

  const stepContent = [
    <ProjectTypeStep key="type" answers={answers} update={update} error={stepError} focusHeading={focusHeading} />,
    <NeedStep key="need" answers={answers} update={update} error={stepError} focusHeading={focusHeading} />,
    <StageStep key="stage" answers={answers} update={update} error={stepError} focusHeading={focusHeading} />,
    <FeaturesStep key="features" answers={answers} update={update} error={stepError} focusHeading={focusHeading} />,
    <TimelineStep key="timeline" answers={answers} update={update} error={stepError} focusHeading={focusHeading} />,
    <BudgetStep key="budget" answers={answers} update={update} error={stepError} focusHeading={focusHeading} />,
    <ContactStep key="contact" answers={answers} update={update} error={stepError} focusHeading={focusHeading} />,
  ];

  return (
    <section className="project-briefing" id="briefing" aria-labelledby="briefing-title">
      <div className="section-shell">
        <header className="project-briefing__heading">
          <span className="section-label">Novo projeto</span>
          <h2 id="briefing-title">O que você precisa construir?</h2>
          <p>Conte um pouco sobre o projeto. A KAIROS organiza o briefing e prepara sua solicitação de orçamento.</p>
        </header>

        <div className="project-briefing__stage">
          {!reviewing ? <span className="briefing-progress" aria-live="polite">Etapa {String(step + 1).padStart(2, "0")} de {String(STEP_COUNT).padStart(2, "0")}</span> : null}
          <AnimatePresence mode="wait" initial={false}>
            {reviewing ? (
              <m.div key="review" initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: reduceMotion ? 0 : 0.28 }}>
                <BriefingReview answers={answers} whatsAppUrl={whatsAppUrl} whatsAppReady={whatsAppReady} whatsAppError={whatsAppError} onEdit={editStep} onWhatsAppClick={openWhatsApp} />
              </m.div>
            ) : (
              <m.form key={step} className="briefing-form" onSubmit={continueFlow} noValidate initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: reduceMotion ? 0 : 0.24 }}>
                {stepContent[step]}
                <div className="briefing-actions">
                  {step > 0 || editingFromReview ? <button className="text-link" type="button" onClick={goBack}>Voltar</button> : <span />}
                  <button className="button" type="submit">{editingFromReview ? "Salvar alteração" : step === STEP_COUNT - 1 ? "Revisar briefing" : "Continuar"}<span aria-hidden="true">→</span></button>
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
