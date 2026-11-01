export const sitePlans = [
  {
    id: "simples", name: "Site simples", cta: "Quero o site simples",
    upfront: "597", installment: "49,75", delivery: "5 a 7 dias úteis",
    description: "Uma página para mostrar o que você faz e levar o cliente ao WhatsApp.",
    features: ["Página única completa", "Serviços, localização e WhatsApp", "Pronto para computador e celular", "2 rodadas de revisões"],
  },
  {
    id: "agendamento", name: "Site com agendamento", cta: "Quero agenda online", recommended: true,
    upfront: "697", installment: "58,08", delivery: "7 a 10 dias úteis",
    description: "Seu cliente escolhe serviço, profissional e horário sem troca de mensagens.",
    features: ["Tudo do site simples", "Agenda online com serviços e horários", "Confirmação pelo WhatsApp", "2 rodadas de revisões"],
  },
  {
    id: "pedidos", name: "Sistema de pedidos", cta: "Quero receber pedidos",
    upfront: "1.497", installment: "124,75", delivery: "10 a 15 dias úteis",
    description: "Cardápio, pedidos e painel para vender direto, sem comissão de aplicativo.",
    features: ["Cardápio ou catálogo online", "Pedido com delivery ou retirada", "Painel para gerenciar pedidos", "2 rodadas de revisões"],
  },
] as const;

export type PlanId = (typeof sitePlans)[number]["id"];

export const customSolutions = ["E-commerce", "Sistema", "SaaS", "Aplicativo", "Projeto personalizado"] as const;
