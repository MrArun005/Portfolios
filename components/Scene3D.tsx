"use client";

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, useTexture } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import {
  PlaneGeometry,
  Vector3,
  RepeatWrapping,
  IcosahedronGeometry,
  CanvasTexture,
  AdditiveBlending,
  type BufferGeometry,
  type Group,
  type Mesh,
} from "three";
import { GltfAsteroid } from "./GltfAsteroid";

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

/**
 * Holds the core centered through the hero (where the headline spans screen
 * center), then glides it left as you scroll into the content sections so it
 * passes *behind* the left-aligned text columns — giving the mix-blend text
 * bright pixels to invert against instead of parking in the empty center gap.
 */
function ScrollDrift({
  scroll,
  children,
}: {
  scroll: React.MutableRefObject<number>;
  children: React.ReactNode;
}) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const s = scroll.current;
    const t = Math.min(1, Math.max(0, (s - 0.06) / 0.32)); // ramp over 6%–38% scroll
    const targetX = -1.75 * t; // world units left → ~left third of the screen
    ref.current.position.x = lerp(ref.current.position.x, targetX, 0.06);
  });
  return <group ref={ref}>{children}</group>;
}

// --- procedural mountain heightfield ---
function hash2(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}
function ridgedFbm(x: number, y: number): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < 5; o++) {
    let n = valueNoise(x * freq, y * freq);
    n = 1 - Math.abs(n * 2 - 1);
    n = n * n;
    sum += n * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.05;
  }
  return sum / norm;
}

function Terrain() {
  const geo = useMemo(() => {
    const g = new PlaneGeometry(180, 140, 140, 110);
    const p = g.attributes.position;
    const v = new Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      let h = ridgedFbm(v.x * 0.055 + 12, v.y * 0.055 + 7);
      h += 0.35 * ridgedFbm(v.x * 0.13 - 5, v.y * 0.13 + 9);
      h = Math.pow(h, 1.7) * 9;
      p.setZ(i, h);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const rockTexture = useTexture("/assets/rock_mountain.png");
  useMemo(() => {
    rockTexture.wrapS = RepeatWrapping;
    rockTexture.wrapT = RepeatWrapping;
    rockTexture.repeat.set(12, 12);
  }, [rockTexture]);

  return (
    <group position={[0, -11, -30]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={geo}>
        <meshStandardMaterial
          map={rockTexture}
          bumpMap={rockTexture}
          bumpScale={0.16}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      <mesh geometry={geo}>
        <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.03} />
      </mesh>
    </group>
  );
}

/** Screen flash effect light that spikes on asteroid collision. */
function FlashLight({ flash }: { flash: React.MutableRefObject<number> }) {
  const lightRef = useRef<any>(null);
  useFrame((_, dt) => {
    if (lightRef.current) {
      lightRef.current.intensity = flash.current * 450;
    }
    flash.current = Math.max(0, flash.current - dt * 3.2); // rapid decay
  });
  return <pointLight ref={lightRef} position={[0, 0, 5]} color={AMBER} intensity={0} />;
}

// Background asteroid geometry helper
function makeDebrisGeometry(): BufferGeometry {
  const geo = new IcosahedronGeometry(1, 4);
  const pos = geo.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const n =
      0.4 * Math.sin(v.x * 2.5 + v.y * 1.8) +
      0.25 * Math.sin(v.y * 4.8 + v.z * 3.5) +
      0.15 * Math.sin(v.z * 8.5 + v.x * 6.0);
    const r = 1 + n * 0.45;
    v.multiplyScalar(r);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Background asteroid debris field to add scale and realistic depth. */
function BackgroundDebris() {
  const texture = useTexture("/assets/asteroid_surface.png");
  const geometry = useMemo(() => makeDebrisGeometry(), []);

  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * 65;
      const y = (Math.random() - 0.5) * 35 + 4;
      const z = -20 - Math.random() * 40;
      const scale = 0.15 + Math.random() * 0.75;
      const rx = Math.random() * Math.PI;
      const ry = Math.random() * Math.PI;
      const rz = Math.random() * Math.PI;
      const speedX = (Math.random() - 0.5) * 0.2;
      const speedY = (Math.random() - 0.5) * 0.2;
      arr.push({ x, y, z, scale, rx, ry, rz, speedX, speedY });
    }
    return arr;
  }, []);

  const groupRef = useRef<Group>(null);
  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as Mesh;
      const info = items[i];
      if (child && info) {
        child.rotation.x += dt * info.speedX;
        child.rotation.y += dt * info.speedY;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((item, idx) => (
        <mesh
          key={idx}
          geometry={geometry}
          position={[item.x, item.y, item.z]}
          scale={[item.scale, item.scale, item.scale]}
          rotation={[item.rx, item.ry, item.rz]}
        >
          <meshStandardMaterial
            map={texture}
            bumpMap={texture}
            bumpScale={0.12}
            color="#5a5246"
            roughness={0.95}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
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
  const reduceMotion = useReducedMotion();
  useFrame((state) => {
    const s = scroll.current;
    const b = base.current;
    if (!reduceMotion) {
      b.x = lerp(b.x, mouse.current.x * 0.9, 0.045);
      b.y = lerp(b.y, mouse.current.y * -0.7, 0.045);
    }
    b.z = lerp(b.z, 8.5 - s * 5.5, 0.05);
    const sh = shake.current;
    state.camera.position.x = b.x + (Math.random() - 0.5) * sh;
    state.camera.position.y = b.y + (Math.random() - 0.5) * sh;
    state.camera.position.z = b.z;
    state.camera.lookAt(0, 0, 0);
    shake.current = sh > 0.002 ? sh * 0.9 : 0;
  });
  return null;
}

/** Soft radial glow texture, generated at runtime (no asset). */
function makeGlow(hex: string): CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, hex + "cc");
  g.addColorStop(0.35, hex + "55");
  g.addColorStop(1, hex + "00");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new CanvasTexture(c);
}

/** Faint amber/teal nebula clouds far behind the scene — the "space" colour. */
function Nebula() {
  const clouds = useMemo(() => {
    const amber = makeGlow("#f4b860");
    const teal = makeGlow("#5ec8c2");
    return [
      { tex: amber, pos: [-24, 9, -52] as [number, number, number], scale: 42, op: 0.16 },
      { tex: teal, pos: [28, -7, -56] as [number, number, number], scale: 50, op: 0.14 },
      { tex: amber, pos: [8, 18, -62] as [number, number, number], scale: 32, op: 0.1 },
      { tex: teal, pos: [-16, -16, -50] as [number, number, number], scale: 38, op: 0.1 },
    ];
  }, []);
  return (
    <group>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={c.tex}
            transparent
            opacity={c.op}
            blending={AdditiveBlending}
            depthWrite={false}
            fog={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene3D() {
  const scroll = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const shake = useRef(0);
  const flash = useRef(0);

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
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#05070c"]} />
      <fog attach="fog" args={["#05070c", 8, 30]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 3, 5]} intensity={90} color={AMBER} />
      <pointLight position={[-6, -3, 2]} intensity={65} color={TEAL} />

      {/* layered starfield: dense near + sparse big-distant */}
      <Stars radius={80} depth={50} count={4500} factor={3} saturation={0} fade speed={0.4} />
      <Stars radius={130} depth={70} count={1400} factor={6} saturation={0} fade speed={0.25} />
      <Nebula />

      <Suspense fallback={null}>
        <Terrain />
        <ScrollDrift scroll={scroll}>
          <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
            <Core />
          </Float>
        </ScrollDrift>
        <GltfAsteroid shake={shake} flash={flash} />
        <BackgroundDebris />
        <FlashLight flash={flash} />
      </Suspense>

      <Rig scroll={scroll} mouse={mouse} shake={shake} />
    </Canvas>
  );
}
