"use client";

import { useEffect, useRef, useState } from "react";
import { ProblemFlowTrigger } from "@/components/kairos/problem-flow/ProblemFlow";
import styles from "./SiteExplorer.module.css";

export interface ExplorableProject { name: string; liveUrl: string; }

// Opens the published demo inside a phone, so the visitor explores it without leaving the page.
export default function SiteExplorer({ project, onClose }: { project: ExplorableProject; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Heavy sites still paint while loading, so the notice never hides them for long.
    const timer = window.setTimeout(() => setLoaded(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    node.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { node.close(); document.body.style.overflow = previousOverflow; };
  }, []);

  return (
    <dialog ref={dialog} className={styles.dialog} aria-label={`Explorar o site ${project.name}`} onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <div className={styles.bar}>
        <p><strong>{project.name}</strong><span>Demonstração: use à vontade</span></p>
        <a className={styles.open} href={project.liveUrl} target="_blank" rel="noopener noreferrer">Abrir em nova aba ↗</a>
        <button type="button" onClick={onClose}>Fechar <span aria-hidden="true">×</span></button>
      </div>
      <div className={styles.stage}>
        <div className={styles.phone}>
          {!loaded && <p className={styles.loading} role="status">Abrindo o site…</p>}
          <iframe src={project.liveUrl} title={`Site ${project.name} funcionando`} onLoad={() => setLoaded(true)} />
        </div>
        <div className={styles.side}>
          <h2>Gostou de como funciona?</h2>
          <p>Mexa no site como um cliente. Depois, conte o que o seu negócio precisa.</p>
          <ProblemFlowTrigger className={styles.cta} subject={`Quero um site como o ${project.name}`} onClick={onClose}>Quero um site assim <span aria-hidden="true">→</span></ProblemFlowTrigger>
        </div>
      </div>
    </dialog>
  );
}
