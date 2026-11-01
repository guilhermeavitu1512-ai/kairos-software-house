"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Home.module.css";

const CHAT = [
  { me: false, text: "Oi, tem horário hoje?" },
  { me: false, text: "Qual o preço do corte + barba?" },
  { me: false, text: "Vocês abrem no sábado?" },
  { me: false, text: "Olá??" },
  { me: true, text: "Desculpa a demora, só vi agora!" },
  { me: false, text: "Já marquei em outro lugar." },
];

export default function BeforeAfter() {
  const [split, setSplit] = useState(50);
  return (
    <section className={styles.section} aria-labelledby="compare-title">
      <div className={styles.shell}>
        <header className={styles.head}>
          <p className={styles.kicker}>Antes e depois</p>
          <h2 id="compare-title">Arraste e veja a diferença.</h2>
          <p>De responder tudo à mão para um site que atende sozinho.</p>
        </header>
        <div className={styles.compare} style={{ "--split": `${split}%` } as React.CSSProperties}>
          <div className={styles.compareAfter}>
            <Image unoptimized src="/portfolio/cassio/agenda-1440.webp" alt="Site com agendamento on-line da barbearia Cássio Franklin" fill sizes="(max-width: 1200px) 92vw, 1120px" />
            <span>Com site</span>
          </div>
          <div className={styles.compareBefore}>
            <div className={styles.chat} aria-label="Exemplo de conversa com mensagens sem resposta">
              {CHAT.map((message) => <p key={message.text} data-me={message.me}>{message.text}</p>)}
            </div>
            <span>Só no WhatsApp</span>
          </div>
          <div className={styles.compareHandle} aria-hidden="true" />
          <input type="range" min={5} max={95} value={split} onChange={(event) => setSplit(Number(event.target.value))} aria-label="Comparar atendimento só pelo WhatsApp e com site" />
        </div>
      </div>
    </section>
  );
}
