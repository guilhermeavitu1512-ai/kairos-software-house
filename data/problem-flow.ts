export const BUSINESS_TYPES = ["Comércio", "Restaurante / Delivery", "Clínica / Consultório", "Serviço", "Loja online", "Empresa / Operação interna", "Outro"] as const;
export const CURRENT_PROCESSES = ["WhatsApp", "Caderno / papel", "Planilhas", "Outro sistema", "Processo manual", "Ainda não tenho nada"] as const;
export const GOALS = ["Organizar informações", "Automatizar tarefas", "Facilitar atendimento", "Controlar pedidos", "Organizar agenda", "Melhorar presença online", "Ainda não sei", "Outro"] as const;
export const QUESTIONS = ["O que você quer criar ou melhorar?", "Que tipo de negócio é o seu?", "Como você se chama?"] as const;
export type CurrentProcess = typeof CURRENT_PROCESSES[number];
export type Goal = typeof GOALS[number];
export type ProblemAnswers = {
  interest: string;
  problem: string;
  business: typeof BUSINESS_TYPES[number] | "";
  otherBusiness: string;
  current: CurrentProcess[];
  goals: Goal[];
  otherGoal: string;
  name: string;
  whatsapp: string;
  email: string;
  company: string;
};
export const EMPTY_PROBLEM: ProblemAnswers = { interest: "", problem: "", business: "", otherBusiness: "", current: [], goals: [], otherGoal: "", name: "", whatsapp: "", email: "", company: "" };

export function toggleSelection<T extends string>(values: T[], value: T, exclusive: T): T[] {
  if (values.includes(value)) return values.filter(item => item !== value);
  return value === exclusive ? [value] : [...values.filter(item => item !== exclusive), value];
}

export function brazilPhoneDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;
}
const DDDS = new Set("11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99".split(" "));
export function validBrazilPhone(value: string) {
  if (/[^\d\s()+.\-]/.test(value)) return false;
  const digits = brazilPhoneDigits(value);
  const local = digits.slice(2);
  return DDDS.has(digits.slice(0, 2)) && (/^9\d{8}$/.test(local) || /^[2-5]\d{7}$/.test(local)) && !/^(\d)\1+$/.test(local);
}
export function formatBrazilPhone(value: string) {
  const digits = brazilPhoneDigits(value);
  if (!validBrazilPhone(value)) return value;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, -4)}-${digits.slice(-4)}`;
}
export function validateProblemStep(step: number, a: ProblemAnswers): string {
  if (step === 0 && (!a.problem.trim() || a.problem.length > 600)) return "Conte um pouco sobre o que está dando trabalho, em até 600 caracteres.";
  if (step === 1 && (!a.business || (a.business === "Outro" && !a.otherBusiness.trim()))) return "Informe o tipo do seu negócio.";
  if (step === 2) {
    if (!a.name.trim()) return "Informe seu nome.";
    if (a.whatsapp.trim() && !validBrazilPhone(a.whatsapp)) return "Confira seu WhatsApp, incluindo o DDD.";
    if (a.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim())) return "Confira seu e-mail ou deixe esse campo vazio.";
  }
  return "";
}
export const businessLabel = (a: ProblemAnswers) => a.business === "Outro" ? a.otherBusiness.trim() : a.business;
export const goalsLabel = (a: ProblemAnswers) => a.goals.map(goal => goal === "Outro" ? a.otherGoal.trim() : goal).join(", ");
export function buildProblemMessage(a: ProblemAnswers) {
  return [
    "Olá! Conheci a KAIROS pelo site e queria conversar sobre um projeto.",
    a.interest ? `Interesse: ${a.interest}` : "",
    `O que preciso:\n${a.problem.trim()}`,
    `Tipo de negócio:\n${businessLabel(a)}`,
    `Nome: ${a.name.trim()}`,
    a.whatsapp.trim() ? `WhatsApp: ${formatBrazilPhone(a.whatsapp)}` : "",
    a.email.trim() ? `E-mail: ${a.email.trim()}` : "",
    a.company.trim() ? `Empresa: ${a.company.trim()}` : "",
  ].filter(Boolean).join("\n\n");
}
