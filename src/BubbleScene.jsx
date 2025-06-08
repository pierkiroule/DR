import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Bubble({ position, color, scaleSpeed }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scale = 1 + 0.1 * Math.sin(t * scaleSpeed);
    ref.current.scale.set(scale, scale, scale);
    ref.current.position.y += 0.001 * Math.sin(t + position[0]);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.2} />
    </mesh>
  );
}

function Lines({ bubbles }) {
  const lines = [];

  for (let i = 0; i < bubbles.length; i++) {
    for (let j = i + 1; j < bubbles.length; j++) {
      const dist = new THREE.Vector3(...bubbles[i].position).distanceTo(
        new THREE.Vector3(...bubbles[j].position)
      );
      if (dist < 5) {
        const points = [
          new THREE.Vector3(...bubbles[i].position),
          new THREE.Vector3(...bubbles[j].position),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        lines.push(
          <line key={`${i}-${j}`} geometry={geometry}>
            <lineBasicMaterial color="#99ccff" linewidth={2} />
          </line>
        );
      }
    }
  }

  return <>{lines}</>;
}

export default function BubbleScene() {
  const bubbles = useMemo(() =>
    Array.from({ length: 30 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 8,
      ],
      color: pastel(),
      scaleSpeed: 1 + Math.random(),
    })), []
  );

  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      {bubbles.map((b, i) => (
        <Bubble key={i} {...b} />
      ))}
      <Lines bubbles={bubbles} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate />
    </Canvas>
  );
}

function pastel() {
  const colors = ["#a5d8ff", "#b2f2bb", "#d0ebff", "#c5f6fa", "#d3f9d8"];
  return colors[Math.floor(Math.random() * colors.length)];
}