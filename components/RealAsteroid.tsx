"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  IcosahedronGeometry,
  Vector3,
  RepeatWrapping,
  AdditiveBlending,
  type BufferGeometry,
  type Group,
  type Mesh,
} from "three";

const AMBER = "#f4b860";
const TEAL = "#5ec8c2";
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A highly detailed sphere whose vertices are pushed around by layered noise to create craggy volcanic structures. */
function makeAsteroidGeometry(): BufferGeometry {
  const geo = new IcosahedronGeometry(1, 5);
  const pos = geo.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const n =
      0.45 * Math.sin(v.x * 3.2 + v.y * 2.1) +
      0.3 * Math.sin(v.y * 5.5 + v.z * 4.1) +
      0.18 * Math.sin(v.z * 9.5 + v.x * 6.8) +
      0.12 * Math.sin(v.x * 15.2 + v.z * 12.3) +
      0.08 * Math.sin(v.y * 22.5 + v.x * 18.2);
    const r = 1 + n * 0.48; // highly craggy displacement
    v.multiplyScalar(r);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

interface RealAsteroidProps {
  shake: React.MutableRefObject<number>;
  flash: React.MutableRefObject<number>;
}

export function RealAsteroid({ shake, flash }: RealAsteroidProps) {
  const ref = useRef<Group>(null);
  const asteroidMeshRef = useRef<Mesh>(null);
  const coreTrailRef = useRef<Group>(null);
  const tealTrailRef = useRef<Group>(null);
  
  const geometry = useMemo(() => makeAsteroidGeometry(), []);
  
  const texture = useTexture("/assets/asteroid_surface.png");
  useMemo(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(2, 2);
  }, [texture]);

  // Keep a history of asteroid coordinates to generate physical trail lag
  const history = useRef<Vector3[]>([]);

  const s = useRef({
    phase: "wait" as "wait" | "hurtle",
    t: 0,
    delay: 8,
    startX: 0,
    startY: 0,
    startZ: -60,
    endX: 0,
    endY: 0,
    endZ: 9.5,
  });

  useFrame((state, dt) => {
    const g = ref.current;
    const mesh = asteroidMeshRef.current;
    if (!g || !mesh) return;
    const st = s.current;
    st.t += dt;

    if (st.phase === "wait") {
      g.position.set(0, 0, -100);
      g.scale.setScalar(0.01);
      history.current = [];

      // Hide all trail particles
      if (coreTrailRef.current) {
        coreTrailRef.current.children.forEach((child) => {
          child.position.set(0, 0, -100);
          child.scale.setScalar(0.01);
        });
      }
      if (tealTrailRef.current) {
        tealTrailRef.current.children.forEach((child) => {
          child.position.set(0, 0, -100);
          child.scale.setScalar(0.01);
        });
      }

      if (st.t >= st.delay) {
        st.phase = "hurtle";
        st.t = 0;
        
        // Spawn from random sky position
        st.startX = (Math.random() - 0.5) * 48; // wide spread
        st.startY = 14 + Math.random() * 12;   // high up in the sky
        st.startZ = -55;                       // deep in background
        
        // Target: Center of camera to collide directly into screen
        st.endX = (Math.random() - 0.5) * 3;
        st.endY = (Math.random() - 0.5) * 1.5;
        st.endZ = state.camera.position.z + 1.2; // goes slightly past camera to crash
        
        g.position.set(st.startX, st.startY, st.startZ);
        g.scale.setScalar(0.2);
      }
    } else if (st.phase === "hurtle") {
      const duration = 2.5; // 2.5 seconds flight
      const progress = Math.min(st.t / duration, 1);
      const e = progress * progress; // quadratic ease-in (acceleration)
      
      const currentX = lerp(st.startX, st.endX, e);
      const currentY = lerp(st.startY, st.endY, e);
      const currentZ = lerp(st.startZ, st.endZ, e);
      
      g.position.set(currentX, currentY, currentZ);
      
      // Grow in scale as it approaches
      const currentScale = 0.2 + e * 4.3;
      g.scale.setScalar(currentScale);
      
      // Rotate the rock itself
      mesh.rotation.x += dt * 4.8;
      mesh.rotation.y += dt * 5.8;

      // Track positions for physics lag tail
      const currentPos = new Vector3().copy(g.position);
      history.current.push(currentPos);
      if (history.current.length > 30) {
        history.current.shift();
      }

      const hist = history.current;
      const len = hist.length;
      const time = state.clock.getElapsedTime();

      // Update Amber Core particles (hugging the asteroid closely)
      if (coreTrailRef.current) {
        const children = coreTrailRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i] as Mesh;
          // grab position near the end of history
          const histIdx = Math.max(0, len - 1 - (children.length - 1 - i));
          const pos = hist[histIdx];
          if (pos) {
            // slight flicker wave perpendicular to motion
            const wave = Math.sin(time * 26 + i) * 0.1;
            child.position.set(pos.x + wave, pos.y + wave, pos.z);
            
            const ratio = i / children.length;
            child.scale.setScalar(currentScale * 0.62 * ratio);
          }
        }
      }

      // Update Teal Envelope particles (wider, expanding outward)
      if (tealTrailRef.current) {
        const children = tealTrailRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i] as Mesh;
          // stretch indices over the entire history
          const histIdx = Math.max(0, Math.floor((i / children.length) * (len - 1)));
          const pos = hist[histIdx];
          if (pos) {
            // wider noise spread toward the tail end
            const dispersion = (1.0 - i / children.length) * 0.45;
            const spreadX = Math.cos(time * 20 + i) * dispersion;
            const spreadY = Math.sin(time * 20 + i) * dispersion;
            child.position.set(pos.x + spreadX, pos.y + spreadY, pos.z);
            
            const ratio = i / children.length;
            child.scale.setScalar(currentScale * 0.78 * (0.15 + ratio * 0.85));
          }
        }
      }

      if (progress >= 1) {
        // BOOM! COLLISION!
        st.phase = "wait";
        st.t = 0;
        st.delay = 290 + Math.random() * 20; // ~5 minutes between strikes
        shake.current = 1.75; // massive shake
        flash.current = 1.0;  // trigger full-screen point light flash
        
        if (typeof window !== "undefined") window.dispatchEvent(new Event("quake"));
      }
    }
  });

  return (
    <group>
      {/* Outer Teal Plasma Envelope */}
      <group ref={tealTrailRef}>
        {Array.from({ length: 18 }).map((_, idx) => {
          const ratio = idx / 18;
          const opacity = ratio * 0.65;
          return (
            <mesh key={idx} scale={[0.1, 0.1, 0.1]}>
              <icosahedronGeometry args={[0.72, 1]} />
              <meshBasicMaterial
                color={TEAL}
                transparent
                opacity={opacity}
                fog={false}
                blending={AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>

      {/* Inner Hot Amber Core Trail */}
      <group ref={coreTrailRef}>
        {Array.from({ length: 12 }).map((_, idx) => {
          const ratio = idx / 12;
          const opacity = ratio * 0.9;
          return (
            <mesh key={idx} scale={[0.1, 0.1, 0.1]}>
              <icosahedronGeometry args={[0.55, 1]} />
              <meshBasicMaterial
                color={AMBER}
                transparent
                opacity={opacity}
                fog={false}
                blending={AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>

      {/* Main Asteroid Rock Group */}
      <group ref={ref}>
        {/* Glowing Atmosphere/Entry Plasma Halo */}
        <mesh scale={1.12}>
          <icosahedronGeometry args={[1.0, 3]} />
          <meshBasicMaterial
            color={AMBER}
            transparent
            opacity={0.32}
            fog={false}
            blending={AdditiveBlending}
          />
        </mesh>

        {/* Textured Craggy Asteroid Mesh */}
        <mesh ref={asteroidMeshRef} geometry={geometry}>
          <meshStandardMaterial
            map={texture}
            bumpMap={texture}
            bumpScale={0.16}
            color="#8c8273"
            emissive="#e58e37"
            emissiveIntensity={0.65} // bright glowing fissures!
            roughness={0.92}
            metalness={0.25}
          />
        </mesh>
      </group>
    </group>
  );
}
