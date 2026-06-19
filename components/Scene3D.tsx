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

type Rock = {
  x: number;
  y: number;
  z: number;
  speed: number;
  scale: number;
  rsx: number;
  rsy: number;
};

function spawnRock(far: boolean): Rock {
  return {
    x: (Math.random() - 0.5) * 18,
    y: (Math.random() - 0.5) * 11,
    z: far ? -55 - Math.random() * 25 : -10 - Math.random() * 50,
    speed: 5 + Math.random() * 11, // units/sec toward the viewer
    scale: 0.35 + Math.random() * 1.7,
    rsx: (Math.random() - 0.5) * 2.2,
    rsy: (Math.random() - 0.5) * 2.2,
  };
}

/**
 * Asteroid storm: a continuous field of glowing rocks streaming out of the
 * depths toward the viewer. Varied size/speed, slow enough to track, and the
 * camera shakes when a big one passes close to dead-centre. The disaster.
 */
function AsteroidStorm({
  shake,
  count = 14,
}: {
  shake: React.MutableRefObject<number>;
  count?: number;
}) {
  const rocks = useRef<Rock[]>(Array.from({ length: count }, (_, i) => spawnRock(i % 2 === 0)));
  const meshes = useRef<(Mesh | null)[]>([]);

  useFrame((state, dt) => {
    const camZ = state.camera.position.z;
    const rs = rocks.current;
    for (let i = 0; i < rs.length; i++) {
      const r = rs[i];
      const m = meshes.current[i];
      if (!m) continue;
      r.z += r.speed * dt;
      if (r.z > camZ + 6) {
        // a big rock that just blew past near dead-centre kicks the camera
        if (r.scale > 1.2 && Math.abs(r.x) < 3 && Math.abs(r.y) < 2.2) {
          shake.current = Math.max(shake.current, 0.45);
        }
        rocks.current[i] = spawnRock(true);
        continue;
      }
      m.position.set(r.x, r.y, r.z);
      m.scale.setScalar(r.scale);
      m.rotation.x += r.rsx * dt;
      m.rotation.y += r.rsy * dt;
    }
  });

  return (
    <group>
      {rocks.current.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
        >
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#7a6a52"
            emissive="#d98a3a"
            emissiveIntensity={0.35}
            roughness={0.9}
            metalness={0.1}
            flatShading
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

      <AsteroidStorm shake={shake} />

      <Rig scroll={scroll} mouse={mouse} shake={shake} />
    </Canvas>
  );
}
