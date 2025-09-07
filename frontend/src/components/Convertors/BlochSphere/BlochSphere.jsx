import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
import AxisArrow from "./AxisArrow";
import DynamicArrow from "./DynamicArrow";
import TransparentSphere from "./TransparentSphere";
import * as THREE from "three";

export default function BlochSphere({
  gateKey,
  selectedGate,
  isBob,
  aliceDirRef,
}) {
  const RADIUS = 4;
  const LABEL_OFFSET = RADIUS + 0.5; // Distance of labels from the sphere

  // 🎨 Modern colors optimized for a dark background
  const COLORS = {
    posX: "#ff4b4b",  // Neon Red
    negX: "#ff9999",  // Soft Red
    posY: "#4bff72",  // Neon Green
    negY: "#a4ffb4",  // Soft Green
    posZ: "#4bb7ff",  // Sky Blue
    negZ: "#a4dfff",  // Light Blue
  };

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
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        {/* Axis Arrows */}
        <AxisArrow dir={new THREE.Vector3(1, 0, 0)} color={COLORS.posX} length={RADIUS} />
        <AxisArrow dir={new THREE.Vector3(-1, 0, 0)} color={COLORS.negX} length={RADIUS} />
        <AxisArrow dir={new THREE.Vector3(0, 1, 0)} color={COLORS.posY} length={RADIUS} />
        <AxisArrow dir={new THREE.Vector3(0, -1, 0)} color={COLORS.negY} length={RADIUS} />
        <AxisArrow dir={new THREE.Vector3(0, 0, 1)} color={COLORS.posZ} length={RADIUS} />
        <AxisArrow dir={new THREE.Vector3(0, 0, -1)} color={COLORS.negZ} length={RADIUS} />

        {/* Axis Labels */}
        <Billboard>
          <Text position={[LABEL_OFFSET, 0, 0]} fontSize={0.6} color={COLORS.posX} anchorX="center" anchorY="middle">
            +X
          </Text>
        </Billboard>
        <Billboard>
          <Text position={[-LABEL_OFFSET, 0, 0]} fontSize={0.55} color={COLORS.negX} anchorX="center" anchorY="middle">
            -X
          </Text>
        </Billboard>
        <Billboard>
          <Text position={[0, LABEL_OFFSET, 0]} fontSize={0.6} color={COLORS.posY} anchorX="center" anchorY="middle">
            +Y
          </Text>
        </Billboard>
        <Billboard>
          <Text position={[0, -LABEL_OFFSET, 0]} fontSize={0.55} color={COLORS.negY} anchorX="center" anchorY="middle">
            -Y
          </Text>
        </Billboard>
        <Billboard>
          <Text position={[0, 0, LABEL_OFFSET]} fontSize={0.65} color={COLORS.posZ} anchorX="center" anchorY="middle">
            +Z
          </Text>
        </Billboard>
        <Billboard>
          <Text position={[0, 0, -LABEL_OFFSET]} fontSize={0.6} color={COLORS.negZ} anchorX="center" anchorY="middle">
            -Z
          </Text>
        </Billboard>

        {/* Dynamic Arrow */}
        <DynamicArrow
          gateKey={gateKey}
          selectedGate={selectedGate}
          isBob={isBob}
          aliceDirRef={aliceDirRef}
        />

        {/* Transparent Sphere */}
        <TransparentSphere radius={RADIUS} />

        {/* Controls */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

