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
    name: "Tony Barber",
    kind: "Projeto autoral",
    category: "Sistema para barbearias",
    description: "Site e sistema de agendamento para barbearias, desenvolvido como projeto autoral da KAIROS.",
    theme: "tony",
    image: { src: "/portfolio/tony/home-1440.png", alt: "Página inicial da Tony Barber", width: 1440, height: 1000 },
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
