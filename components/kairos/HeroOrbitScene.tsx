"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Curve, Vector3, TubeGeometry, Mesh, MathUtils } from "three";

class Orbit extends Curve<Vector3> {
  constructor() { super(); }
  getPoint(t: number, target = new Vector3()) {
    const a = .35 + t * Math.PI * 1.82;
    return target.set(Math.cos(a) * 1.65, Math.sin(a) * 1.35, Math.sin(a * 2) * .38);
  }
}

function Sculpture({ host }: { host: HTMLElement }) {
  const mesh = useRef<Mesh>(null);
  const input = useRef({ progress: 0, x: 0, y: 0 });
  const geometry = useMemo(() => {
    const curve = new Orbit();
    const solid = new TubeGeometry(curve, 128, .16, 12, false);
    const line = new TubeGeometry(curve, 128, .008, 12, false);
    solid.morphAttributes.position = [line.attributes.position.clone()];
    solid.morphAttributes.normal = [line.attributes.normal.clone()];
    line.dispose();
    return solid;
  }, []);
  useEffect(() => {
    const hero = host.closest("section")!;
    const scroll = () => {
      const box = hero.getBoundingClientRect();
      input.current.progress = MathUtils.clamp(-box.top / box.height, 0, 1);
    };
    const pointer = (event: PointerEvent) => {
      input.current.x = event.clientX / innerWidth - .5;
      input.current.y = event.clientY / innerHeight - .5;
    };
    const leave = () => { input.current.x = 0; input.current.y = 0; };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    hero.addEventListener("pointermove", pointer, { passive: true });
    hero.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      hero.removeEventListener("pointermove", pointer);
      hero.removeEventListener("pointerleave", leave);
      geometry.dispose();
    };
  }, [geometry, host]);
  useFrame(({ clock }, delta) => {
    const object = mesh.current;
    if (!object) return;
    const { progress: p, x, y } = input.current;
    // Thickness follows actual scroll, without a time-triggered timeline.
    if (object.morphTargetInfluences) object.morphTargetInfluences[0] = MathUtils.smoothstep(p, .1, .75);
    object.rotation.x = MathUtils.damp(object.rotation.x, .35 - p * .28 + y * .12, 5, Math.min(delta, .05));
    object.rotation.y = MathUtils.damp(object.rotation.y, -.45 + p * .7 + x * .16, 5, Math.min(delta, .05));
    object.rotation.z = -.38 + p * .55 + Math.sin(clock.elapsedTime * .22) * .025 * (1 - p);
    object.position.y = -p * .6;
    object.scale.setScalar(1 + p * .18);
  });
  return <>
    <ambientLight intensity={.8} />
    <directionalLight position={[1, 3, 4]} intensity={4} color="#dae7f5" />
    <directionalLight position={[-3, -1, 2]} intensity={5} color="#126bff" />
    <directionalLight position={[3, -2, -1]} intensity={3} color="#8d9aad" />
    <mesh ref={mesh} geometry={geometry} onUpdate={object => object.updateMorphTargets()}>
      <meshPhysicalMaterial color="#344459" metalness={.65} roughness={.24} clearcoat={.8} clearcoatRoughness={.2} />
    </mesh>
  </>;
}

export default function HeroOrbitScene({ host, active, onFailure }: { host: HTMLElement; active: boolean; onFailure: () => void }) {
  return <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.5]} frameloop={active ? "always" : "never"} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} onCreated={({ gl }) => {
    gl.domElement.addEventListener("webglcontextlost", onFailure, { once: true });
  }}><Sculpture host={host} /></Canvas>;
}
