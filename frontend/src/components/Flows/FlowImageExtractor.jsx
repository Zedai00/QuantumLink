// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// export default function FlowImageExtractor({ input, output }) {
//   if (!input || !output) {
//     return <div className="text-white">⚠️ No pixels to render</div>;
//   }

//   // Scale output values [0-3] → [0-255]
//   const pixelColors = output.map(([r, g, b]) => {
//     const scaledR = r * 85;
//     const scaledG = g * 85;
//     const scaledB = b * 85;
//     return `rgb(${scaledR},${scaledG},${scaledB})`;
//   });

//   const [showGrid, setShowGrid] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setShowGrid(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   // Coordinates for extractor center (tweak these numbers until visually aligned)
//   const extractorX = 250;
//   const extractorY = -20;

//   return (
//     <div className="relative flex justify-between items-center p-10 w-full h-screen bg-[#030313] text-white overflow-hidden">
//       {/* Left: Original */}
//       <div className="flex flex-col items-center relative">
//         <h3 className="mb-2">Original</h3>
//         <img src={input} width={150} height={150} />
//       </div>

//       {/* Middle: Pixel Extractor */}
//       <div className="flex items-center justify-center w-40 h-20 border border-cyan-400 bg-[#111827] rounded z-10">
//         Pixel Extractor
//       </div>

// {/* Right: Pixel Grid */}
// <div className="grid grid-cols-50 gap-[2px] max-w-[400px]">
//   {pixelColors.map((color, i) => (
//     <motion.div
//       key={i}
//       className="w-1 h-1"
//       style={{ backgroundColor: color, opacity: showGrid ? 1 : 0 }}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: showGrid ? 1 : 0 }}
//       transition={{ delay: i * 0.01, duration: 0.3 }}
//     />
//   ))}
// </div>

// {/* Flying particles */}
// {pixelColors.slice(0, 50).map((color, i) => {
//   const row = Math.floor(i / 50);
//   const col = i % 50;

//   // Destination in grid
//   const gridX = 500 + col * 10;
//   const gridY = row * 10 - 100;

//   return (
//     <motion.div
//       key={`fly-${i}`}
//       className="absolute w-2 h-2 rounded-sm"
//       style={{ backgroundColor: color }}
//       initial={{ x: 0, y: 0, opacity: 1 }}
//       animate={{
//         x: [0, extractorX, gridX],  // Pass through extractor center
//         y: [0, extractorY, gridY],
//         opacity: [1, 1, 0],
//       }}
//       transition={{
//         delay: i * 0.02,
//         duration: 2,
//         ease: "easeInOut",
//       }}
//     />
//   );
// })}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FlowImageExtractor({ input, output }) {
  if (!input || !output) {
    return <div className="text-white">⚠️ No pixels to render</div>;
  }

  // Scale output values [0–3] → [0–255]
  const pixelColors = output.map(([r, g, b]) => {
    return `rgb(${r * 85}, ${g * 85}, ${b * 85})`;
  });

  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowGrid(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Coordinates for extractor center (tweak these numbers until visually aligned)
  const extractorX = 250;
  const extractorY = -20;

  return (
    <div className="relative flex justify-between items-center p-10 w-full h-screen bg-[#030313] text-white overflow-hidden">
      {/* Left: Original Image moves into extractor */}
      <motion.div
        className="flex flex-col items-center relative"
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: 200, opacity: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <h3 className="mb-2">Original</h3>
        <img src={input} width={150} height={150} />
      </motion.div>

      {/* Middle: Extractor */}
      <div className="flex items-center justify-center w-40 h-20 border border-cyan-400 bg-[#111827] rounded z-10">
        Pixel Extractor
      </div>

      {/* Right: Pixel Grid */}
      <div className="flex flex-wrap gap-[1.5px] max-w-[200px]">
        {pixelColors.map((color, i) => (
          <motion.div
            key={i}
            className="w-1 h-1"
            style={{ backgroundColor: color, opacity: showGrid ? 1 : 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: showGrid ? 1 : 0 }}
            transition={{ delay: i * 0.01, duration: 0.3 }}
          />
        ))}
      </div>

  
    </div>
  );
}
