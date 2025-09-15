import React, { useRef, useState, useEffect, useContext } from "react";
import { createTimeline, createScope, svg, utils } from "animejs";
import BlochSphere from "./BlochSphere/BlochSphere";
import { Context } from "../Context/Context";
import * as THREE from "three";
import SineWave from "./BlochSphere/SineWave";
import Circuit from "./Circuit";

export default function BlochPage() {
  const { stage, stagesData, onComplete, speed, animate } = useContext(Context);

  const input = stagesData[stage].input
  const output = stagesData[stage].output

      console.log("BlockVisual: ", output)


  const [selectedGate, setSelectedGate] = useState("RANDOM");
  const [gateKey, setGateKey] = useState(0);

  const aliceDirRef = useRef(new THREE.Vector3(0, 0, 1));
  const root = useRef(null);
  const scope = useRef(null);
  const tlRef = useRef(null)
  const hasCompleted = useRef(null);

  useEffect(() => {
    hasCompleted.current = false;
    const container = document.querySelector("#anime-container")

    scope.current = createScope({ root }).add(() => {
      const { translateX: ltcX, translateY: ltcY, rotate: ltcRotate } = svg.createMotionPath("#ltc");
      const { translateX: ctrX, translateY: ctrY, rotate: ctrRotate } = svg.createMotionPath("#ctr");
      const tl = createTimeline({ defaults: { duration: 5000 } });
      tlRef.current = tl

      input.forEach((letter, i) => {
        // Input letter animation
        const el = document.createElement("div");
        el.textContent = letter;
        el.className = `letter-box opacity-0 absolute min-w-16 min-h-16 p-5 flex justify-center items-center
          text-2xl font-extrabold text-cyan-300 
          bg-gradient-to-br from-[#1e1e2f] via-[#111827] to-[#000] 
          rounded-xl backdrop-blur-lg border border-cyan-400/50
          shadow-[0_0_25px_rgba(0,255,255,0.8)] animate-pulse-glow neon-particle`;
        container.prepend(el);

        tl.add(
          el,
          {
            keyframes: { "1%": { opacity: 1 } },
            duration: 1000,
            translateX: ltcX,
            translateY: ltcY,
            rotate: ltcRotate,
            opacity: 1,
            onComplete: () => {
              setSelectedGate(letter); // update BlochSphere dynamically
              setGateKey(prev => prev + 1);
              el.remove();
            }
          },
          `-=${i === 0 ? 0 : 1000}`
        );

        // Output letter animation
        const elm = document.createElement("div");
        elm.textContent = output[i];
        elm.className = `letter-box absolute opacity-0 p-5 left-160 top-42 min-w-16 min-h-16 z-40 flex justify-center items-center
          text-xl font-extrabold text-pink-400 
          bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2e] to-[#000] 
          rounded-xl backdrop-blur-lg border border-pink-400/50
          shadow-[0_0_25px_rgba(255,0,255,0.8)] animate-pulse-glow neon-particle`;
        container.appendChild(elm);

        tl.add(
          elm,
          {
            keyframes: { "1%": { opacity: 1 } },
            translateX: ctrX,
            translateY: ctrY,
            rotate: ctrRotate,
            duration: 3000,
            ease: "outQuad",
            onComplete: () => {
              if (i === output.length - 1 && !hasCompleted.current) {
                hasCompleted.current = true;
                onComplete(input, output);
              }
              elm.remove();
            }
          }
        );
      });
    });

    return () => {
      scope.current.revert();
      document.querySelectorAll(".letter-container, .letter-box").forEach(el => el.remove());
    };
  }, [onComplete]);

  useEffect(() => {
    if (tlRef.current) utils.sync(() => (tlRef.current.speed = speed));
  }, [speed]);


  useEffect(() => {
    if (tlRef) {
      animate ? utils.sync(() => tlRef.current.play()) : utils.sync(() => tlRef.current.pause())
    }
  }, [animate])
  return (
    <div ref={root} className="relative bg-[#030313] h-full w-full overflow-hidden">
      {/* Motion paths */}
      <svg width="500" height="600" viewBox="0 0 500 600"><path id="ltc" d="M 0 265 l 350 0" fill="none" stroke="none" /></svg>
      <svg width="800" height="600" viewBox="0 0 800 600" className="absolute bottom-0"><path id="ctr" d="M 195 90 l 600 0" fill="none" stroke="none" /></svg>

      <div
        id="anime-container"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Canvas appears instantly with initial gate */}
      <div className="absolute bg-transparent rounded-full top-45 left-66 flex justify-center items-center z-50">
        <BlochSphere gateKey={gateKey} selectedGate={selectedGate} isBob={false} aliceDirRef={aliceDirRef} />
        <SineWave width={300} height={120} amplitude={25} frequency={0.05} speed={3} hideStart={0} />
        <BlochSphere gateKey={gateKey} selectedGate={selectedGate} isBob={true} aliceDirRef={aliceDirRef} />
      </div>

    </div>
  );
}

