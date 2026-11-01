"use client";

import { useEffect, useRef, useState } from "react";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import styles from "./Home.module.css";

const SLOTS = ["09:00", "10:30", "11:15", "14:00", "15:30", "17:00"];
const TAKEN = new Set(["10:30", "15:30"]);
const ORDER_STEPS = ["Pedido recebido", "Em preparo", "Saiu para entrega", "Entregue"];

function BookingDemo() {
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  return (
    <article className={styles.demo}>
      <p className={styles.kicker}>Agenda online</p>
      <h3>Marque como um cliente.</h3>
      {booked ? (
        <div className={styles.demoDone} role="status">
          <strong>Horário reservado: terça, {slot}</strong>
          <p>Degradê com Cássio. Sem ligação e sem esperar resposta.</p>
          <div className={styles.demoNext}>
            <ProblemFlowTrigger subject="Agendamento online">Quero isso no meu negócio →</ProblemFlowTrigger>
            <button type="button" onClick={() => { setBooked(false); setSlot(null); }}>Testar de novo</button>
          </div>
        </div>
      ) : (
        <>
          <p className={styles.demoHint}>Degradê · terça-feira</p>
          <div className={styles.slots}>
            {SLOTS.map((time) => (
              <button key={time} type="button" disabled={TAKEN.has(time)} aria-pressed={slot === time} onClick={() => setSlot(time)}>{time}</button>
            ))}
          </div>
          <button className={styles.demoAction} type="button" disabled={!slot} onClick={() => setBooked(true)}>{slot ? `Confirmar ${slot}` : "Escolha um horário"}</button>
        </>
      )}
    </article>
  );
}

function OrderDemo() {
  const [step, setStep] = useState(-1);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);

  const start = () => {
    window.clearInterval(timer.current);
    setStep(0);
    let next = 0;
    timer.current = window.setInterval(() => {
      next += 1;
      setStep(next);
      if (next >= ORDER_STEPS.length - 1) window.clearInterval(timer.current);
    }, 1100);
  };

  return (
    <article className={styles.demo}>
      <p className={styles.kicker}>Pedido on-line</p>
      <h3>Acompanhe um pedido.</h3>
      <p className={styles.demoHint}>2 × Double Blend · exemplo</p>
      <ol className={styles.order} aria-live="polite">
        {ORDER_STEPS.map((label, index) => <li key={label} data-state={index < step ? "done" : index === step ? "now" : "next"}>{label}</li>)}
      </ol>
      {step === ORDER_STEPS.length - 1 && <ProblemFlowTrigger className={styles.demoFollow} subject="Pedidos pelo site">Quero receber pedidos assim →</ProblemFlowTrigger>}
      <button className={styles.demoAction} type="button" onClick={start} disabled={step >= 0 && step < ORDER_STEPS.length - 1}>{step < 0 ? "Fazer pedido de teste" : step < ORDER_STEPS.length - 1 ? "Acompanhando…" : "Pedir de novo"}</button>
    </article>
  );
}

export default function LiveDemos() {
  return (
    <section id="demonstracoes" className={styles.section} aria-labelledby="demos-title">
      <div className={styles.shell}>
        <header className={styles.head}>
          <p className={styles.kicker}>Experimente</p>
          <h2 id="demos-title">Não acredite nos prints. Teste.</h2>
          <p>É isso que o seu cliente vai sentir. Nada aqui é enviado a ninguém.</p>
        </header>
        <div className={styles.demos}><BookingDemo /><OrderDemo /></div>
      </div>
    </section>
  );
}
