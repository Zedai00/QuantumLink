import React from "react";

export default function DynamicAvatar({ name, size = 40 }) {
  // Pick colors based on sender name
  const isAlice = name.toLowerCase() === "alice";
  const gradient = isAlice
    ? "from-cyan-400 via-blue-500 to-purple-600"
    : "from-pink-400 via-red-500 to-orange-500";

  return (
    <div
      className={`relative rounded-full bg-gradient-to-br ${gradient} 
                 flex items-center justify-center shadow-lg`}
      style={{
        width: size,
        height: size,
        boxShadow: isAlice
          ? "0 0 15px rgba(0, 255, 255, 0.7)"
          : "0 0 15px rgba(255, 0, 150, 0.7)",
      }}
    >
      {/* Initials */}
      <span className="text-white font-bold text-lg">
        {name[0].toUpperCase()}
      </span>

      {/* Glowing animated ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"
        style={{ animationDuration: "2s" }}
      ></div>
    </div>
  );
}

