export type ProjectType =
  | "site"
  | "system"
  | "app"
  | "saas"
  | "bot"
  | "automation"
  | "integration"
  | "unknown";

export type ProjectStage =
  | "idea"
  | "references"
  | "design"
  | "working"
  | "rebuild";

export type ProjectDeadline =
  | "undefined"
  | "30-days"
  | "1-3-months"
  | "3-6-months"
  | "specific";

export type BriefingAnswers = {
  projectType: ProjectType | "";
  need: string;
  stage: ProjectStage | "";
  features: string[];
  deadline: ProjectDeadline | "";
  deadlineDate: string;
  budget: string;
  name: string;
  company: string;
  whatsapp: string;
  email: string;
};

export type BriefingOption<T extends string = string> = {
  value: T;
  label: string;
};

export const PROJECT_TYPE_OPTIONS: BriefingOption<ProjectType>[] = [
  { value: "site", label: "Site" },
  { value: "system", label: "Sistema" },
  { value: "app", label: "Aplicativo" },
  { value: "saas", label: "SaaS" },
  { value: "bot", label: "Bot" },
  { value: "automation", label: "Automação" },
  { value: "integration", label: "Integração" },
  { value: "unknown", label: "Ainda não sei" },
];

export const PROJECT_STAGE_OPTIONS: BriefingOption<ProjectStage>[] = [
  { value: "idea", label: "Tenho apenas a ideia" },
  { value: "references", label: "Já tenho referências" },
  { value: "design", label: "Já tenho design" },
  { value: "working", label: "Já existe uma versão funcionando" },
  { value: "rebuild", label: "Quero reformular algo existente" },
];

export const DEADLINE_OPTIONS: BriefingOption<ProjectDeadline>[] = [
  { value: "undefined", label: "Sem prazo definido" },
  { value: "30-days", label: "Até 30 dias" },
  { value: "1-3-months", label: "1–3 meses" },
  { value: "3-6-months", label: "3–6 meses" },
  { value: "specific", label: "Tenho uma data específica" },
];

export const BUDGET_RANGES: BriefingOption[] = [
  { value: "unknown", label: "Ainda não sei" },
  { value: "up-to-5k", label: "Até R$ 5 mil" },
  { value: "5k-15k", label: "R$ 5 mil – R$ 15 mil" },
  { value: "15k-30k", label: "R$ 15 mil – R$ 30 mil" },
  { value: "above-30k", label: "Acima de R$ 30 mil" },
];

export const FEATURES_BY_PROJECT: Record<ProjectType, string[]> = {
  site: ["Apresentar empresa", "Captar leads", "Mostrar portfólio", "Vender produtos", "Agendamento", "Área do cliente", "Blog", "Integração com WhatsApp", "Outro"],
  system: ["Dashboard", "Cadastro de usuários", "Gestão interna", "Relatórios", "Pagamentos", "Permissões", "Integrações", "Automação", "Outro"],
  app: ["Login", "Perfil", "Notificações", "Pagamentos", "Mapa", "Chat", "Assinatura", "Integrações", "Outro"],
  saas: ["Dashboard", "Gestão de usuários", "Assinaturas", "Pagamentos", "Permissões", "Relatórios", "Integrações", "Notificações", "Outro"],
  bot: ["Atendimento", "Triagem de solicitações", "Respostas automáticas", "Notificações", "Coleta de dados", "Integração com sistemas", "Relatórios", "Outro"],
  automation: ["Organizar dados", "Conectar ferramentas", "Enviar notificações", "Gerar documentos", "Atualizar cadastros", "Criar relatórios", "Aprovar etapas", "Outro"],
  integration: ["Sincronizar dados", "Conectar APIs", "Integrar pagamentos", "Unificar cadastros", "Automatizar atualizações", "Criar webhooks", "Monitorar falhas", "Outro"],
  unknown: ["Organizar um processo", "Reduzir trabalho manual", "Integrar ferramentas", "Criar presença digital", "Validar uma ideia", "Melhorar algo existente", "Outro"],
};

export const EMPTY_BRIEFING: BriefingAnswers = {
  projectType: "",
  need: "",
  stage: "",
  features: [],
  deadline: "",
  deadlineDate: "",
  budget: "",
  name: "",
  company: "",
  whatsapp: "",
  email: "",
};

export const getOptionLabel = <T extends string>(options: BriefingOption<T>[], value: T | "") =>
  options.find((option) => option.value === value)?.label ?? "Não informado";
