export type Service = {
  name: string;
  description: string;
  price: string;
  message: string;
};

export const services: Service[] = [
  { name: "Sites", description: "Páginas para apresentar sua empresa, explicar seus serviços e receber pedidos de orçamento.", price: "", message: "um site" },
  { name: "Sistemas & SaaS", description: "Sistemas para acompanhar pedidos, organizar agendas ou reunir informações da sua operação.", price: "", message: "um sistema ou produto SaaS" },
  { name: "Aplicativos", description: "Aplicativos para seus clientes ou sua equipe, com as funções definidas para o projeto.", price: "", message: "um aplicativo" },
  { name: "Bots & Automações", description: "Integrações para reduzir tarefas repetitivas, como copiar dados e enviar avisos manualmente.", price: "", message: "bots e automações" },
];
