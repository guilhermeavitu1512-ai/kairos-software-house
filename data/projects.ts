export type ProjectCategory = "Sites" | "Apps" | "Sistemas" | "SaaS" | "Bots" | "IA" | "Automação";

export type ProjectBase = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  url: string;
  liveUrl?: string;
  highlights?: string[];
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
    id: "cassio", slug: "cassio-franklin", name: "Cássio Franklin", category: "Site e agenda online",
    description: "Site e agendamento para barbearia, com escolha de barbeiro, serviço e horário, sem criar conta. Projeto de demonstração da KAIROS.",
    image: "/portfolio/cassio/home-1440.webp", url: "/projetos/cassio-franklin", liveUrl: "https://cassiofranklin.vercel.app/",
    highlights: ["Agendamento em etapas: barbeiro, corte, horário e dados", "Só aparecem horários livres", "Galeria, preços, localização e instalação no celular"],
    featured: false, portfolio: true, order: -1,
  },
  {
    id: "vyne",
    slug: "vyne",
    name: "VYNE",
    category: "E-commerce",
    description: "Catálogo de relógios com filtros, favoritos e detalhes de produto. Veja as telas e os recursos desenvolvidos.",
    image: "/portfolio/vyne/home-hd.png",
    url: "/projetos/vyne",
    liveUrl: "https://vyne-relogios.vercel.app/",
    highlights: ["Catálogo com filtros e favoritos", "Página de detalhes para cada produto", "Layout para computador e celular"],
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
    id: "tony", slug: "barbearia-tony", name: "Tony Barber", category: "Sistema de agendamento",
    description: "Site e agendamento para barbearias, com escolha de profissional, serviços e horários. Projeto autoral da KAIROS.",
    image: "/portfolio/tony/home-hd.png", url: "/projetos/barbearia-tony", liveUrl: "https://tonybarber.vercel.app/",
    highlights: ["Agendamento em etapas: profissional, serviço, horário e dados", "Site de apresentação ligado à agenda", "React, TypeScript e Firebase"],
    featured: false, portfolio: true, order: 2,
  },
  {
    id: "blend", slug: "blend-burger", name: "Blend Burger", category: "Cardápio digital",
    description: "Site e cardápio digital para hamburgueria, com vitrine dos burgers, ingredientes e pedido online. Projeto autoral da KAIROS.",
    image: "/portfolio/blend/home-1440.png", url: "/projetos/blend-burger", liveUrl: "https://blend-burger-mocha.vercel.app/",
    highlights: ["Vitrine com destaque rotativo e fotos em alta", "Ingredientes apresentados camada por camada", "Pedido com delivery, retirada e busca de CEP"],
    featured: false, portfolio: true, order: 0,
  },
  {
    id: "arara", slug: "arara", name: "ARARA", category: "Loja de roupas",
    description: "Loja de roupas com intro animada, arara interativa, ateliê de peças personalizadas e pedido pelo WhatsApp. Projeto de demonstração da KAIROS.",
    image: "/portfolio/arara/home-1440.webp", url: "/projetos/arara", liveUrl: "https://arara-roupas.vercel.app/",
    highlights: ["Arara interativa com as peças em cabides", "Ateliê com tecido, linha e bordado", "Guia de tamanhos, sacola e pedido pelo WhatsApp"],
    featured: false, portfolio: true, order: 2.5,
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
    portfolio: false,
    order: 3,
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
