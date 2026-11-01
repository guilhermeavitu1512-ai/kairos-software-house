"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/constants";
import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";
import styles from "./MobileContactBar.module.css";

// Keeps contact one tap away on phones once the visitor has left the first screen.
export default function MobileContactBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className={styles.spacer} aria-hidden="true" />
      <div className={styles.bar} data-visible={visible}>
        <ProblemFlowTrigger className={styles.primary} tabIndex={visible ? 0 : -1}>Pedir orçamento <span aria-hidden="true">→</span></ProblemFlowTrigger>
        <a className={styles.secondary} href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" tabIndex={visible ? 0 : -1} data-conversion="whatsapp_open" data-source="mobile_bar">WhatsApp</a>
      </div>
    </>
  );
}
