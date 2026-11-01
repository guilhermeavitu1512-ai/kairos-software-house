"use client";

import { useEffect, useRef, type RefObject } from "react";

export type ParticleMode = "swirl" | "word" | "frame";

const POINTER_RADIUS = 130;
const POINTER_PUSH = 1.5;
const POINTER_SPIN = 0.9;
const POINTER_CARRY = 0.09;
// Particles leave the galaxy a few at a time and spiral to their spot.
const GATHER_SECONDS = 1.7;
const PULL = 0.018;
const SPIRAL = 0.0052;
const FLOW = 0.09;
const SHOCK_FORCE = 15;
const SHOCK_REACH = 260;
const ARMS = 3;
// A band of light runs through the letters every few seconds.
const SHEEN_EVERY = 3.4;
const SHEEN_WIDTH = 90;
const TRAIL = "rgba(0,0,0,.24)";
const FRAME_MS = 1000 / 60;
const HALO = 46;

type Particle = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; accent: boolean; seed: number; orbit: number; pull: number; drag: number };

// Soft dots: a bright core inside a wide glow, so overlapping particles bloom like real light.
function glowSprite(color: string) {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 32;
  const context = sprite.getContext("2d");
  if (!context) return sprite;
  const glow = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  glow.addColorStop(0, "rgba(255,255,255,.62)");
  glow.addColorStop(0.16, color);
  glow.addColorStop(0.5, color.replace(/[\d.]+\)$/, ".07)"));
  glow.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 32, 32);
  return sprite;
}

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

export default function IntroParticles({ mode, shock, phone }: { mode: ParticleMode; shock: boolean; phone: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  const shockRef = useRef(shock);

  useEffect(() => {
    modeRef.current = mode;
    shockRef.current = shock;
  }, [mode, shock]);

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

    const small = width < 760;
    const count = small ? 1800 : 5200;
    const dot = small ? 5 : 4.2;
    const particles: Particle[] = Array.from({ length: count }, () => {
      const seed = Math.random();
      const orbit = Math.random();
      return { x: Math.random() * width, y: Math.random() * height, vx: 0, vy: 0, tx: width / 2, ty: height / 2, accent: Math.random() < 0.34, seed, orbit, pull: PULL * (0.7 + orbit * 0.7), drag: 0.85 + seed * 0.06 };
    });
    const pale = glowSprite("rgba(190,212,255,.34)");
    const blue = glowSprite("rgba(84,136,255,.42)");
    const white = glowSprite("rgba(255,255,255,.6)");

    let word: [number, number][] = [];
    const family = getComputedStyle(document.documentElement).getPropertyValue("--display");
    document.fonts.load(`700 80px ${family}`).catch(() => undefined).finally(() => { word = wordPoints(width, height); });

    const stars = Array.from({ length: small ? 60 : 130 }, () => ({ x: Math.random(), y: Math.random(), depth: 0.3 + Math.random() * 0.7, phase: Math.random() * 7 }));
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0 };
    const blast = (x: number, y: number, force: number, reach: number) => {
      for (const particle of particles) {
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.hypot(dx, dy) || 1;
        const push = force * Math.exp(-distance / reach) * (0.6 + particle.orbit * 0.8);
        particle.vx += (dx / distance) * push;
        particle.vy += (dy / distance) * push;
      }
    };
    const onMove = (event: PointerEvent) => {
      if (pointer.x > -9000) { pointer.vx = event.clientX - pointer.x; pointer.vy = event.clientY - pointer.y; }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const onDown = (event: PointerEvent) => { onMove(event); blast(event.clientX, event.clientY, 9, 110); };
    const onUp = (event: PointerEvent) => { if (event.pointerType !== "mouse") { pointer.x = -9999; pointer.y = -9999; } };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    let frame = 0;
    let lastMode: ParticleMode | null = null;
    let modeSince = 0;
    let placed = false;
    let shocked = false;
    let box: DOMRect | undefined;
    let last = performance.now();
    let drawn = count;
    let slowFrames = 0;
    const paint = (now: number) => {
      // Same speed on 60 Hz and 120 Hz screens, and no jump after a slow frame.
      const step = Math.min((now - last) / FRAME_MS, 2.5);
      last = now;
      // Weak devices shed particles instead of stuttering.
      slowFrames = step > 1.7 ? slowFrames + 1 : 0;
      if (slowFrames > 12 && drawn > count * 0.4) { drawn *= 0.85; slowFrames = 0; }
      const current = modeRef.current;
      if (current !== lastMode || (current === "word" && word.length && !placed)) {
        box = phone.current?.getBoundingClientRect();
        particles.forEach((particle) => {
          if (current === "word" && word.length) {
            const point = word[Math.floor(particle.seed * word.length)];
            particle.tx = point[0] + (particle.orbit - 0.5) * 2; particle.ty = point[1] + (particle.seed * 7 % 1 - 0.5) * 2;
          } else if (current === "frame") {
            // A sideways kick turns the dissolving name into a vortex around the phone.
            particle.vx += (particle.y - height / 2) * -0.03;
            particle.vy += (particle.x - width / 2) * 0.03;
          }
        });
        if (current === "word" && word.length) placed = true;
        if (current !== lastMode) modeSince = now / 1000;
        lastMode = current;
      }
      if (shockRef.current && !shocked) { shocked = true; blast(width / 2, height * 0.42, SHOCK_FORCE, SHOCK_REACH); }

      const time = now / 1000;
      // Fading instead of clearing leaves a soft trail behind everything that moves.
      context.globalCompositeOperation = "destination-out";
      context.globalAlpha = 1;
      context.fillStyle = TRAIL;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";
      const shiftX = pointer.x < 0 ? 0 : pointer.x / width - 0.5;
      const shiftY = pointer.y < 0 ? 0 : pointer.y / height - 0.5;
      context.fillStyle = "#8fb3ff";
      for (const star of stars) {
        context.globalAlpha = (0.2 + 0.25 * (1 + Math.sin(time * 1.4 + star.phase))) * star.depth;
        context.fillRect(star.x * width - shiftX * 26 * star.depth, star.y * height - shiftY * 26 * star.depth, 1.6, 1.6);
      }
      context.globalAlpha = 1;
      const elapsed = time - modeSince;
      const sheen = current === "word" && elapsed > GATHER_SECONDS + 1 ? (((elapsed - GATHER_SECONDS - 1) % SHEEN_EVERY) / 1.5) * (width + SHEEN_WIDTH * 2) - SHEEN_WIDTH : -9999;
      const reach = Math.min(width, height);

      for (let index = 0; index < count; index += 1) {
        const particle = particles[index];
        const waiting = current === "word" && elapsed < particle.seed * GATHER_SECONDS;
        const free = current === "swirl" || waiting;
        let goalX = particle.tx;
        let goalY = particle.ty;
        if (free) {
          // A three-armed galaxy: the inner stars turn faster than the outer ones.
          const radius = Math.sqrt(particle.orbit);
          const arm = Math.floor(particle.seed * ARMS);
          const angle = (arm / ARMS) * Math.PI * 2 + radius * 4.4 + time * (0.26 / (0.35 + radius)) + (particle.seed * 97 % 1 - 0.5) * (0.9 - radius * 0.5);
          goalX = width / 2 + Math.cos(angle) * (24 + radius * reach * 0.44);
          goalY = height * 0.46 + Math.sin(angle) * (24 + radius * reach * 0.44) * 0.62;
        } else if (current === "word") {
          // Settled particles keep breathing, so the name never freezes.
          goalX += Math.sin(time * 1.1 + particle.seed * 40) * 1.1;
          goalY += Math.cos(time * 0.9 + particle.orbit * 40) * 1.1;
        } else if (current === "frame" && box) {
          // The halo keeps flowing around the phone instead of standing still.
          [goalX, goalY] = framePoint(box, (index / count + time * 0.05) % 1);
          goalX += (particle.seed * 13 % 1 - 0.5) * HALO;
          goalY += (particle.orbit * 17 % 1 - 0.5) * HALO;
        }

        const toX = goalX - particle.x;
        const toY = goalY - particle.y;
        let forceX = toX * particle.pull;
        let forceY = toY * particle.pull;
        if (!free) {
          // Travelling particles curve in on a spiral instead of a straight line.
          const distance = Math.hypot(toX, toY);
          const curve = Math.min(distance, 240) * SPIRAL;
          if (distance > 1) { forceX += (-toY / distance) * curve; forceY += (toX / distance) * curve; }
        }
        if (distance2(particle, goalX, goalY) > 900) {
          // A slow current keeps long flights from looking mechanical.
          forceX += Math.sin(particle.y * 0.009 + time * 0.8) * FLOW;
          forceY += Math.cos(particle.x * 0.009 + time * 0.7) * FLOW;
        }

        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const near = Math.hypot(dx, dy);
        if (near < POINTER_RADIUS && near > 0) {
          const touch = 1 - near / POINTER_RADIUS;
          forceX += ((dx / near) * POINTER_PUSH + (-dy / near) * POINTER_SPIN) * touch + pointer.vx * POINTER_CARRY * touch;
          forceY += ((dy / near) * POINTER_PUSH + (dx / near) * POINTER_SPIN) * touch + pointer.vy * POINTER_CARRY * touch;
        }

        const damping = particle.drag ** step;
        particle.vx = (particle.vx + forceX * step) * damping;
        particle.vy = (particle.vy + forceY * step) * damping;
        particle.x += particle.vx * step;
        particle.y += particle.vy * step;

        if (index >= drawn) continue;
        // Speed is light: fast particles flare, resting ones glow quietly.
        const speed = Math.abs(particle.vx) + Math.abs(particle.vy);
        const lit = Math.abs(particle.x - sheen) < SHEEN_WIDTH;
        const size = (lit ? dot * 2.1 : dot * (0.8 + particle.orbit * 0.6)) + Math.min(speed * 0.32, 5);
        context.drawImage(lit || speed > 9 ? white : particle.accent ? blue : pale, particle.x - size / 2, particle.y - size / 2, size, size);
      }
      pointer.vx *= 0.9;
      pointer.vy *= 0.9;
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [phone]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}

const distance2 = (particle: Particle, x: number, y: number) => (particle.x - x) ** 2 + (particle.y - y) ** 2;
