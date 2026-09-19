import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

export default function ProjectFilters() {
  return (
    <div className="projects-directory">
      {projects.map((project) => (
        <article key={project.slug} className="directory-project">
          <Link href={`/projetos/${project.slug}`} aria-label={`Explorar projeto ${project.name}`}>
            <div className="directory-project-image">
              <Image
                src={project.image}
                alt={`Interface do projeto ${project.name}`}
                fill
                sizes="(max-width: 760px) calc(100vw - 40px), 1320px"
                quality={84}
              />
            </div>
            <div className="directory-copy">
              <span>{project.caseCategory}</span>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <strong>Explorar projeto <i>→</i></strong>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
