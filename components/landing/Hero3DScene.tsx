"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, PresentationControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { RobotAssistant, ActionName } from "./RobotModel";
import { Bot, Sparkles as SparklesIcon } from "lucide-react";

function GyroWrapper({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth cursor parallax damping
      const targetX = state.pointer.x * 0.35;
      const targetY = state.pointer.y * 0.25;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.08);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

function QuantumCore({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.25;
      meshRef.current.rotation.y = t * 0.35;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = -t * 0.2;
      wireframeRef.current.rotation.y = -t * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.3;
    }
  });

  return (
    <group scale={isHovered ? 1.08 : 1}>
      {/* Inner Glowing Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.05, 1]} />
        <MeshDistortMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={1.4}
          roughness={0.15}
          metalness={0.85}
          distort={0.38}
          speed={2.4}
        />
      </mesh>

      {/* Outer Cyber Wireframe Lattice */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#9333ea"
          emissiveIntensity={1.2}
          wireframe={true}
          transparent={true}
          opacity={0.7}
        />
      </mesh>

      {/* Orbital Cyber Ring */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.75, 0.025, 16, 100]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.85} />
        </mesh>
        <mesh position={[1.75, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#a7f3d0" />
        </mesh>
      </group>
    </group>
  );
}

function HolographicPlatform() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group position={[0, -1.35, 0]}>
      {/* Glowing base disk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#064e3b" transparent opacity={0.4} />
      </mesh>
      {/* Rotating outer ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.25, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.65} />
      </mesh>
      {/* Accent inner ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.65, 32]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export default function Hero3DScene() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mode, setMode] = useState<"core" | "robot">("core");
  const [robotAnim, setRobotAnim] = useState<ActionName>("Idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="h-12 w-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span className="font-mono text-xs text-emerald-400 tracking-wider">INITIALIZING 3D WEBGL CORE...</span>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 w-full h-full select-none"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Top 3D Mode Switcher HUD */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-slate-950/80 backdrop-blur-md p-1 shadow-lg">
        <button
          onClick={() => setMode("core")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
            mode === "core"
              ? "bg-emerald-500 text-slate-950 font-bold shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <SparklesIcon className="h-3 w-3" />
          <span>Quantum Core</span>
        </button>
        <button
          onClick={() => setMode("robot")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
            mode === "robot"
              ? "bg-emerald-500 text-slate-950 font-bold shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Bot className="h-3 w-3" />
          <span>AI Bot</span>
        </button>
      </div>

      {/* Interactive Helper Badge */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {mode === "robot"
              ? `Action: ${robotAnim} (Click bot to cycle)`
              : "Cursor Gyro Active · 360° Drag Interactive"}
          </span>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4.3], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} color="#6ee7b7" />
        <pointLight position={[-5, -4, -3]} intensity={2.8} color="#c084fc" />
        <pointLight position={[0, 3, 2]} intensity={2.0} color="#10b981" />

        {/* Presentation Controls: Drag Orbit with Spring Physics */}
        <PresentationControls
          global={false}
          cursor={true}
          snap={true}
          speed={2.2}
          zoom={1}
          polar={[-0.35, 0.35]}
          azimuth={[-0.7, 0.7]}
        >
          <GyroWrapper>
            <Suspense fallback={null}>
              {mode === "robot" ? (
                <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
                  <group position={[0, -0.1, 0]}>
                    <HolographicPlatform />
                    <RobotAssistant
                      animation={robotAnim}
                      onAnimationChange={setRobotAnim}
                      position={[0, -1.35, 0]}
                      scale={0.9}
                    />
                  </group>
                </Float>
              ) : (
                <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
                  <QuantumCore isHovered={hovered} />
                </Float>
              )}
            </Suspense>
          </GyroWrapper>
        </PresentationControls>

        {/* Ambient Glowing Particles */}
        <Sparkles
          count={50}
          scale={4.5}
          size={2.8}
          speed={0.6}
          opacity={0.75}
          color="#34d399"
        />
        <Sparkles
          count={30}
          scale={4}
          size={2.2}
          speed={0.4}
          opacity={0.6}
          color="#c084fc"
        />

        {/* Cinematic Post-Processing Bloom */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            intensity={0.85}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
