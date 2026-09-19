import Image from "next/image";
import type { LabProject } from "@/data/lab";
import styles from "./KairosLab.module.css";

export default function LabMedia({ project }: { project: LabProject }) {
  return <div className={styles.media}>
    {project.image ? <Image
      src={project.image.src}
      alt={project.image.alt}
      width={project.image.width}
      height={project.image.height}
      sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 64px), 1232px"
      loading="lazy"
    /> : <div className={styles.placeholder} role="img" aria-label={`Prévia de ${project.name} ainda não disponível`}>
      <span>Prévia visual em breve</span>
    </div>}
  </div>;
}
