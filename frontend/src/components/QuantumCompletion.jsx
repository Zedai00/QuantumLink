import React, { useEffect, useRef } from "react";
import { animate, utils } from "animejs";

export default function SuperdenseCompletion({ decodedMessage, onRestart }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    // Fade-in & scale
    animate(container, {
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 1200,
      easing: "outExpo",
    });

    // Particle burst
    const particles = Array.from(container.querySelectorAll(".particle"));
    particles.forEach((particle, i) => {
      const angle = (i / particles.length) * Math.PI * 2;
      const radius = utils.random(80, 200);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      animate(particle, {
        translateX: [0, x],
        translateY: [0, y],
        scale: [1, utils.random(0.3, 1.3)],
        opacity: [1, 0],
        duration: utils.random(1500, 2500),
        delay: utils.random(0, 500),
        easing: "outCubic",
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen flex flex-col justify-center items-center bg-[#030313] overflow-hidden opacity-0"
    >
      {/* Superdense Completion Title */}
      <h1 className="text-5xl font-bold text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)] tracking-wide mb-4 text-center">
        Superdense Coding Success! ⚡
      </h1>

      {/* Show Decoded Message */}
      <p className="text-2xl text-gray-200 mb-8 text-center">
        Decoded message:{" "}
        <span className="text-purple-400 font-semibold">{decodedMessage}</span>
      </p>

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="px-6 py-3 bg-cyan-500 text-black font-semibold rounded-xl shadow-lg hover:bg-cyan-400 transition-colors duration-300"
      >
        Restart Superdense Experiment
      </button>

      {/* Particle Explosion */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="particle absolute h-2 w-2 rounded-full"
            style={{
              backgroundColor:
                i % 2 === 0
                  ? "rgba(34, 211, 238, 0.9)"
                  : "rgba(236, 72, 153, 0.9)",
              boxShadow:
                i % 2 === 0
                  ? "0 0 10px rgba(34, 211, 238, 0.7)"
                  : "0 0 10px rgba(236, 72, 153, 0.7)",
            }}
          />
        ))}
      </div>

      {/* Persistent Quantum Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-purple-700/10 to-transparent pointer-events-none animate-pulse" />
    </div>
  );
}

