export type ProjectCategory = "Sites" | "Apps" | "Sistemas" | "SaaS" | "Bots" | "IA" | "Automação";

export type ProjectBase = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  url: string;
  featured: boolean;
  portfolio: boolean;
  order: number;
};

export type Project = ProjectBase & {
  eyebrow: string;
  caseCategory: ProjectCategory;
  year: string;
  technologies: string[];
  problemTitle: string;
  decisionTitle: string;
  solutionTitle: string;
  problem: string;
  strategy: string;
  solution: string;
  development: string;
  interface: string;
  result: string;
  visual: "commerce";
  accent: string;
};

export type ProjectRecord = ProjectBase | Project;

export const projectRecords: ProjectRecord[] = [
  {
    id: "vyne",
    slug: "vyne",
    name: "VYNE",
    category: "E-commerce",
    description: "Catálogo de relógios com filtros, favoritos e detalhes de produto. Veja as telas e os recursos desenvolvidos.",
    image: "/portfolio/vyne/hero-desktop.png",
    url: "/projetos/vyne",
    featured: true,
    portfolio: true,
    order: 1,
    eyebrow: "E-commerce / Digital Experience",
    caseCategory: "Sites",
    year: "2026",
    technologies: ["Next.js", "TypeScript", "React", "Supabase"],
    problemTitle: "Uma coleção premium não pode tornar a escolha confusa.",
    decisionTitle: "Curadoria antes de volume.",
    solutionTitle: "Uma experiência de compra guiada pela confiança.",
    problem: "Organizar uma coleção de produtos com linguagem premium, sem perder clareza de navegação e confiança na escolha.",
    strategy: "Transformar a curadoria em eixo da experiência, priorizando comparação, descoberta e uma hierarquia editorial objetiva.",
    solution: "Uma plataforma de e-commerce responsiva com catálogo, filtros, visualização rápida e administração preparada para evolução.",
    development: "Arquitetura baseada em App Router, componentes reutilizáveis, dados tipados e integração pronta para operação real.",
    interface: "Contraste alto, tipografia editorial e grandes áreas de produto criam uma experiência direta e segura.",
    result: "Um produto digital coeso, pronto para receber catálogo real, integrações comerciais e novos fluxos de conversão.",
    visual: "commerce",
    accent: "#d7ff38",
  },
  {
    id: "kairos",
    slug: "kairos",
    name: "KAIROS",
    category: "Site institucional",
    description: "Nosso próprio site: apresentação de serviços, comparação de planos e contato pelo WhatsApp.",
    image: "/portfolio/kairos-current.png",
    url: "/projetos/kairos",
    featured: false,
    portfolio: true,
    order: 2,
  },
];

function isCaseProject(project: ProjectRecord): project is Project {
  return "year" in project;
}

const byOrder = (first: ProjectBase, second: ProjectBase) => first.order - second.order;

export const projects = projectRecords.filter(isCaseProject).sort(byOrder);
export const featuredProjects = projects.filter((project) => project.featured);
export const portfolioProjects = projectRecords.filter((project) => project.portfolio).sort(byOrder);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
