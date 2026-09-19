export type LabProject = {
  slug: string;
  name: string;
  kind: "Projeto autoral" | "Projeto conceitual";
  category: string;
  description: string;
  theme: "tony" | "sorriso";
  image: { src: string; alt: string; width: number; height: number } | null;
};

// Add only verified screenshots here. Null deliberately renders a neutral preview.
export const labProjects: LabProject[] = [
  {
    slug: "barbearia-tony",
    name: "Barbearia Tony",
    kind: "Projeto autoral",
    category: "Sistema para barbearias",
    description: "Uma exploração de agenda e operação em uma mesma experiência.",
    theme: "tony",
    image: null,
  },
  {
    slug: "seu-sorriso",
    name: "Seu Sorriso",
    kind: "Projeto conceitual",
    category: "Experiência digital para clínica odontológica",
    description: "Presença digital com foco em cuidado e informação.",
    theme: "sorriso",
    image: null,
  },
];
