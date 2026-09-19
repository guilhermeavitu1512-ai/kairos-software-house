export type Service = {
  name: string;
  description: string;
  price: string;
  message: string;
};

export const services: Service[] = [
  { name: "Sites", description: "Presença digital clara, com a identidade do seu negócio.", price: "", message: "um site" },
  { name: "Sistemas & SaaS", description: "Software sob medida para organizar a operação.", price: "", message: "um sistema ou produto SaaS" },
  { name: "Aplicativos", description: "Experiências mobile pensadas para o uso diário.", price: "", message: "um aplicativo" },
  { name: "Bots & Automações", description: "Menos tarefas manuais. Processos mais simples.", price: "", message: "bots e automações" },
];
