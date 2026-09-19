import Link from "next/link";
import type { LabProject } from "@/data/lab";
import LabMedia from "./LabMedia";
import styles from "./KairosLab.module.css";

export default function LabCase({ project }: { project: LabProject }) {
  return <main id="conteudo" className={`${styles.case} ${styles[project.theme]}`}>
    <div className={styles.shell}>
      <Link href="/#projetos" className={styles.link}>← Voltar ao KAIROS Lab</Link>
      <header className={styles.caseHeader}>
        <span className={styles.label}>KAIROS LAB</span>
        <h1>{project.name}</h1>
        <p className={styles.type}>{project.kind} · {project.category}</p>
        <p className={styles.caseDescription}>{project.description}</p>
      </header>
      <LabMedia project={project} />
    </div>
  </main>;
}
