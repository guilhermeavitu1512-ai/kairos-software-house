"use client";

import { useRef, type ReactNode } from "react";
import { m, useInView } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import styles from "./pricing.module.css";

export interface PricingPlan {
  id: string;
  name: string;
  upfront: string;
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

export function Pricing<Plan extends PricingPlan>({ plans, highlightId, badge, renderAction }: PricingProps<Plan>) {
  const isDesktop = useMediaQuery("(min-width: 861px)");
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.2 });

  return (
    <div>
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
              <p className={styles.price}><strong>R$ {plan.upfront}</strong><small>à vista</small></p>
              <p className={styles.setup}>ou 12x de R$ {plan.installment} sem juros</p>
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
