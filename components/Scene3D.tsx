"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { IcosahedronGeometry, Vector3, type BufferGeometry, type Group, type Mesh } from "three";

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

/** A detailed sphere whose vertices are pushed around by layered noise — an
 *  irregular, lumpy rock rather than a clean polyhedron. Flat-shaded → facets. */
function makeAsteroidGeometry(): BufferGeometry {
  const geo = new IcosahedronGeometry(1, 5);
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

/**
 * Choreographed jump-scare asteroid:
 *   reveal  — drifts out of the fog into clear view so you notice it
 *   dance   — hovers and wobbles in place for a beat ("wait... what's that?")
 *   strike  — suddenly lunges straight at your face, ballooning, + camera shake
 * Then it resets and waits before doing it again.
 */
function Asteroid({ shake }: { shake: React.MutableRefObject<number> }) {
  const ref = useRef<Mesh>(null);
  const geometry = useMemo(() => makeAsteroidGeometry(), []);
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
      m.position.set(st.rx * e, st.ry * e, -55 + (-6 - -55) * e); // far → -6, in view
      m.scale.setScalar(0.4 + e * 1.1);
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
        st.rx + Math.sin(st.t * 3) * 0.7,
        st.ry + Math.sin(st.t * 4.3 + 1) * 0.5,
        -6 + k * 2,
      );
      m.scale.setScalar(1.5 + k * 0.4);
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
        shake.current = 0.85;
      }
    }
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial
        color="#7a6a52"
        emissive="#d98a3a"
        emissiveIntensity={0.4}
        roughness={0.95}
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

      <Asteroid shake={shake} />

      <Rig scroll={scroll} mouse={mouse} shake={shake} />
    </Canvas>
  );
}
