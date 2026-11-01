"use client";

import { useEffect, useRef, type RefObject } from "react";

export type ParticleMode = "swirl" | "word" | "frame";

const REPEL_RADIUS = 120;
const REPEL_FORCE = 2.6;
// Particles leave the swirl a few at a time and glide to their spot.
const GATHER_SECONDS = 1.7;
const PULL = 0.016;
const DRAG = 0.88;

type Particle = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; amber: boolean; seed: number; orbit: number };

// Reads the lit pixels of the word, so each particle gets a spot inside the letters.
function wordPoints(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return [];
  const family = getComputedStyle(document.documentElement).getPropertyValue("--display") || "sans-serif";
  const size = Math.min(width * 0.23, 270);
  context.font = `700 ${size}px ${family}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#fff";
  context.fillText("KAIROS", width / 2, height * 0.42);
  const { data } = context.getImageData(0, 0, width, height);
  const points: [number, number][] = [];
  for (let y = 0; y < height; y += 2) for (let x = 0; x < width; x += 2) if (data[(y * width + x) * 4 + 3] > 128) points.push([x, y]);
  return points;
}

// Points along the outline of the phone the particles turn into.
function framePoint(box: DOMRect, progress: number) {
  const perimeter = 2 * (box.width + box.height);
  let along = progress * perimeter;
  if (along < box.width) return [box.left + along, box.top];
  along -= box.width;
  if (along < box.height) return [box.right, box.top + along];
  along -= box.height;
  if (along < box.width) return [box.right - along, box.bottom];
  along -= box.width;
  return [box.left, box.bottom - along];
}

export default function IntroParticles({ mode, phone }: { mode: ParticleMode; phone: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = width * scale;
    canvas.height = height * scale;
    context.scale(scale, scale);

    const count = width < 760 ? 1800 : 5200;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height, vx: 0, vy: 0,
      tx: width / 2, ty: height / 2, amber: Math.random() < 0.14, seed: Math.random(), orbit: Math.random(),
    }));
    let word: [number, number][] = [];
    const family = getComputedStyle(document.documentElement).getPropertyValue("--display");
    document.fonts.load(`700 80px ${family}`).catch(() => undefined).finally(() => { word = wordPoints(width, height); });

    const pointer = { x: -9999, y: -9999 };
    const onMove = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onMove);

    let frame = 0;
    let lastMode: ParticleMode | null = null;
    let modeSince = 0;
    let placed = false;
    const paint = () => {
      const current = modeRef.current;
      if (current !== lastMode || (current === "word" && word.length && !placed)) {
        const box = phone.current?.getBoundingClientRect();
        particles.forEach((particle, index) => {
          if (current === "word" && word.length) {
            const point = word[Math.floor(particle.seed * word.length)];
            particle.tx = point[0] + (particle.orbit - 0.5) * 2; particle.ty = point[1] + (particle.seed * 7 % 1 - 0.5) * 2;
          } else if (current === "frame" && box) {
            [particle.tx, particle.ty] = framePoint(box, index / count);
          }
        });
        if (current === "word" && word.length) placed = true;
        if (current !== lastMode) modeSince = performance.now() / 1000;
        lastMode = current;
      }

      context.clearRect(0, 0, width, height);
      const time = performance.now() / 1000;
      for (const particle of particles) {
        const waiting = current === "word" && time - modeSince < particle.seed * GATHER_SECONDS;
        let goalX = particle.tx;
        let goalY = particle.ty;
        if (current === "swirl" || waiting) {
          const angle = particle.seed * Math.PI * 2 + time * (0.3 + particle.orbit * 0.5);
          const radius = 50 + Math.sqrt(particle.orbit) * Math.min(width, height) * 0.4;
          goalX = width / 2 + Math.cos(angle) * radius;
          goalY = height / 2 + Math.sin(angle) * radius * 0.7;
        }
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < REPEL_RADIUS && distance > 0) {
          const push = (1 - distance / REPEL_RADIUS) * REPEL_FORCE;
          particle.vx += (dx / distance) * push;
          particle.vy += (dy / distance) * push;
        }
        particle.vx = (particle.vx + (goalX - particle.x) * PULL) * DRAG;
        particle.vy = (particle.vy + (goalY - particle.y) * PULL) * DRAG;
        particle.x += particle.vx;
        particle.y += particle.vy;
        context.fillStyle = particle.amber ? "#ffb75e" : "#dfe7ff";
        context.fillRect(particle.x, particle.y, 1.7, 1.7);
      }
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [phone]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
