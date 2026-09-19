"use client";

import { useState } from "react";
import { COMPANY, buildWhatsAppMessageUrl } from "@/lib/constants";
import { buildProblemMessage, type ProblemAnswers } from "@/data/problem-flow";
import styles from "./ProblemFlow.module.css";

export function hasCompanyWhatsApp() {
  return /^\d{10,15}$/.test(COMPANY.whatsapp.replace(/\D/g, ""));
}
export default function WhatsAppAction({ answers }: { answers: ProblemAnswers }) {
  const [status, setStatus] = useState("");
  const [showCopy, setShowCopy] = useState(false);
  const message = buildProblemMessage(answers);
  const configured = hasCompanyWhatsApp();
  async function copy() {
    // Manual copying remains available even while the browser asks for permission.
    setShowCopy(true);
    setStatus("Você também pode selecionar e copiar o resumo abaixo.");
    try { await navigator.clipboard.writeText(message); setStatus("Resumo copiado."); }
    catch { setShowCopy(true); setStatus("Selecione e copie o resumo abaixo."); }
  }
  return <div className={styles.whatsapp}>
    <p className={styles.ready}>Briefing pronto.</p>
    <p className={styles.hint}>O site prepara a mensagem. Você confirma o envio no WhatsApp.</p>
    {configured ? <a className={styles.primary} href={buildWhatsAppMessageUrl(message)} target="_blank" rel="noopener noreferrer" onClick={() => setStatus("Seu briefing continua aqui caso queira ajustar alguma informação.")}>Continuar no WhatsApp <span aria-hidden="true">→</span></a> : <p role="status" className={styles.hint}>WhatsApp indisponível no momento. Você pode copiar seu resumo e mantê-lo com você.</p>}
    <button type="button" className={styles.textButton} onClick={copy}>Copiar resumo</button>
    {configured && <p className={styles.hint}>O WhatsApp não abriu? Tente o link novamente ou copie o resumo.</p>}
    <p role="status" className={styles.hint}>{status}</p>
    {showCopy && <label className={styles.field}>Resumo para copiar<textarea readOnly value={message} rows={8} onFocus={e => e.target.select()} /></label>}
  </div>;
}
