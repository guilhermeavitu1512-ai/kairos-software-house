import type { Metadata } from "next";
import LabCase from "@/components/kairos/LabCase";
import { labProjects } from "@/data/lab";

const project = labProjects[0];
export const metadata: Metadata = {
  title: "Barbearia Tony — KAIROS Lab",
  description: `${project.kind}. ${project.description}`,
  openGraph: { title: "Barbearia Tony — KAIROS Lab", description: project.description, images: [] },
  twitter: { card: "summary", title: "Barbearia Tony — KAIROS Lab", description: project.description, images: [] },
};
export default function Page() { return <LabCase project={project} />; }
