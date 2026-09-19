import Link from "next/link";
import { labProjects } from "@/data/lab";
import LabMedia from "./LabMedia";
import Reveal from "./Reveal";
import styles from "./KairosLab.module.css";

export default function KairosLab() {
  return <section id="projetos" className={styles.lab} aria-labelledby="lab-title">
    <header className={styles.intro}>
      <div className={styles.shell}>
        <Reveal>
          <h2 id="lab-title">KAIROS <span>Lab</span></h2>
          <p>Projetos autorais e conceituais. Diferentes contextos, novas possibilidades.</p>
        </Reveal>
      </div>
    </header>
    <div id="repertorio">
      {labProjects.map((project) => <article key={project.slug} className={`${styles.project} ${styles[project.theme]}`} aria-labelledby={`lab-${project.slug}`}>
        <div className={styles.shell}>
          <Reveal className={styles.projectLayout}>
            <header className={styles.projectHeader}>
              <h3 id={`lab-${project.slug}`}>{project.name}</h3>
              <p className={styles.type}>{project.kind} <span aria-hidden="true">·</span> {project.category}</p>
            </header>
            <LabMedia project={project} />
            <div className={styles.projectFooter}>
              <p>{project.description}</p>
              <Link className={styles.link} href={`/projetos/${project.slug}`} aria-label={`Explorar projeto ${project.name}`}>Explorar projeto <span aria-hidden="true">→</span></Link>
            </div>
          </Reveal>
        </div>
      </article>)}
    </div>
  </section>;
}
