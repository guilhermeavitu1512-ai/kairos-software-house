import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { COMPANY } from "@/lib/constants";
export default function sitemap(): MetadataRoute.Sitemap { const routes = ["", "/projetos", "/sobre", "/contato", "/privacidade", "/projetos/kairos", "/projetos/barbearia-tony"].map((route) => ({ url: `${COMPANY.siteUrl}${route}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: route === "" ? 1 : .8 })); return [...routes, ...projects.map((project) => ({ url: `${COMPANY.siteUrl}/projetos/${project.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .7 }))]; }
