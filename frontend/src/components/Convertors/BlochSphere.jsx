import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
import AxisArrow from "./AxisArrow";
import DynamicArrow from "./DynamicArrow";
import TransparentSphere from "./TransparentSphere";
import * as THREE from "three";

export default function BlochSphere({ gateKey, selectedGate, isBob, aliceDirRef, quantumMode, bellState }) {
  const RADIUS = 4;
  const LABEL_OFFSET = RADIUS + 0.5; // Place labels slightly outside the sphere

  return (
    <div className="size-60 rounded-full overflow-hidden shadow-lg border z-0">
      <Canvas
        style={{
          borderRadius: "50%",
          width: "100%",
          height: "100%",
          display: "block",
          margin: 0,
          padding: 0,
        }}
        gl={{ alpha: true }}
        camera={{
          position: [5.5, 5.5, 5.5],
          fov: 60,
        }}
      >
        {/* Lights */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} />

        {/* Axis Arrows (length = sphere radius) */}
        <AxisArrow dir={new THREE.Vector3(1, 0, 0)} color={0xff0000} length={RADIUS} /> {/* +X */}
        <AxisArrow dir={new THREE.Vector3(-1, 0, 0)} color={0xffaaaa} length={RADIUS} /> {/* -X */}
        <AxisArrow dir={new THREE.Vector3(0, 1, 0)} color={0x00ff00} length={RADIUS} /> {/* +Y */}
        <AxisArrow dir={new THREE.Vector3(0, -1, 0)} color={0xaaffaa} length={RADIUS} /> {/* -Y */}
        <AxisArrow dir={new THREE.Vector3(0, 0, 1)} color={0x0000ff} length={RADIUS} /> {/* +Z */}
        <AxisArrow dir={new THREE.Vector3(0, 0, -1)} color={0xaaaaff} length={RADIUS} /> {/* -Z */}

        {/* Axis Labels */}
        {/* +X */}
        <Billboard>
          <Text position={[LABEL_OFFSET, 0, 0]} fontSize={0.6} color="red" anchorX="center" anchorY="middle">
            +X
          </Text>
        </Billboard>

        {/* -X */}
        <Billboard>
          <Text position={[-LABEL_OFFSET, 0, 0]} fontSize={0.55} color="#ff8888" anchorX="center" anchorY="middle">
            -X
          </Text>
        </Billboard>

        {/* +Y */}
        <Billboard>
          <Text position={[0, LABEL_OFFSET, 0]} fontSize={0.6} color="green" anchorX="center" anchorY="middle">
            +Y
          </Text>
        </Billboard>

        {/* -Y */}
        <Billboard>
          <Text position={[0, -LABEL_OFFSET, 0]} fontSize={0.55} color="#88ff88" anchorX="center" anchorY="middle">
            -Y
          </Text>
        </Billboard>

        {/* +Z */}
        <Billboard>
          <Text position={[0, 0, LABEL_OFFSET]} fontSize={0.65} color="blue" anchorX="center" anchorY="middle">
            +Z
          </Text>
        </Billboard>

        {/* -Z */}
        <Billboard>
          <Text position={[0, 0, -LABEL_OFFSET]} fontSize={0.6} color="#8888ff" anchorX="center" anchorY="middle">
            -Z
          </Text>
        </Billboard>

        {/* Dynamic Arrow */}
        <DynamicArrow
          gateKey={gateKey}
          selectedGate={selectedGate}
          isBob={isBob}
          aliceDirRef={aliceDirRef}
          quantumMode={quantumMode}
          bellState={bellState}
        />

        {/* Transparent Sphere */}
        <TransparentSphere radius={RADIUS} />

        {/* Controls */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

