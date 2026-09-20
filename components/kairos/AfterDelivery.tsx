import Reveal from "./Reveal";
import styles from "./Capabilities.module.css";
const pillars = [
  { title: "Sem mensalidade obrigatória", description: "Os planos são para a criação do site. Não há uma assinatura obrigatória de manutenção com a KAIROS." },
  { title: "Domínio e hospedagem à parte", description: "Você pode contratar seu provedor. A KAIROS pode auxiliar na configuração; o custo depende do projeto e do serviço escolhido." },
  { title: "Alterações futuras", description: "Novas funcionalidades, atualizações recorrentes de conteúdo e manutenção contínua são cobradas separadamente, mediante orçamento." },
  { title: "Correções e garantia", description: "O período e as condições de garantia para correções relacionadas ao desenvolvimento são definidos na proposta." },
];
export default function AfterDelivery() {
  return <section className={styles.delivery} aria-labelledby="delivery-title"><div className={`${styles.shell} ${styles.layout} ${styles.deliveryLayout}`}>
    <Reveal className={`${styles.intro} ${styles.deliveryIntro}`}><p className={styles.eyebrow}>DEPOIS DA ENTREGA</p><h2 id="delivery-title">O que acontece quando o site fica pronto?</h2></Reveal>
    <Reveal className={styles.pillarsReveal}><dl className={styles.pillars}>{pillars.map(p=><div key={p.title}><dt>{p.title}</dt><dd>{p.description}</dd></div>)}</dl></Reveal>
  </div></section>;
}
