import React from "react";
import * as THREE from "three";

export default function TransparentSphere({ radius = 5 }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={0x00ffff} transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

