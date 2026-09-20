import Link from "next/link";
import styles from "./Capabilities.module.css";
export default function AfterDelivery() {
  return <aside className={styles.delivery} aria-labelledby="delivery-title"><div className={`${styles.shell} ${styles.deliveryNote}`}>
    <h2 id="delivery-title">Depois da entrega</h2>
    <p>Novas funcionalidades e manutenção contínua são orçadas à parte. O período e as condições de garantia para correções do desenvolvimento ficam definidos na proposta.</p>
    <Link href="/#duvidas">Ver dúvidas sobre os planos <span aria-hidden="true">↗</span></Link>
  </div></aside>;
}
