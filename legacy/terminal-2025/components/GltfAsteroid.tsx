"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Group } from "three";

useGLTF.preload("/models/asteroid.glb");

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Real low-poly asteroid 3D model.
 * Model: "Asteroid" by J-Toastie via Poly Pizza — CC BY 3.0 (attribution kept).
 *
 * Hurtles out of the deep sky and strikes the viewer ~once every 5 minutes,
 * with camera shake + light flash + page quake on impact.
 */
export function GltfAsteroid({
  shake,
  flash,
}: {
  shake: React.MutableRefObject<number>;
  flash?: React.MutableRefObject<number>;
}) {
  const { scene } = useGLTF("/models/asteroid.glb");

  // Clone, normalize to ~1 unit, and recenter so the choreography controls size/pos.
  const model = useMemo(() => {
    const c = scene.clone(true);
    const box = new Box3().setFromObject(c);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const k = 1 / (Math.max(size.x, size.y, size.z) || 1);
    c.scale.setScalar(k);
    c.position.set(-center.x * k, -center.y * k, -center.z * k);
    return c;
  }, [scene]);

  const ref = useRef<Group>(null);
  const s = useRef({
    phase: "wait" as "wait" | "hurtle",
    t: 0,
    delay: 8,
    sx: 0,
    sy: 14,
    sz: -60,
  });

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const st = s.current;
    st.t += dt;
    g.rotation.x += dt * 0.7;
    g.rotation.y += dt * 0.9;

    if (st.phase === "wait") {
      g.position.set(0, 140, -320); // parked far out of sight
      g.scale.setScalar(0.001);
      if (st.t >= st.delay) {
        st.phase = "hurtle";
        st.t = 0;
        st.sx = (Math.random() - 0.5) * 40;
        st.sy = 14 + Math.random() * 10;
        st.sz = -60;
      }
    } else {
      const p = Math.min(st.t / 2.4, 1);
      const e = p * p; // accelerate
      const tz = state.camera.position.z + 1; // erupts through the viewer
      g.position.set(lerp(st.sx, 0, e), lerp(st.sy, 0, e), lerp(st.sz, tz, e));
      g.scale.setScalar(0.5 + e * e * 4.5);
      if (p >= 1) {
        st.phase = "wait";
        st.t = 0;
        st.delay = 290 + Math.random() * 20; // ~5 min
        shake.current = 1.75;
        if (flash) flash.current = 1;
        if (typeof window !== "undefined") window.dispatchEvent(new Event("quake"));
      }
    }
  });

  return (
    <group ref={ref}>
      <primitive object={model} />
    </group>
  );
}
