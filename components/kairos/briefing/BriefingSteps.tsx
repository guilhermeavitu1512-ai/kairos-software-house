"use client";

import BriefingOptionList from "@/components/kairos/briefing/BriefingOptionList";
import BriefingStep from "@/components/kairos/briefing/BriefingStep";
import {
  BUDGET_RANGES,
  DEADLINE_OPTIONS,
  FEATURES_BY_PROJECT,
  PROJECT_STAGE_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  type BriefingAnswers,
} from "@/data/briefing";

type StepProps = {
  answers: BriefingAnswers;
  update: <K extends keyof BriefingAnswers>(key: K, value: BriefingAnswers[K]) => void;
  error?: string;
  focusHeading: boolean;
};

function ErrorMessage({ id, children }: { id: string; children?: string }) {
  return children ? <p className="briefing-error" id={id} role="alert">{children}</p> : null;
}

export function ProjectTypeStep({ answers, update, error, focusHeading }: StepProps) {
  return (
    <BriefingStep eyebrow="Definição" title="O que você quer construir?" focusHeading={focusHeading}>
      <BriefingOptionList legend="Tipo de projeto" options={PROJECT_TYPE_OPTIONS} value={answers.projectType} onChange={(value) => update("projectType", value)} />
      {answers.projectType === "unknown" ? <p className="briefing-context">Sem problema. Conte o que você precisa organizar e a KAIROS ajuda a identificar o melhor caminho.</p> : null}
      <ErrorMessage id="briefing-type-error">{error}</ErrorMessage>
    </BriefingStep>
  );
}

export function NeedStep({ answers, update, error, focusHeading }: StepProps) {
  return (
    <BriefingStep eyebrow="Contexto" title="Qual necessidade você quer resolver?" description="Explique com suas palavras. Não é preciso conhecer a tecnologia." focusHeading={focusHeading}>
      <label className="briefing-textarea">
        <span className="sr-only">Necessidade do projeto</span>
        <textarea
          value={answers.need}
          onChange={(event) => update("need", event.target.value)}
          placeholder="Hoje fazemos esse processo manualmente e queremos automatizar..."
          maxLength={700}
          rows={7}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "briefing-need-error" : "briefing-need-count"}
        />
        <small id="briefing-need-count">{answers.need.length} / 700</small>
      </label>
      <ErrorMessage id="briefing-need-error">{error}</ErrorMessage>
    </BriefingStep>
  );
}

export function StageStep({ answers, update, error, focusHeading }: StepProps) {
  return (
    <BriefingStep eyebrow="Momento atual" title="Em que estágio o projeto está?" focusHeading={focusHeading}>
      <BriefingOptionList legend="Estágio do projeto" options={PROJECT_STAGE_OPTIONS} value={answers.stage} onChange={(value) => update("stage", value)} />
      <ErrorMessage id="briefing-stage-error">{error}</ErrorMessage>
    </BriefingStep>
  );
}

export function FeaturesStep({ answers, update, error, focusHeading }: StepProps) {
  const type = answers.projectType || "unknown";
  const options = FEATURES_BY_PROJECT[type].map((label) => ({ value: label, label }));

  return (
    <BriefingStep eyebrow="Escopo inicial" title="O que ele precisa fazer?" description="Selecione tudo o que já faz parte da sua ideia." focusHeading={focusHeading}>
      <BriefingOptionList legend="Funcionalidades do projeto" options={options} value={answers.features} onChange={(value) => update("features", value)} multiple />
      <ErrorMessage id="briefing-features-error">{error}</ErrorMessage>
    </BriefingStep>
  );
}

export function TimelineStep({ answers, update, error, focusHeading }: StepProps) {
  return (
    <BriefingStep eyebrow="Planejamento" title="Existe algum prazo?" focusHeading={focusHeading}>
      <BriefingOptionList legend="Prazo do projeto" options={DEADLINE_OPTIONS} value={answers.deadline} onChange={(value) => update("deadline", value)} />
      {answers.deadline === "specific" ? (
        <label className="briefing-date">
          <span>Data desejada</span>
          <input type="date" value={answers.deadlineDate} onChange={(event) => update("deadlineDate", event.target.value)} aria-invalid={Boolean(error && !answers.deadlineDate)} aria-describedby={error ? "briefing-deadline-error" : undefined} />
        </label>
      ) : null}
      <ErrorMessage id="briefing-deadline-error">{error}</ErrorMessage>
    </BriefingStep>
  );
}

export function BudgetStep({ answers, update, error, focusHeading }: StepProps) {
  return (
    <BriefingStep eyebrow="Contexto de investimento" title="Qual faixa de investimento você imagina?" focusHeading={focusHeading}>
      <BriefingOptionList legend="Faixa de investimento" options={BUDGET_RANGES} value={answers.budget} onChange={(value) => update("budget", value)} />
      <p className="briefing-context">A faixa ajuda a entender o escopo. O valor final depende das necessidades do projeto.</p>
      <ErrorMessage id="briefing-budget-error">{error}</ErrorMessage>
    </BriefingStep>
  );
}

export function ContactStep({ answers, update, error, focusHeading }: StepProps) {
  const errors = Object.fromEntries((error ?? "").split("|").filter(Boolean).map((item) => item.split(":"))) as Record<string, string>;

  return (
    <BriefingStep eyebrow="Contato" title="Como podemos falar com você?" description="Só pedimos o essencial para dar continuidade." focusHeading={focusHeading}>
      <div className="briefing-contact-grid">
        <label>
          <span>Nome *</span>
          <input value={answers.name} onChange={(event) => update("name", event.target.value)} maxLength={80} autoComplete="name" placeholder="Seu nome" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "briefing-name-error" : undefined} />
          <ErrorMessage id="briefing-name-error">{errors.name}</ErrorMessage>
        </label>
        <label>
          <span>Empresa</span>
          <input value={answers.company} onChange={(event) => update("company", event.target.value)} maxLength={120} autoComplete="organization" placeholder="Nome da empresa" />
        </label>
        <label>
          <span>WhatsApp *</span>
          <input value={answers.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} type="tel" inputMode="tel" maxLength={24} autoComplete="tel" placeholder="(00) 00000-0000" aria-invalid={Boolean(errors.whatsapp)} aria-describedby={errors.whatsapp ? "briefing-whatsapp-error" : undefined} />
          <ErrorMessage id="briefing-whatsapp-error">{errors.whatsapp}</ErrorMessage>
        </label>
        <label>
          <span>E-mail</span>
          <input value={answers.email} onChange={(event) => update("email", event.target.value)} type="email" inputMode="email" maxLength={254} autoComplete="email" placeholder="voce@empresa.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "briefing-email-error" : undefined} />
          <ErrorMessage id="briefing-email-error">{errors.email}</ErrorMessage>
        </label>
      </div>
    </BriefingStep>
  );
}
