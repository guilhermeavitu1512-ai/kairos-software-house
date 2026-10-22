"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import KairosMark from "./KairosMark";
import { ProblemFlowTrigger } from "./problem-flow/ProblemFlow";
import styles from "./SiteHeader.module.css";

const links = [
  { label: "Projetos", href: "/#projetos" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Planos", href: "/#precos" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

const Arrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;

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
      <header className={`${styles.header}${scrolled || menuOpen ? " " + styles.scrolled : ""}`}>
        <Link className={styles.brand} href="/" aria-label="KAIROS, ir para o início">
          <KairosMark compact priority />
          <span>KAIROS</span>
        </Link>
        <nav className={styles.nav} aria-label="Navegação principal">
          {links.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}
        </nav>
        <ProblemFlowTrigger className={styles.cta}>Pedir orçamento <Arrow /></ProblemFlowTrigger>
        <button
          ref={toggleRef}
          className={`${styles.toggle}${menuOpen ? " " + styles.toggleOpen : ""}`}
          data-menu-toggle
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
      </header>
      <nav id="mobile-navigation" className={`${styles.mobile}${menuOpen ? " " + styles.mobileOpen : ""}`} aria-hidden={!menuOpen}>
        {links.map((link, index) => (
          <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1} style={{ transitionDelay: menuOpen ? `${60 + index * 40}ms` : "0ms" }}>
            <span className={styles.mobileIndex}>0{index + 1}</span>{link.label}
          </Link>
        ))}
        <ProblemFlowTrigger className={styles.mobileCta} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>Pedir orçamento <Arrow /></ProblemFlowTrigger>
      </nav>
    </>
  );
}
