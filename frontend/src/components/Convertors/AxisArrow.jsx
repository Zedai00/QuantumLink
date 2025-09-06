import React from "react";
import * as THREE from "three";

export default function AxisArrow({ dir, color, length = 4 }) {
  const origin = new THREE.Vector3(0, 0, 0);
  dir.normalize();
  return <primitive object={new THREE.ArrowHelper(dir, origin, length, color)} />;
}

