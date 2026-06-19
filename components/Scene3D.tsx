"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import type { Group } from "three";

const AMBER = "#f4b860";
const TEAL = "#5ec8c2";
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** The faceted engine core in its geodesic cage — the anchor of the scene. */
function Core() {
  const spin = useRef<Group>(null);
  useFrame((_, dt) => {
    if (spin.current) {
      spin.current.rotation.y += dt * 0.22;
      spin.current.rotation.x += dt * 0.1;
    }
  });
  return (
    <group ref={spin} position={[0, 0, 0]}>
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={AMBER}
          emissive={AMBER}
          emissiveIntensity={0.32}
          roughness={0.18}
          metalness={0.75}
          flatShading
        />
      </mesh>
      <mesh scale={1.62}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.24} />
      </mesh>
    </group>
  );
}

/** A floating wireframe shard at depth — debris the camera drifts past. */
function Shard({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * speed;
      ref.current.rotation.y += dt * speed * 1.3;
    }
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/** Camera rig: mouse parallax + gentle scroll-driven drift through the space. */
function Rig({
  scroll,
  mouse,
}: {
  scroll: React.MutableRefObject<number>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  useFrame((state) => {
    const s = scroll.current;
    // Parallax only on x/y (no scroll drift), and fly TOWARD the centred core as
    // you scroll so it grows and reads as approaching the viewer — not missing.
    state.camera.position.x = lerp(state.camera.position.x, mouse.current.x * 0.9, 0.045);
    state.camera.position.y = lerp(state.camera.position.y, mouse.current.y * -0.7, 0.045);
    state.camera.position.z = lerp(state.camera.position.z, 8.5 - s * 5.5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene3D() {
  const scroll = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.4]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0d1117"]} />
      <fog attach="fog" args={["#0d1117", 7, 26]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 3, 5]} intensity={80} color={AMBER} />
      <pointLight position={[-6, -3, 2]} intensity={55} color={TEAL} />

      <Stars radius={70} depth={45} count={2200} factor={3} saturation={0} fade speed={0.5} />

      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
        <Core />
      </Float>

      <Shard position={[-5, 2.4, -3]} scale={0.7} color={TEAL} speed={0.16} />
      <Shard position={[6, -2.4, -6]} scale={1.1} color={AMBER} speed={0.1} />
      <Shard position={[-6.5, -3, -10]} scale={1.5} color={TEAL} speed={0.08} />
      <Shard position={[4, 3.4, -13]} scale={0.9} color={AMBER} speed={0.12} />

      <Rig scroll={scroll} mouse={mouse} />
    </Canvas>
  );
}
