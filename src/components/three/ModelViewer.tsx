"use client";

import { Suspense, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { StudioEnvironment } from "./StudioEnvironment";

/**
 * Visualizador de modelos GLB/GLTF REAIS das peças (enviados pelo painel).
 * Rotação com mouse/toque, zoom controlado e mudança de ângulo guiada pelo scroll.
 */
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => ((m as THREE.MeshStandardMaterial).envMapIntensity = 1.3));
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
}

function ScrollOrbit({ progress, controls }: { progress: RefObject<number>; controls: RefObject<OrbitControlsImpl | null> }) {
  const interacting = useRef(false);
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const start = () => (interacting.current = true);
    const end = () => setTimeout(() => (interacting.current = false), 1500);
    c.addEventListener("start", start);
    c.addEventListener("end", end);
    return () => {
      c.removeEventListener("start", start);
      c.removeEventListener("end", end);
    };
  }, [controls]);

  useFrame(() => {
    const c = controls.current;
    if (!c || interacting.current) return;
    const p = progress.current ?? 0;
    // a câmera muda gradualmente de ângulo conforme o scroll
    c.setPolarAngle(THREE.MathUtils.lerp(c.getPolarAngle(), Math.PI / 2.6 + p * 0.5, 0.05));
    c.setAzimuthalAngle(THREE.MathUtils.lerp(c.getAzimuthalAngle(), -0.6 + p * 1.6, 0.05));
    c.update();
  });
  return null;
}

export default function ModelViewer({
  url,
  progress,
  quality,
}: {
  url: string;
  progress: RefObject<number>;
  quality: "high" | "low";
}) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  return (
    <Canvas dpr={quality === "high" ? [1, 2] : [1, 1.25]} camera={{ position: [0, 0.6, 4], fov: 32 }} gl={{ antialias: quality === "high", alpha: true }}>
      <StudioEnvironment resolution={quality === "high" ? 256 : 128} />
      <Suspense
        fallback={
          <Html center>
            <span className="eyebrow whitespace-nowrap">Carregando modelo…</span>
          </Html>
        }
      >
        <Bounds fit clip observe margin={1.2}>
          <Center>
            <Model url={url} />
          </Center>
        </Bounds>
      </Suspense>
      <OrbitControls ref={controls} makeDefault enablePan={false} enableZoom minDistance={1.5} maxDistance={8} enableDamping />
      <ScrollOrbit progress={progress} controls={controls} />
    </Canvas>
  );
}
