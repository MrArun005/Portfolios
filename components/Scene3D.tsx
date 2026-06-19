"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, useTexture } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import {
  IcosahedronGeometry,
  PlaneGeometry,
  Vector3,
  RepeatWrapping,
  type BufferGeometry,
  type Group,
  type Mesh,
} from "three";

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

const easeOut = (p: number) => 1 - (1 - p) * (1 - p);

// --- procedural mountain heightfield (ridged fractal noise) ---
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
/** Ridged fractal Brownian motion → sharp mountain ridges. Returns ~0..1. */
function ridgedFbm(x: number, y: number): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < 5; o++) {
    let n = valueNoise(x * freq, y * freq);
    n = 1 - Math.abs(n * 2 - 1); // fold into ridges
    n = n * n; // sharpen peaks
    sum += n * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.05;
  }
  return sum / norm;
}

/** A real mountain range receding into the fog — the "land" with realistic texture. */
function Terrain() {
  const geo = useMemo(() => {
    const g = new PlaneGeometry(180, 140, 140, 110);
    const p = g.attributes.position;
    const v = new Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      // base ridged peaks + a second rotated octave for natural variation
      let h = ridgedFbm(v.x * 0.055 + 12, v.y * 0.055 + 7);
      h += 0.35 * ridgedFbm(v.x * 0.13 - 5, v.y * 0.13 + 9);
      h = Math.pow(h, 1.7) * 9; // a low range that sits BELOW the floating core
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

/** A detailed sphere whose vertices are pushed around by layered noise — an
 *  irregular, lumpy rock rather than a clean polyhedron. Subdivided more for details. */
function makeAsteroidGeometry(): BufferGeometry {
  const geo = new IcosahedronGeometry(1, 6); // increased detail
  const pos = geo.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const n =
      0.42 * Math.sin(v.x * 2.7 + v.y * 1.9) +
      0.26 * Math.sin(v.y * 5.1 + v.z * 3.7) +
      0.16 * Math.sin(v.z * 8.9 + v.x * 6.3) +
      0.1 * Math.sin(v.x * 14.2 + v.z * 11.6) +
      0.07 * Math.sin(v.y * 21 + v.x * 17);
    const r = 1 + n * 0.5; // craggy displacement
    v.multiplyScalar(r);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Cinematic background skybox/plane with the custom generated starry space image. */
function SkyBackground() {
  const texture = useTexture("/sky.jpg");
  return (
    <mesh position={[0, 5, -58]}>
      <planeGeometry args={[150, 112]} />
      <meshBasicMaterial map={texture} depthWrite={false} fog={false} />
    </mesh>
  );
}

/**
 * Choreographed jump-scare asteroid, upgraded with realistic texture and lighting:
 *   reveal  — drifts out of the fog into clear view so you notice it
 *   dance   — hovers and wobbles in place for a beat
 *   strike  — suddenly lunges straight at your face, ballooning, + camera shake
 */
function Asteroid({ shake }: { shake: React.MutableRefObject<number> }) {
  const ref = useRef<Mesh>(null);
  const geometry = useMemo(() => makeAsteroidGeometry(), []);
  
  const texture = useTexture("/assets/asteroid_surface.png");
  useMemo(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(2, 2);
  }, [texture]);

  const s = useRef({
    phase: "wait" as "wait" | "reveal" | "dance" | "strike",
    t: 0,
    delay: 4,
    rx: 0,
    ry: 0,
    sx: 0,
    sy: 0,
    sz: -4,
  });

  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    const st = s.current;
    st.t += dt;

    if (st.phase === "wait") {
      m.position.set(0, 0, -55);
      m.scale.setScalar(0.4);
      if (st.t >= st.delay) {
        st.phase = "reveal";
        st.t = 0;
        st.rx = (Math.random() - 0.5) * 5;
        st.ry = (Math.random() - 0.5) * 3;
      }
    } else if (st.phase === "reveal") {
      const p = Math.min(st.t / 1.1, 1);
      const e = easeOut(p);
      // emerges from deep behind the range, up in the sky — then approaches
      m.position.set(st.rx * e, (st.ry + 2.5) * e, -55 + (-18 - -55) * e);
      m.scale.setScalar(0.5 + e * 1.5);
      m.rotation.x += dt * 1.4;
      m.rotation.y += dt * 1.7;
      if (p >= 1) {
        st.phase = "dance";
        st.t = 0;
      }
    } else if (st.phase === "dance") {
      const dur = 1.7;
      const k = st.t / dur;
      // hover + wobble, creeping a touch closer (menacing) before it pounces
      m.position.set(
        st.rx + Math.sin(st.t * 3) * 0.8,
        st.ry + 2.5 + Math.sin(st.t * 4.3 + 1) * 0.6,
        -18 + k * 4,
      );
      m.scale.setScalar(1.7 + k * 0.5);
      m.rotation.x += dt * 2.4;
      m.rotation.y += dt * 2.8;
      if (st.t >= dur) {
        st.phase = "strike";
        st.t = 0;
        st.sx = m.position.x;
        st.sy = m.position.y;
        st.sz = m.position.z;
      }
    } else {
      const p = Math.min(st.t / 0.55, 1);
      const e = p * p; // accelerate hard
      const tz = state.camera.position.z + 2; // erupts through the viewer
      m.position.set(st.sx * (1 - e), st.sy * (1 - e), st.sz + (tz - st.sz) * e);
      m.scale.setScalar(1.9 + e * e * 8);
      m.rotation.x += dt * 7;
      m.rotation.y += dt * 8;
      if (p >= 1) {
        st.phase = "wait";
        st.t = 0;
        st.delay = 9 + Math.random() * 8; // breather before the next one
        shake.current = 1.1; // earthquake rumble
        // tell the DOM to tremble too
        if (typeof window !== "undefined") window.dispatchEvent(new Event("quake"));
      }
    }
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial
        map={texture}
        bumpMap={texture}
        bumpScale={0.15}
        color="#8c8273"
        emissive="#f4b860"
        emissiveIntensity={0.25}
        roughness={0.9}
        metalness={0.2}
      />
    </mesh>
  );
}

/** Background asteroid debris field to add scale and realistic depth. */
function BackgroundDebris() {
  const texture = useTexture("/assets/asteroid_surface.png");
  const geometry = useMemo(() => makeAsteroidGeometry(), []);

  // Generate 25 debris pieces with random position, scale, rotation, and rotation speed
  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * 65;
      const y = (Math.random() - 0.5) * 35 + 4;
      const z = -20 - Math.random() * 40; // background depth
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
    shake.current = sh > 0.002 ? sh * 0.9 : 0; // slower decay = longer rumble
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
      <fog attach="fog" args={["#0d1117", 7, 28]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 3, 5]} intensity={90} color={AMBER} />
      <pointLight position={[-6, -3, 2]} intensity={65} color={TEAL} />

      <Stars radius={70} depth={45} count={2200} factor={3} saturation={0} fade speed={0.5} />

      <Suspense fallback={null}>
        <SkyBackground />
        <Terrain />
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
          <Core />
        </Float>
        <Asteroid shake={shake} />
        <BackgroundDebris />
      </Suspense>

      <Rig scroll={scroll} mouse={mouse} shake={shake} />
    </Canvas>
  );
}
