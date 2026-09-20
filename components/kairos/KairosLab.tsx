import Image from "next/image";
import Link from "next/link";
import { portfolioProjects } from "@/data/projects";
import styles from "./KairosLab.module.css";

export default function KairosLab() {
  return <section id="projetos" className={styles.lab} aria-labelledby="lab-title">
    <header className={styles.intro}><div className={styles.shell}><h2 id="lab-title">Veja o trabalho na prática.</h2><p>Telas e funcionalidades de projetos desenvolvidos pela KAIROS. Veja os detalhes para avaliar o que faz sentido para o seu negócio.</p></div></header>
    <div className={`${styles.shell} ${styles.portfolioGrid}`}>
      {portfolioProjects.map(project=><article key={project.id} className={styles.portfolioCard}>
        <Link href={project.url} aria-label={`Ver projeto ${project.name}`} className={styles.portfolioImage}><Image src={project.image} alt={`Página do projeto ${project.name}`} width={1440} height={1000} sizes="(max-width:760px) calc(100vw - 40px), 600px" /></Link>
        <p className={styles.portfolioType}>{project.id === "kairos" ? "SITE PRÓPRIO · KAIROS" : "PROJETO DESENVOLVIDO · CATÁLOGO DE RELÓGIOS"}</p>
        <h3>{project.name}</h3><p>{project.description}</p>
        <Link className={styles.link} href={project.url}>{project.id === "kairos" ? "Explorar este site" : "Ver telas e funcionalidades"} <span aria-hidden="true">→</span></Link>
      </article>)}
    </div>
  </section>;
}
