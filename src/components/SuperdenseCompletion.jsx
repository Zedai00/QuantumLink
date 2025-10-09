import React, { useEffect, useRef } from "react";
import { animate, utils } from "animejs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function SuperdenseCompletion({ encodedMessage, decodedMessage, onRestart, stagesData }) {
  const containerRef = useRef(null);

  // Extract last stage with fidelity info
  const lastStage = stagesData.slice().reverse().find((s) => s.fidelity !== undefined) || {};
  const gates = lastStage.output || [];
  const fidelity = lastStage.fidelity || 0;
  const errorRate = lastStage.errorRate || 0;

  // Prepare chart data
  // Prepare chart data
  const chartData = [
    { name: "I", count: gates.filter((g) => g === "I").length, display: gates.filter((g) => g === "I").length, color: "#00FFFF" },
    { name: "X", count: gates.filter((g) => g === "X").length, display: gates.filter((g) => g === "X").length, color: "#FF49DB" },
    { name: "Z", count: gates.filter((g) => g === "Z").length, display: gates.filter((g) => g === "Z").length, color: "#9B5DE5" },
    { name: "XZ", count: gates.filter((g) => g === "XZ").length, display: gates.filter((g) => g === "XZ").length, color: "#00FFFF" },
    { name: "Fidelity", count: fidelity * 100, display: `${(fidelity * 100).toFixed(1)}%`, color: "#0ff" },
    { name: "Error Rate", count: errorRate * 100, display: `${(errorRate * 100).toFixed(1)}%`, color: "#F87171" },
  ];

  useEffect(() => {
    const container = containerRef.current;

    // Fade-in & scale animation
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
      className="relative h-screen w-screen flex flex-col justify-center items-center bg-[#030313] overflow-hidden opacity-0 p-4"
    >
      {/* Title */}
      <h1 className="text-5xl font-bold text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)] tracking-wide mb-4 text-center">
        Superdense Coding Success! ⚡
      </h1>

      {/* Decoded & Encoded Messages */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8 text-center">
        <p className="text-2xl text-gray-200">
          Encoded: <span className="text-cyan-400 font-semibold">{encodedMessage}</span>
        </p>
        <p className="text-2xl text-gray-200">
          Decoded: <span className="text-purple-400 font-semibold">{decodedMessage}</span>
        </p>
      </div>

      {/* Quantum Summary Chart */}
      <div className="w-full max-w-4xl h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#00FFFF" />
            <YAxis stroke="#00FFFF" />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #00FFFF", color: "#fff" }}
            />
            <Bar dataKey="count">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="display" position="top" fill="#fff" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

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
              backgroundColor: i % 2 === 0 ? "rgba(34, 211, 238, 0.9)" : "rgba(236, 72, 153, 0.9)",
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

