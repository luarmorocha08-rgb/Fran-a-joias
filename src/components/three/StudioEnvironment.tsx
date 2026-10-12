"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Ambiente de estúdio gerado localmente (sem baixar HDRs externos).
 * As "softboxes" produzem os reflexos metálicos realistas nas joias.
 */
export function StudioEnvironment({ resolution = 256 }: { resolution?: number }) {
  return (
    <Environment resolution={resolution} frames={1}>
      <color attach="background" args={["#050505"]} />
      <Lightformer form="rect" intensity={4} color="#fff3d6" position={[0, 5, -4]} scale={[10, 2, 1]} />
      <Lightformer form="rect" intensity={2.5} color="#ffe2a8" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 1.2, 1]} />
      <Lightformer form="rect" intensity={2} color="#ffffff" position={[5, 0.5, 2]} rotation-y={-Math.PI / 2} scale={[6, 0.8, 1]} />
      <Lightformer form="ring" intensity={1.5} color="#e5c77f" position={[0, -3, 3]} scale={3} />
      <Lightformer form="rect" intensity={1} color="#c59a45" position={[0, 0, 6]} scale={[12, 0.3, 1]} />
    </Environment>
  );
}
