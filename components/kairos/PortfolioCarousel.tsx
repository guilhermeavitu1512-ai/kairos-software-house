"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { portfolioProjects } from "@/data/projects";

export default function PortfolioCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, moved: false, startX: 0, startScroll: 0, startIndex: 0, lastX: 0, lastTime: 0, velocity: 0 });
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const reduceMotion = useReducedMotion();

  const updateActiveItem = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-portfolio-card]"));
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    setActiveIndex(nearest);
  }, []);

  const onScroll = useCallback(() => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      updateActiveItem();
      frameRef.current = null;
    });
  }, [updateActiveItem]);

  const scrollToItem = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-portfolio-card]"));
    const target = cards[Math.max(0, Math.min(index, cards.length - 1))];
    if (!target) return;
    const centeredLeft = target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;
    track.scrollTo({ left: centeredLeft, behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);

  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      dragRef.current.moved = false;
      return;
    }
    const track = event.currentTarget;
    track.setPointerCapture(event.pointerId);
    dragRef.current = { active: true, moved: false, startX: event.clientX, startScroll: track.scrollLeft, startIndex: activeIndex, lastX: event.clientX, lastTime: performance.now(), velocity: 0 };
    setDragging(true);
  }, [activeIndex]);

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const now = performance.now();
    const delta = event.clientX - drag.startX;
    const elapsed = Math.max(now - drag.lastTime, 1);
    drag.velocity = (event.clientX - drag.lastX) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = now;
    drag.moved ||= Math.abs(delta) > 6;
    event.currentTarget.scrollLeft = drag.startScroll - delta;
  }, []);

  const finishDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.moved) {
      const distance = event.currentTarget.scrollLeft - drag.startScroll;
      const threshold = Math.min(event.currentTarget.clientWidth * 0.12, 110);
      const hasIntent = Math.abs(distance) >= threshold || (Math.abs(distance) >= 32 && Math.abs(drag.velocity) >= 0.65);
      const direction = distance === 0 ? 0 : Math.sign(distance);
      scrollToItem(drag.startIndex + (hasIntent ? direction : 0));
      window.setTimeout(() => {
        dragRef.current.moved = false;
      }, 0);
    }
  }, [scrollToItem]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const direction = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
    const edge = event.key === "Home" ? 0 : event.key === "End" ? portfolioProjects.length - 1 : null;
    if (direction === 0 && edge === null) return;
    event.preventDefault();
    scrollToItem(edge ?? activeIndex + direction);
  }, [activeIndex, scrollToItem]);

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      track.scrollTo({ left: 0, behavior: "auto" });
      setActiveIndex(0);
    }
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  if (portfolioProjects.length === 0) return null;

  return (
    <section id="repertorio" className="portfolio-showcase" aria-labelledby="portfolio-title">
      <m.div
        className="section-shell portfolio-heading"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reduceMotion ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 id="portfolio-title">Nosso repertório</h2>
        <div className="portfolio-heading-copy">
          <p>Uma seleção de experiências digitais que já construímos.</p>
          <div className="portfolio-controls" aria-label="Navegação do carrossel">
            <span className="portfolio-position" aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")} / {String(portfolioProjects.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => scrollToItem(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Projeto anterior" aria-controls="portfolio-track">
              ←
            </button>
            <button type="button" onClick={() => scrollToItem(activeIndex + 1)} disabled={activeIndex === portfolioProjects.length - 1} aria-label="Próximo projeto" aria-controls="portfolio-track">
              →
            </button>
          </div>
        </div>
      </m.div>
      <m.div
        id="portfolio-track"
        ref={trackRef}
        className={`portfolio-track${dragging ? " is-dragging" : ""}`}
        data-cursor={dragging ? "DRAGGING" : "DRAG"}
        role="region"
        tabIndex={0}
        aria-labelledby="portfolio-title"
        aria-roledescription="carrossel"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduceMotion ? 0 : 0.68, delay: reduceMotion ? 0 : 0.06, ease: [0.22, 1, 0.36, 1] }}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        {portfolioProjects.map((item, index) => (
          <article
            key={item.id}
            className={`portfolio-card${activeIndex === index ? " is-active" : ""}`}
            data-portfolio-card
            role="group"
            aria-label={`${index + 1} de ${portfolioProjects.length}: ${item.name}, ${item.category}`}
          >
            <Link
              href={item.url}
              draggable={false}
              aria-label={`Ver projeto ${item.name}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={(event) => {
                if (event.detail > 0 && dragRef.current.moved) {
                  event.preventDefault();
                  dragRef.current.moved = false;
                }
              }}
            >
              <div className="portfolio-image">
                <Image
                  src={item.image}
                  alt={`Interface do projeto ${item.name}`}
                  fill
                  sizes="(max-width: 760px) 86vw, (max-width: 1100px) 82vw, 72vw"
                  quality={78}
                  loading="lazy"
                />
              </div>
              <div className="portfolio-copy">
                <div><h3>{item.name}</h3><p>{item.category}</p></div>
                <span>Ver projeto →</span>
              </div>
            </Link>
          </article>
        ))}
      </m.div>
    </section>
  );
}
