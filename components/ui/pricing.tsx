"use client";

import { useRef, useState, type ReactNode } from "react";
import { m, useInView } from "framer-motion";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import styles from "./pricing.module.css";

export interface PricingPlan {
  id: string;
  name: string;
  upfront: string;
  monthly: string;
  installment: string;
  delivery: string;
  description: string;
  features: readonly string[];
}

interface PricingProps<Plan extends PricingPlan> {
  plans: readonly Plan[];
  highlightId: string;
  badge: string;
  renderAction: (plan: Plan, highlighted: boolean) => ReactNode;
}

const CONFETTI_COLORS = ["#ffb75e", "#ffc67d", "#f5f7fa", "#6e9bff"];

const toNumber = (price: string) => Number(price.replace(",", "."));

export function Pricing<Plan extends PricingPlan>({ plans, highlightId, badge, renderAction }: PricingProps<Plan>) {
  const [installments, setInstallments] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 861px)");
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.2 });

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setInstallments(!installments);
    if (installments) return;
    const box = event.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: (box.left + box.width / 2) / window.innerWidth, y: (box.top + box.height / 2) / window.innerHeight },
      colors: CONFETTI_COLORS,
      ticks: 200,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
      shapes: ["circle"],
      disableForReducedMotion: true,
    });
  };

  return (
    <div>
      <div className={styles.billing}>
        <button type="button" role="switch" aria-checked={installments} className={styles.switch} onClick={toggle}>
          <span className={styles.track} aria-hidden="true"><i /></span>
          Pagar a criação em 3x
        </button>
      </div>

      <div ref={gridRef} className={styles.grid}>
        {plans.map((plan, index) => {
          const highlighted = plan.id === highlightId;
          const shift = index === 0 ? 24 : index === plans.length - 1 ? -24 : 0;
          return (
            <m.article
              key={plan.id}
              className={styles.card}
              data-highlight={highlighted}
              initial={false}
              animate={isDesktop && inView ? { y: highlighted ? -16 : 0, x: highlighted ? 0 : shift, scale: highlighted ? 1 : 0.95 } : { y: 0, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 22 }}
            >
              {highlighted && <p className={styles.badge}>★ {badge}</p>}
              <h3>{plan.name}</h3>
              <p className={styles.price}><strong>R$ {plan.monthly}</strong><small>/mês</small></p>
              <p className={styles.setup}>
                + {installments && "3x de "}
                <NumberFlow
                  value={toNumber(installments ? plan.installment : plan.upfront)}
                  locales="pt-BR"
                  format={{ style: "currency", currency: "BRL", minimumFractionDigits: installments ? 2 : 0, maximumFractionDigits: 2 }}
                  transformTiming={{ duration: 500, easing: "ease-out" }}
                  willChange
                />
                {" "}na criação do site
              </p>
              <p className={styles.terms}>Pronto em {plan.delivery}</p>
              <p className={styles.description}>{plan.description}</p>
              <ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              {renderAction(plan, highlighted)}
            </m.article>
          );
        })}
      </div>
    </div>
  );
}
