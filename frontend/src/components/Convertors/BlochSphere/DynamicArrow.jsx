import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function DynamicArrow({ selectedGate, gateKey, isBob, aliceDirRef, }) {
  const arrowRef = useRef();
  const currentDir = useRef(new THREE.Vector3(0, 0, 1));
  const targetDir = useRef(new THREE.Vector3(0, 0, 1));

  // Check if vector is roughly aligned with an axis (+ or -)
  const isNearAxis = (vec, axis, epsilon = 0.05) => {
    const nVec = vec.clone().normalize();
    const nAxis = axis.clone().normalize();
    return nVec.distanceTo(nAxis) < epsilon || nVec.distanceTo(nAxis.clone().negate()) < epsilon;
  };

  useEffect(() => {
    if (isBob) return;

    const dir = currentDir.current.clone().normalize();

    if (selectedGate === "X") {
      if (isNearAxis(dir, new THREE.Vector3(1, 0, 0))) targetDir.current.set(-1, 0, 0);
      else if (isNearAxis(dir, new THREE.Vector3(-1, 0, 0))) targetDir.current.set(1, 0, 0);
      else targetDir.current.set(1, 0, 0);
    } else if (selectedGate === "Z") {
      if (isNearAxis(dir, new THREE.Vector3(0, 0, 1))) targetDir.current.set(0, 0, -1);
      else if (isNearAxis(dir, new THREE.Vector3(0, 0, -1))) targetDir.current.set(0, 0, 1);
      else targetDir.current.set(0, 0, 1);
    } else if (selectedGate === "XZ") {
      if (isNearAxis(dir, new THREE.Vector3(1, 0, 0)) || isNearAxis(dir, new THREE.Vector3(-1, 0, 0)))
        targetDir.current.set(0, 0, 1);
      else if (isNearAxis(dir, new THREE.Vector3(0, 0, 1)) || isNearAxis(dir, new THREE.Vector3(0, 0, -1)))
        targetDir.current.set(1, 0, 0);
      else targetDir.current.set(1, 0, 0);
    }
  }, [selectedGate, gateKey, isBob]);

  useFrame(() => {
    if (selectedGate === "RANDOM" && !isBob) {
      const t = Date.now() * 0.001;
      targetDir.current.set(Math.sin(t), Math.cos(t), 1).normalize();
    }
  });

  useFrame(() => {
    if (isBob) {
      const aliceVec = aliceDirRef.current.clone();
      targetDir.current.copy(aliceVec);
    }

    // Smooth quaternion rotation
    const qCurrent = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      currentDir.current.clone().normalize()
    );
    const qTarget = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      targetDir.current.clone().normalize()
    );
    qCurrent.slerp(qTarget, 0.2); // adjust speed here
    currentDir.current.copy(new THREE.Vector3(0, 0, 1).applyQuaternion(qCurrent));

    if (arrowRef.current) arrowRef.current.setDirection(currentDir.current);
    if (!isBob) aliceDirRef.current.copy(currentDir.current);
  });

  return (
    <primitive
      ref={arrowRef}
      object={new THREE.ArrowHelper(
        currentDir.current,
        new THREE.Vector3(0, 0, 0),
        4.5, // arrow length
        isBob ? 0x00ffff : 0xff00ff
      )}
    />
  );
}

