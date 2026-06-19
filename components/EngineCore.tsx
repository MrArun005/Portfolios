"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group } from "three";

const AMBER = "#f4b860";
const TEAL = "#5ec8c2";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** The engine: a molten amber core inside a slowly counter-rotating teal cage. */
function Core() {
  const tilt = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, dt) => {
    if (spin.current) {
      spin.current.rotation.y += dt * 0.25;
      spin.current.rotation.x += dt * 0.12;
    }
    if (tilt.current) {
      tilt.current.rotation.y = lerp(tilt.current.rotation.y, pointer.current.x * 0.6, 0.05);
      tilt.current.rotation.x = lerp(tilt.current.rotation.x, pointer.current.y * 0.4, 0.05);
    }
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        {/* faceted crystalline core (flat-shaded gem, not a blob) */}
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

        {/* geodesic cage */}
        <mesh scale={1.62}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.24} />
        </mesh>

        {/* tight inner frame */}
        <mesh scale={1.22}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={AMBER} wireframe transparent opacity={0.16} />
        </mesh>
      </group>
    </group>
  );
}

export default function EngineCore() {
  return (
    <Canvas
      dpr={[1, 1.4]}
      camera={{ position: [0, 0, 6.4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 3, 5]} intensity={70} color={AMBER} />
      <pointLight position={[-5, -3, 2]} intensity={48} color={TEAL} />
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
        <Core />
      </Float>
    </Canvas>
  );
}
