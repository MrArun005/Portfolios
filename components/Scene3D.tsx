"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import type { Group, Mesh } from "three";

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

/**
 * Jump-scare asteroid: lurks far away in the fog, then every so often charges
 * straight out of the depths at the viewer, ballooning huge before whipping
 * past — and kicks the camera with a shake on the near-miss.
 */
function Asteroid({ shake }: { shake: React.MutableRefObject<number> }) {
  const ref = useRef<Mesh>(null);
  const st = useRef({ phase: "wait" as "wait" | "charge", t: 0, delay: 3.5, fx: -2, fy: 1.5 });

  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    const s = st.current;

    if (s.phase === "wait") {
      s.t += dt;
      // parked deep in the fog (out of sight) until it's time to strike
      m.position.set(s.fx, s.fy, -42);
      m.scale.setScalar(0.6);
      if (s.t >= s.delay) {
        s.phase = "charge";
        s.t = 0;
        // start roughly head-on so it reads as coming AT you
        s.fx = (Math.random() - 0.5) * 4;
        s.fy = (Math.random() - 0.5) * 2.5;
      }
    } else {
      s.t += dt;
      const dur = 1.0;
      const p = Math.min(s.t / dur, 1);
      const ease = p * p; // accelerate as it nears
      const targetZ = state.camera.position.z + 2; // erupts right through the viewer
      m.position.set(s.fx * (1 - ease), s.fy * (1 - ease), -42 + (targetZ + 42) * ease);
      m.scale.setScalar(0.6 + ease * ease * 7); // balloons hard at the end
      m.rotation.x += dt * 4;
      m.rotation.y += dt * 5;
      if (p >= 1) {
        s.phase = "wait";
        s.t = 0;
        s.delay = 7 + Math.random() * 8; // next strike in 7–15s
        shake.current = 0.7; // jolt the camera
      }
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 1]} />
      {/* warm emissive glow so it's visible even when backlit and in-your-face */}
      <meshStandardMaterial
        color="#7a6a52"
        emissive="#d98a3a"
        emissiveIntensity={0.4}
        roughness={0.9}
        metalness={0.1}
        flatShading
      />
    </mesh>
  );
}

/** Camera rig: mouse parallax + scroll-driven fly-in, plus decaying shake. */
function Rig({
  scroll,
  mouse,
  shake,
}: {
  scroll: React.MutableRefObject<number>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  shake: React.MutableRefObject<number>;
}) {
  const base = useRef({ x: 0, y: 0, z: 8.5 });
  useFrame((state) => {
    const s = scroll.current;
    const b = base.current;
    // smooth base position (parallax + fly toward the centred core on scroll)
    b.x = lerp(b.x, mouse.current.x * 0.9, 0.045);
    b.y = lerp(b.y, mouse.current.y * -0.7, 0.045);
    b.z = lerp(b.z, 8.5 - s * 5.5, 0.05);
    const sh = shake.current;
    state.camera.position.x = b.x + (Math.random() - 0.5) * sh;
    state.camera.position.y = b.y + (Math.random() - 0.5) * sh;
    state.camera.position.z = b.z;
    state.camera.lookAt(0, 0, 0);
    shake.current = sh > 0.002 ? sh * 0.86 : 0; // decay
  });
  return null;
}

export default function Scene3D() {
  const scroll = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const shake = useRef(0);

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

      <Asteroid shake={shake} />

      <Rig scroll={scroll} mouse={mouse} shake={shake} />
    </Canvas>
  );
}
