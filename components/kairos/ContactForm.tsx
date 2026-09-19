"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_BUDGETS, PROJECT_TYPES, buildWhatsAppMessageUrl } from "@/lib/constants";

type Errors = Partial<Record<"name" | "email" | "project" | "description", string>>;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "opening" | "ready">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [whatsAppUrl, setWhatsAppUrl] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const next: Errors = {};
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const company = String(form.get("company") ?? "").trim();
    const whatsapp = String(form.get("whatsapp") ?? "").trim();
    const project = String(form.get("project") ?? "").trim();
    const budget = String(form.get("budget") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();

    if (!name) next.name = "Informe seu nome.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Informe um e-mail válido.";
    if (!project) next.project = "Selecione o tipo de projeto.";
    if (description.length < 20) next.description = "Descreva o projeto em pelo menos 20 caracteres.";
    setErrors(next);
    if (Object.keys(next).length) {
      const firstInvalidField = Object.keys(next)[0] as keyof Errors;
      window.requestAnimationFrame(() => {
        formElement.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)?.focus();
      });
      return;
    }

    const message = [
      "Olá! Conheci a KAIROS pelo site e gostaria de solicitar um orçamento.",
      "",
      `Nome: ${name}`,
      company ? `Empresa: ${company}` : null,
      `E-mail: ${email}`,
      whatsapp ? `WhatsApp: ${whatsapp}` : null,
      `Tipo de projeto: ${project}`,
      budget ? `Orçamento estimado: ${budget}` : null,
      "",
      "Descrição do projeto:",
      description,
    ].filter((line): line is string => line !== null).join("\n");

    const url = buildWhatsAppMessageUrl(message);
    setStatus("opening");
    setWhatsAppUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    window.requestAnimationFrame(() => setStatus("ready"));
  };

  if (status === "ready") return <div className="form-success" role="status"><span>WhatsApp preparado</span><h2>Seu briefing está pronto.</h2><p>Revise a mensagem no WhatsApp e toque em enviar para concluir o contato com a KAIROS.</p><a className="button" href={whatsAppUrl} target="_blank" rel="noreferrer">Abrir WhatsApp <span aria-hidden="true">↗</span></a><button type="button" className="text-link" onClick={() => { setStatus("idle"); setWhatsAppUrl(""); }}>Preencher outro briefing</button></div>;

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label><span>Nome *</span><input name="name" required maxLength={80} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} placeholder="Seu nome" />{errors.name && <small id="name-error" role="alert">{errors.name}</small>}</label>
        <label><span>Empresa</span><input name="company" maxLength={120} autoComplete="organization" placeholder="Nome da empresa" /></label>
        <label><span>E-mail *</span><input name="email" type="email" required maxLength={254} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} placeholder="voce@empresa.com" />{errors.email && <small id="email-error" role="alert">{errors.email}</small>}</label>
        <label><span>WhatsApp</span><input name="whatsapp" type="tel" maxLength={30} autoComplete="tel" inputMode="tel" placeholder="(00) 00000-0000" /></label>
        <label><span>Tipo de projeto *</span><select name="project" required defaultValue="" aria-invalid={Boolean(errors.project)} aria-describedby={errors.project ? "project-error" : undefined}><option value="" disabled>Selecione uma opção</option>{PROJECT_TYPES.map((item) => <option key={item}>{item}</option>)}</select>{errors.project && <small id="project-error" role="alert">{errors.project}</small>}</label>
        <label><span>Orçamento estimado</span><select name="budget" defaultValue=""><option value="" disabled>Selecione uma faixa</option>{CONTACT_BUDGETS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="form-full"><span>Descrição *</span><textarea name="description" required minLength={20} maxLength={1200} rows={6} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined} placeholder="Conte o que precisa ser construído. Contexto, objetivo e prazo ajudam a começar melhor." />{errors.description && <small id="description-error" role="alert">{errors.description}</small>}</label>
      </div>
      <div className="form-action"><p>Seu briefing será aberto no WhatsApp para você revisar antes de enviar.</p><button className="button" type="submit" disabled={status === "opening"}>{status === "opening" ? "Abrindo WhatsApp…" : "Continuar no WhatsApp"}<span aria-hidden="true">↗</span></button></div>
    </form>
  );
}
