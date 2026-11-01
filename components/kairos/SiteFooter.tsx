import Link from "next/link";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav} aria-label="Navegação do rodapé">
        <Link href="/#projetos">Projetos</Link>
        <Link href="/#demonstracoes">Demonstrações</Link>
        <Link href="/#precos">Pacotes</Link>
        <Link href="/sobre">Sobre</Link>
        <Link href="/contato">Contato</Link>
        <Link href="/privacidade">Privacidade</Link>
      </nav>
      <p className={styles.wordmark} aria-hidden="true">KAIROS</p>
      <p className={styles.legal}>© {new Date().getFullYear()} KAIROS · O momento certo para o seu negócio.</p>
    </footer>
  );
}
