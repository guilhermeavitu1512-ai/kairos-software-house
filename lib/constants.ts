export const COMPANY = {
  name: "KAIROS",
  legalName: "KAIROS Software House",
  whatsapp: "5581993858571",
  email: "",
  github: "",
  linkedin: "",
  instagram: "",
  siteUrl: "https://kairos.software",
} as const;

export const CONTACT_BUDGETS = [
  "Até R$ 5 mil",
  "R$ 5 mil – R$ 15 mil",
  "R$ 15 mil – R$ 30 mil",
  "Acima de R$ 30 mil",
  "Ainda não sei",
] as const;

export const PROJECT_TYPES = ["Site", "App", "Sistema", "SaaS", "Bot", "Automação", "IA", "Outro"] as const;

export function buildWhatsAppMessageUrl(message: string) {
  const number = COMPANY.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppUrl(subject = "um projeto digital") {
  const message = `Olá! Conheci a KAIROS pelo site e gostaria de solicitar um orçamento para ${subject}.`;
  return buildWhatsAppMessageUrl(message);
}
