"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Solutions.module.css";

type Demo = { notify: (text: string) => void };

const SLOTS = ["09:00", "10:30", "11:15", "14:00", "15:30", "17:00"];
const TAKEN = new Set(["10:30", "15:30"]);
const ORDER_STEPS = ["Pedido recebido", "Em preparo", "Saiu para entrega", "Entregue"];
const PRODUCTS = [{ name: "Relógio Clássico", price: 349 }, { name: "Relógio Esportivo", price: 429 }, { name: "Pulseira de couro", price: 89 }];

function Booking({ notify }: Demo) {
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  if (booked) return (
    <div className={styles.done} role="status">
      <strong>Horário reservado</strong>
      <p>Terça, {slot}. Sem ligação e sem esperar resposta.</p>
      <button type="button" onClick={() => { setBooked(false); setSlot(null); }}>Testar de novo</button>
    </div>
  );
  return (
    <>
      <h4>Escolha um horário</h4>
      <p className={styles.hint}>Degradê · terça-feira</p>
      <div className={styles.slots}>
        {SLOTS.map((time) => <button key={time} type="button" disabled={TAKEN.has(time)} aria-pressed={slot === time} onClick={() => setSlot(time)}>{time}</button>)}
      </div>
      <button className={styles.action} type="button" disabled={!slot} onClick={() => { setBooked(true); notify(`Novo agendamento: terça, ${slot}`); }}>{slot ? `Confirmar ${slot}` : "Toque em um horário"}</button>
    </>
  );
}

function Orders({ notify }: Demo) {
  const [step, setStep] = useState(-1);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);
  const start = () => {
    window.clearInterval(timer.current);
    setStep(0);
    notify("Novo pedido: R$ 58, sem comissão");
    let next = 0;
    timer.current = window.setInterval(() => {
      next += 1;
      setStep(next);
      if (next >= ORDER_STEPS.length - 1) window.clearInterval(timer.current);
    }, 1000);
  };
  const running = step >= 0 && step < ORDER_STEPS.length - 1;
  return (
    <>
      <h4>2 × Double Blend</h4>
      <p className={styles.hint}>R$ 58 · entrega na sua casa</p>
      <ol className={styles.order} aria-live="polite">
        {ORDER_STEPS.map((label, index) => <li key={label} data-state={index < step ? "done" : index === step ? "now" : "next"}>{label}</li>)}
      </ol>
      <button className={styles.action} type="button" disabled={running} onClick={start}>{step < 0 ? "Fazer pedido" : running ? "Acompanhando…" : "Pedir de novo"}</button>
    </>
  );
}

function Catalog({ notify }: Demo) {
  const [picked, setPicked] = useState<string[]>([]);
  const total = PRODUCTS.filter((item) => picked.includes(item.name)).reduce((sum, item) => sum + item.price, 0);
  return (
    <>
      <h4>Coleção</h4>
      <p className={styles.hint}>Toque para escolher</p>
      <div className={styles.products}>
        {PRODUCTS.map((item) => (
          <button key={item.name} type="button" aria-pressed={picked.includes(item.name)} onClick={() => setPicked((current) => (current.includes(item.name) ? current.filter((name) => name !== item.name) : [...current, item.name]))}>
            <span>{item.name}</span><strong>R$ {item.price}</strong>
          </button>
        ))}
      </div>
      <button className={styles.action} type="button" disabled={!picked.length} aria-live="polite" onClick={() => notify(`Nova venda na loja: R$ ${total}`)}>{picked.length ? `Comprar · R$ ${total}` : "Escolha uma peça"}</button>
    </>
  );
}

function Page({ notify }: Demo) {
  const [called, setCalled] = useState(false);
  if (called) return (
    <div className={styles.done} role="status">
      <strong>Conversa aberta</strong>
      <p>O cliente chega sabendo o serviço, o preço e o endereço.</p>
      <button type="button" onClick={() => setCalled(false)}>Testar de novo</button>
    </div>
  );
  return (
    <>
      <h4>Beleza com hora marcada</h4>
      <p className={styles.hint}>Rua das Flores, 120 · aberto até 19h</p>
      <ul className={styles.services}><li>Corte <b>R$ 60</b></li><li>Escova <b>R$ 45</b></li><li>Coloração <b>R$ 120</b></li></ul>
      <button className={styles.action} type="button" onClick={() => { setCalled(true); notify("Novo cliente no seu WhatsApp"); }}>Chamar no WhatsApp</button>
    </>
  );
}

export const DEMOS = { agenda: Booking, pedidos: Orders, catalogo: Catalog, pagina: Page };
