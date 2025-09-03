import React, { useRef, useEffect, useState, useContext } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { createTimeline, createScope, svg } from "animejs";
import * as THREE from "three";
import { Context } from "../Context";

/** Axis Arrows (X=Red, Y=Green, Z=Blue) */
function AxisArrow({ dir, color, length = 5 }) {
  const origin = new THREE.Vector3(0, 0, 0);
  dir.normalize();
  return <primitive object={new THREE.ArrowHelper(dir, origin, length, color)} />;
}

/** Dynamic Arrow — Handles Alice & Bob */
function DynamicArrow({ selectedGate, isBob, aliceDirRef, quantumMode, bellState }) {
  const arrowRef = useRef();
  const currentDir = useRef(new THREE.Vector3(0, 0, 1));
  const targetDir = useRef(new THREE.Vector3(0, 0, 1));
  const randomStopped = useRef(false);

  // Correct qubit rotations based on gates
  useEffect(() => {
    if (isBob || selectedGate === "RANDOM") return;

    randomStopped.current = true;

    const quaternion = new THREE.Quaternion();
    const dir = currentDir.current.clone().normalize();
    const epsilon = 0.01; // Small tolerance for "almost vertical"

    // Check if we're nearly on the Z-axis
    const isVertical = Math.abs(Math.abs(dir.z) - 1) < epsilon;

    if (selectedGate === "X") {
      // Always flip 180° around X-axis → flips up/down or left/right
      quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
      targetDir.current.copy(dir.applyQuaternion(quaternion));
    }
    else if (selectedGate === "Z") {
      if (isVertical) {
        // If vertical → rotate 90° towards XY plane around X-axis for visualization
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
      } else {
        // If already horizontal → rotate 180° around Z-axis (real Z gate)
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
      }
      targetDir.current.copy(dir.applyQuaternion(quaternion));
    }
    else if (selectedGate === "XZ") {
      // XZ behaves like Y-gate → 180° around Y-axis
      quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
      targetDir.current.copy(dir.applyQuaternion(quaternion));
    }
  }, [selectedGate, isBob]);

  // Random wandering mode
  useEffect(() => {
    if (selectedGate !== "RANDOM" || isBob) return;

    const axes = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, -1),
    ];

    const interval = setInterval(() => {
      if (randomStopped.current) return;
      const randomAxis = axes[Math.floor(Math.random() * axes.length)];
      targetDir.current.copy(randomAxis);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedGate, isBob]);

  // Smoothly animate direction per frame
  useFrame(() => {
    if (isBob) {
      if (!quantumMode) {
        targetDir.current.copy(aliceDirRef.current);
      } else {
        const aliceVec = aliceDirRef.current.clone();
        if (bellState === "Ψ⁺" || bellState === "Ψ⁻") aliceVec.multiplyScalar(-1);
        targetDir.current.copy(aliceVec);
      }
    }

    const qCurrent = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      currentDir.current.clone().normalize()
    );
    const qTarget = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      targetDir.current.clone().normalize()
    );

    // Smooth slerp transition
    qCurrent.slerp(qTarget, isBob ? 0.2 : 0.1);

    const newDir = new THREE.Vector3(0, 0, 1).applyQuaternion(qCurrent);
    currentDir.current.copy(newDir);

    // Update arrow
    if (arrowRef.current) {
      arrowRef.current.setDirection(currentDir.current);
    }

    // Update Alice's direction for Bob
    if (!isBob) aliceDirRef.current.copy(currentDir.current);
  });

  return (
    <primitive
      ref={arrowRef}
      object={
        new THREE.ArrowHelper(
          currentDir.current,
          new THREE.Vector3(0, 0, 0),
          5,
          isBob ? 0x00ffff : 0xff00ff
        )
      }
    />
  );
}

/** Transparent Bloch Sphere */
function TransparentSphere({ radius = 5 }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={0x00ffff}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Single Bloch Sphere */
/** Single Bloch Sphere */
function BlockSphere({ selectedGate, isBob, aliceDirRef, quantumMode, bellState }) {
  return (
    <div className="size-60  rounded-full overflow-hidden shadow-lg border border-cyan-400/30 z-0">
      <Canvas
        style={{
          borderRadius: "50%", // Make it look circular
          width: "100%",
          height: "100%",
          display: "block",
          margin: 0,
          padding: 0,
        }}
        gl={{ alpha: true }}
        camera={{ position: [5.5, 5.5, 5.5], fov: 60, up: [0, 0, 1] }} // Zoom closer
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} />

        {/* XYZ Axis Arrows */}
        <AxisArrow dir={new THREE.Vector3(1, 0, 0)} color={0xff0000} />
        <AxisArrow dir={new THREE.Vector3(0, 1, 0)} color={0x00ff00} />
        <AxisArrow dir={new THREE.Vector3(0, 0, 1)} color={0x0000ff} />

        {/* Dynamic Arrow */}
        <DynamicArrow
          selectedGate={selectedGate}
          isBob={isBob}
          aliceDirRef={aliceDirRef}
          quantumMode={quantumMode}
          bellState={bellState}
        />

        {/* Bloch Sphere */}
        <TransparentSphere radius={5} />

        {/* Orbit Controls */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

/** Entanglement Mode Toggle */
function EntanglementToggle({ quantumMode, setQuantumMode }) {
  return (
    <button
      onClick={() => setQuantumMode(!quantumMode)}
      className="ml-6 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
    >
      {quantumMode ? "Quantum Mode: ON" : "Visual Mode: ON"}
    </button>
  );
}

const input = ["X", "Z"];
const output = ["X", "Z"];

/** Main Page */
export default function Page() {
  const [selectedGate, setSelectedGate] = useState("RANDOM");
  const [quantumMode, setQuantumMode] = useState(false);
  const [bellState, setBellState] = useState("Φ⁺");
  const aliceDirRef = useRef(new THREE.Vector3(0, 0, 1));
  const root = useRef(null);
  const scope = useRef(null);
  const hasCompleted = useRef(null);
  const { onComplete } = useContext(Context);

  // Dummy input/output for flow demo

  useEffect(() => {
    hasCompleted.current = false;

    scope.current = createScope({ root }).add(() => {
      const { translateX: ltcX, translateY: ltcY, rotate: ltcRotate } =
        svg.createMotionPath("#ltc");
      const { translateX: ctrX, translateY: ctrY, rotate: ctrRotate } =
        svg.createMotionPath("#ctr");
      const tl = createTimeline({ defaults: { duration: 3000 } });

      input.forEach((letter, i) => {
        const el = document.createElement("div");
        el.textContent = letter;
        el.className = `letter-box opacity-0 absolute min-w-16 min-h-16 p-5 flex justify-center items-center
          text-2xl font-extrabold text-cyan-300 
          bg-gradient-to-br from-[#1e1e2f] via-[#111827] to-[#000] 
          rounded-xl backdrop-blur-lg border border-cyan-400/50
          shadow-[0_0_25px_rgba(0,255,255,0.8)] animate-pulse-glow neon-particle`;

        root.current.prepend(el);

        tl.add(
          el,
          {
            keyframes: { "10%": { opacity: 1 } },
            translateX: ltcX,
            translateY: ltcY,
            rotate: ltcRotate,
            opacity: 1,
            onComplete: () => {
              setSelectedGate(letter);
              el.remove();
            },
          },
          "+=200"
        );

        const elm = document.createElement("div");
        elm.textContent = output[i];
        elm.className = `letter-box absolute opacity-0 p-5 left-160 top-42 min-w-16 min-h-16 z-40 flex justify-center items-center
          text-xl font-extrabold text-pink-400 
          bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2e] to-[#000] 
          rounded-xl backdrop-blur-lg border border-pink-400/50
          shadow-[0_0_25px_rgba(255,0,255,0.8)] animate-pulse-glow neon-particle`;

        root.current.appendChild(elm);

        tl.add(
          elm,
          {
            keyframes: { "10%": { opacity: 1 } },
            translateX: ctrX,
            translateY: ctrY,
            rotate: ctrRotate,
            opacity: 1,
            onComplete: () => {
              if (i === output.length - 1 && !hasCompleted.current) {
                hasCompleted.current = true;
                onComplete(input, output);
              }
              elm.remove();
            },
          },
          "+=0"
        );
      });
    });
    return () => {
      scope.current.revert();
      const lc = document.querySelectorAll(".letter-container");
      lc.forEach((l) => l.remove());
      const lb = document.querySelectorAll(".letter-box");
      lb.forEach((l) => l.remove());
    };
  }, [onComplete]);

  return (
    <div ref={root} className="relative bg-[#030313] h-full w-full overflow-hidden">
      {/* Motion paths */}
      <svg width="500" height="600" viewBox="0 0 500 600">
        <path id="ltc" d="M 0 260 l 365 0" fill="none" stroke="none" />
      </svg>
      <svg width="800" height="600" viewBox="0 0 800 600" className="absolute bottom-0">
        <path id="ctr" d="M 0 90 l 800 0" fill="none" stroke="none" />
      </svg>

      {/* Bloch Spheres */}
      <div className="absolute bg-[#030313] rounded-full top-45 left-85 max-w max-h flex gap-60 justify-center items-center  z-50">
        <BlockSphere
          selectedGate={selectedGate}
          isBob={false}
          aliceDirRef={aliceDirRef}
          quantumMode={quantumMode}
          bellState={bellState}
        />
        <BlockSphere
          selectedGate={selectedGate}
          isBob={true}
          aliceDirRef={aliceDirRef}
          quantumMode={quantumMode}
          bellState={bellState}
        />
      </div>

      {/* Controls */}
      <div className="absolute top-4 flex gap-6">
        <EntanglementToggle quantumMode={quantumMode} setQuantumMode={setQuantumMode} />
      </div>
    </div>
  );
}

