"use client";

import { useEffect, useRef, type MouseEvent } from "react";

import {
  BUDGET_RANGES,
  DEADLINE_OPTIONS,
  PROJECT_STAGE_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  getOptionLabel,
  type BriefingAnswers,
} from "@/data/briefing";

type BriefingReviewProps = {
  answers: BriefingAnswers;
  whatsAppUrl: string;
  whatsAppReady: boolean;
  whatsAppError: string;
  onEdit: (step: number) => void;
  onWhatsAppClick: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const formatDate = (value: string) => {
  if (!value) return "Data não informada";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

export default function BriefingReview({ answers, whatsAppUrl, whatsAppReady, whatsAppError, onEdit, onWhatsAppClick }: BriefingReviewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const deadline = answers.deadline === "specific"
    ? `Data específica: ${formatDate(answers.deadlineDate)}`
    : getOptionLabel(DEADLINE_OPTIONS, answers.deadline);
  const contact = [answers.name, answers.company, answers.whatsapp, answers.email].filter(Boolean).join(" / ");
  const items = [
    { label: "Projeto", value: getOptionLabel(PROJECT_TYPE_OPTIONS, answers.projectType), step: 0 },
    { label: "Necessidade", value: answers.need, step: 1 },
    { label: "Estágio", value: getOptionLabel(PROJECT_STAGE_OPTIONS, answers.stage), step: 2 },
    { label: "Funcionalidades", value: answers.features.join(", "), step: 3 },
    { label: "Prazo", value: deadline, step: 4 },
    { label: "Investimento", value: getOptionLabel(BUDGET_RANGES, answers.budget), step: 5 },
    { label: "Contato", value: contact, step: 6 },
  ];

  return (
    <div className="briefing-review">
      <span className="briefing-step__eyebrow">Revisão</span>
      <h3 ref={headingRef} tabIndex={-1}>Seu briefing</h3>
      <p>Confira as informações antes de continuar para o WhatsApp.</p>
      <dl>
        {items.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
            <button type="button" onClick={() => onEdit(item.step)} aria-label={`Editar ${item.label.toLowerCase()}`}>Editar</button>
          </div>
        ))}
      </dl>
      <div className="briefing-review__action">
        <div aria-live="polite">
          {whatsAppReady ? <><strong>Briefing pronto.</strong><span>Revise a mensagem no WhatsApp e envie quando estiver pronto.</span></> : <><strong>Pronto para enviar.</strong><span>A conversa será aberta com o briefing preenchido.</span></>}
          {whatsAppError ? <span className="briefing-error" role="alert">{whatsAppError}</span> : null}
        </div>
        <a className="button" href={whatsAppUrl || undefined} target="_blank" rel="noreferrer" onClick={onWhatsAppClick}>
          {whatsAppReady ? "Continuar no WhatsApp" : "Enviar para a KAIROS"}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
