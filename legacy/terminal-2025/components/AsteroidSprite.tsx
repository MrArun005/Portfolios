"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { TextureLoader, type Group, type Mesh, type Texture } from "three";

const easeOut = (p: number) => 1 - (1 - p) * (1 - p);

/**
 * Image-accurate asteroid: a billboard sprite of a transparent-background
 * asteroid PNG, so it looks EXACTLY like the generated image. Same choreography
 * as the 3D one — emerges from the deep sky behind the range, hovers, then
 * lunges at the viewer (in-plane tumble + camera shake + light flash on impact).
 *
 * Loads `/assets/asteroid.png` defensively: if the image is missing/fails, it
 * renders nothing rather than crashing the scene. Use a SINGLE asteroid on a
 * fully transparent background.
 */
export function AsteroidSprite({
  shake,
  flash,
}: {
  shake: React.MutableRefObject<number>;
  flash?: React.MutableRefObject<number>;
}) {
  const [tex, setTex] = useState<Texture | null>(null);
  const grp = useRef<Group>(null);
  const plane = useRef<Mesh>(null);
  const s = useRef({
    phase: "wait" as "wait" | "reveal" | "dance" | "strike",
    t: 0,
    delay: 3,
    rx: 0,
    ry: 0,
    sx: 0,
    sy: 0,
    sz: -18,
    spin: 0,
  });

  useEffect(() => {
    let alive = true;
    new TextureLoader().load(
      "/assets/asteroid.png",
      (t) => {
        if (alive) setTex(t);
      },
      undefined,
      () => {
        /* missing/failed → leave null; scene unaffected */
      },
    );
    return () => {
      alive = false;
    };
  }, []);

  useFrame((state, dt) => {
    const g = grp.current;
    if (!g) return;
    const st = s.current;
    st.t += dt;
    if (plane.current) plane.current.rotation.z += dt * st.spin;

    if (st.phase === "wait") {
      g.position.set(0, 0, -100);
      g.scale.setScalar(0.001);
      if (st.t >= st.delay) {
        st.phase = "reveal";
        st.t = 0;
        st.rx = (Math.random() - 0.5) * 6;
        st.ry = (Math.random() - 0.5) * 3;
        st.spin = (Math.random() - 0.5) * 1.2;
      }
    } else if (st.phase === "reveal") {
      const e = easeOut(Math.min(st.t / 1.1, 1));
      g.position.set(st.rx * e, (st.ry + 2.5) * e, -55 + (-18 - -55) * e);
      g.scale.setScalar(0.4 + e * 2);
      if (st.t >= 1.1) {
        st.phase = "dance";
        st.t = 0;
      }
    } else if (st.phase === "dance") {
      const k = st.t / 1.7;
      g.position.set(
        st.rx + Math.sin(st.t * 3) * 0.8,
        st.ry + 2.5 + Math.sin(st.t * 4.3 + 1) * 0.6,
        -18 + k * 4,
      );
      g.scale.setScalar(2.4 + k * 0.8);
      if (st.t >= 1.7) {
        st.phase = "strike";
        st.t = 0;
        st.sx = g.position.x;
        st.sy = g.position.y;
        st.sz = g.position.z;
      }
    } else {
      const e = Math.min(st.t / 0.55, 1) ** 2;
      const tz = state.camera.position.z + 2;
      g.position.set(st.sx * (1 - e), st.sy * (1 - e), st.sz + (tz - st.sz) * e);
      g.scale.setScalar(3 + e * e * 14);
      if (e >= 1) {
        st.phase = "wait";
        st.t = 0;
        st.delay = 9 + Math.random() * 8;
        shake.current = 1.1;
        if (flash) flash.current = 1;
        if (typeof window !== "undefined") window.dispatchEvent(new Event("quake"));
      }
    }
  });

  const aspect = useMemo(() => {
    const img = tex?.image as { width?: number; height?: number } | undefined;
    return img?.width && img?.height ? img.width / img.height : 1;
  }, [tex]);

  if (!tex) return null;

  return (
    <Billboard ref={grp}>
      <mesh ref={plane}>
        <planeGeometry args={[2 * aspect, 2]} />
        <meshBasicMaterial map={tex} transparent alphaTest={0.08} depthWrite={false} toneMapped={false} />
      </mesh>
    </Billboard>
  );
}
