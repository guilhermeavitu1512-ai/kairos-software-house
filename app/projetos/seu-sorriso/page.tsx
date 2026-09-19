import type { Metadata } from "next";
import LabCase from "@/components/kairos/LabCase";
import { labProjects } from "@/data/lab";

const project = labProjects[1];
export const metadata: Metadata = {
  title: "Seu Sorriso — KAIROS Lab",
  description: `${project.kind}. ${project.description}`,
  openGraph: { title: "Seu Sorriso — KAIROS Lab", description: project.description, images: [] },
  twitter: { card: "summary", title: "Seu Sorriso — KAIROS Lab", description: project.description, images: [] },
};
export default function Page() { return <LabCase project={project} />; }
