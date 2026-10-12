"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { StudioEnvironment } from "./StudioEnvironment";

/**
 * Emblema 3D da marca: um par de alianças entrelaçadas (inspirado no logotipo).
 * Não representa um produto específico do catálogo.
 */

function bandProfile(radius: number, thickness: number, width: number, segments: number) {
  const pts: THREE.Vector2[] = [];
  const n = 4; // superelipse: perfil "conforto" levemente abaulado
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const x = radius + (thickness / 2) * Math.sign(c) * Math.pow(Math.abs(c), 2 / n);
    const y = (width / 2) * Math.sign(s) * Math.pow(Math.abs(s), 2 / n);
    pts.push(new THREE.Vector2(x, y));
  }
  return pts;
}

function Ring({
  radius,
  thickness,
  width,
  color,
  quality,
  materialRef,
  ...props
}: {
  radius: number;
  thickness: number;
  width: number;
  color: string;
  quality: "high" | "low";
  materialRef: (m: THREE.MeshPhysicalMaterial | null) => void;
} & React.ComponentProps<"group">) {
  const geometry = useMemo(() => {
    const seg = quality === "high" ? 48 : 24;
    const radial = quality === "high" ? 160 : 72;
    const g = new THREE.LatheGeometry(bandProfile(radius, thickness, width, seg), radial);
    g.computeVertexNormals();
    return g;
  }, [radius, thickness, width, quality]);

  return (
    <group {...props}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          ref={materialRef}
          color={color}
          metalness={1}
          roughness={0.16}
          clearcoat={0.6}
          clearcoatRoughness={0.12}
          envMapIntensity={0}
        />
      </mesh>
    </group>
  );
}

type SceneProps = {
  progress: RefObject<number>;
  intro: RefObject<number>;
  quality: "high" | "low";
};

function Rings({ progress, intro, quality }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const materials = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const { camera, pointer, size } = useThree();
  const isNarrow = size.width < 768;
  const register = (m: THREE.MeshPhysicalMaterial | null) => {
    if (m && !materials.current.includes(m)) materials.current.push(m);
  };

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current ?? 0;
    const i = intro.current ?? 1;
    const t = state.clock.elapsedTime;

    // revelação: a luz "acende" sobre o metal
    materials.current.forEach((m) => (m.envMapIntensity = 0.05 + i * 1.35));

    // rotação 3D discreta + leve reação ao ponteiro
    const targetRotY = t * 0.18 + pointer.x * 0.25 + p * 1.2;
    const targetRotX = -0.35 + pointer.y * 0.12 + p * 0.5;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 3, delta);

    // scroll: aproxima a câmera e desloca as alianças para revelar a próxima seção
    const scale = (isNarrow ? 0.62 : 1) * (0.8 + i * 0.1 + p * 0.22);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, scale, 4, delta));
    const tx = isNarrow ? 0 : p * 1.9;
    const ty = (1 - i) * -0.4 + Math.sin(t * 0.8) * 0.04 + (isNarrow ? 0.85 + p * 1.2 : 0.5 + p * 0.2);
    g.position.x = THREE.MathUtils.damp(g.position.x, tx, 4, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 6.2 - p * 1.9, 4, delta);
  });

  return (
    <group ref={group}>
      <Ring radius={1} thickness={0.16} width={0.42} color="#d9ae5c" quality={quality} materialRef={register} rotation={[Math.PI / 2.2, 0, 0.25]} position={[-0.45, 0.1, 0]} />
      <Ring radius={0.86} thickness={0.13} width={0.34} color="#e8c27a" quality={quality} materialRef={register} rotation={[Math.PI / 6, 0.4, -0.9]} position={[0.55, -0.12, 0.1]} />
    </group>
  );
}

export default function RingsScene({ progress, intro, quality }: SceneProps) {
  return (
    <Canvas
      dpr={quality === "high" ? [1, 2] : [1, 1.25]}
      camera={{ position: [0, 0, 6.2], fov: 35 }}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <StudioEnvironment resolution={quality === "high" ? 256 : 128} />
      <ambientLight intensity={0.15} />
      <Rings progress={progress} intro={intro} quality={quality} />
      {quality === "high" && <Sparkles count={40} scale={[8, 5, 3]} size={1.6} speed={0.25} opacity={0.5} color="#e5c77f" />}
    </Canvas>
  );
}
