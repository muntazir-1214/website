"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function useTeeGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    // left shoulder
    shape.moveTo(-0.62, 0.42);
    shape.lineTo(-1.05, 0.62);
    shape.lineTo(-1.38, 0.5); // sleeve tip
    shape.lineTo(-1.08, 0.06); // sleeve bottom
    shape.quadraticCurveTo(-0.92, -0.04, -0.7, 0.0); // armpit
    shape.lineTo(-0.58, -0.85);
    shape.quadraticCurveTo(-0.56, -0.98, -0.4, -0.98);
    // hem
    shape.lineTo(0.4, -0.98);
    shape.quadraticCurveTo(0.56, -0.98, 0.58, -0.85);
    shape.lineTo(0.7, 0.0);
    shape.quadraticCurveTo(0.92, -0.04, 1.08, 0.06);
    shape.lineTo(1.38, 0.5);
    shape.lineTo(1.05, 0.62);
    shape.lineTo(0.62, 0.42);
    // collar
    shape.quadraticCurveTo(0.38, 0.68, 0, 0.6);
    shape.quadraticCurveTo(-0.38, 0.68, -0.62, 0.42);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 4,
      steps: 1,
    });
    geo.center();
    return geo;
  }, []);
}

function Shirt() {
  const group = useRef<THREE.Group>(null);
  const geometry = useTeeGeometry();

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y += delta * 0.5;
    g.rotation.x = Math.sin(t * 0.6) * 0.08 + 0.12;
    g.rotation.z = Math.sin(t * 0.45) * 0.05;
    g.position.y = Math.sin(t * 1.1) * 0.12;
  });

  return (
    <group ref={group} scale={1.05}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color="#a3e635"
          roughness={0.35}
          metalness={0.15}
          emissive="#365314"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* collar accent */}
      <mesh position={[0, 0.62, 0.13]}>
        <torusGeometry args={[0.28, 0.022, 12, 40, Math.PI]} />
        <meshStandardMaterial color="#09090b" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Rings() {
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const a = ringA.current;
    const b = ringB.current;
    if (!a || !b) return;
    a.rotation.z += delta * 0.45;
    b.rotation.z -= delta * 0.35;
    b.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.25 + 0.9;
  });

  return (
    <>
      <mesh ref={ringA} rotation={[1.25, 0.35, 0]}>
        <torusGeometry args={[1.85, 0.012, 8, 120]} />
        <meshBasicMaterial color="#a3e635" transparent opacity={0.45} />
      </mesh>
      <mesh ref={ringB} rotation={[1.25, -0.5, 0.6]}>
        <torusGeometry args={[2.1, 0.008, 8, 120]} />
        <meshBasicMaterial color="#71717a" transparent opacity={0.4} />
      </mesh>
    </>
  );
}

function Particles({ count = 130 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  // Deterministic pseudo-random spread (pure, stable across re-renders)
  const positions = useMemo(() => {
    const frac = (n: number) => n - Math.floor(n);
    const rand = (n: number) => frac(Math.sin(n * 127.1) * 43758.5453);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand(i) - 0.5) * 9;
      arr[i * 3 + 1] = (rand(i + 50) - 0.5) * 7;
      arr[i * 3 + 2] = (rand(i + 100) - 0.5) * 4 - 0.5;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#a3e635"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.1, 4.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <pointLight position={[-2.5, -1, 2]} intensity={30} color="#a3e635" />
      <pointLight position={[2.5, 2, -2]} intensity={15} color="#71717a" />
      <Shirt />
      <Rings />
      <Particles />
    </Canvas>
  );
}
