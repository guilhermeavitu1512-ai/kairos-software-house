"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import KairosMark from "./KairosMark";
import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";

const links = [
  { label: "Projetos", href: "/#projetos" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Planos", href: "/#precos" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    const onKeyDown = (event: KeyboardEvent) => {
      if (!menuOpen) return;
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab") {
        const items = [toggleRef.current, ...document.querySelectorAll<HTMLAnchorElement>("#mobile-navigation a")].filter((item): item is HTMLButtonElement | HTMLAnchorElement => item !== null);
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.classList.remove("menu-open"); window.removeEventListener("keydown", onKeyDown); };
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header${scrolled || menuOpen ? " is-scrolled" : ""}`}>
        <Link className="brand" href="/" aria-label="KAIROS, ir para o início">
          <KairosMark compact priority />
          <span>KAIROS</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}
        </nav>
        <ProblemFlowTrigger className="header-cta">Contar meu problema</ProblemFlowTrigger>
        <button
          ref={toggleRef}
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
      </header>
      <nav id="mobile-navigation" className={`mobile-menu${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        {links.map((link) => (
          <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>
            {link.label}
          </Link>
        ))}
        <ProblemFlowTrigger onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>Contar meu problema</ProblemFlowTrigger>
      </nav>
    </>
  );
}
