import React from "react";

export default function EntanglementToggle({ quantumMode, setQuantumMode }) {
  return (
    <button
      onClick={() => setQuantumMode(!quantumMode)}
      className="ml-6 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
    >
      {quantumMode ? "Quantum Mode: ON" : "Visual Mode: ON"}
    </button>
  );
}

