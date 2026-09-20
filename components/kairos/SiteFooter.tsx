import Link from "next/link";
import KairosMark from "./KairosMark";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="brand" href="/" aria-label="KAIROS, página inicial"><KairosMark compact /><span>KAIROS</span></Link>
        </div>
        <nav className="footer-nav" aria-label="Navegação do rodapé">
          <Link href="/#projetos">Projetos</Link>
          <Link href="/#servicos">Serviços</Link>
          <Link href="/#precos">Planos</Link>
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/contato">Contato</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} KAIROS · Sites, sistemas e automações</span>
        <a href="#conteudo">Voltar ao topo ↑</a>
      </div>
    </footer>
  );
}
