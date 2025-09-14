import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import { Context } from "../Context/Context";

export default function FlowRGBValues({ input }) {

  const { onComplete } = useContext(Context);

  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const converterRef = useRef(null);

  const [layoutReady, setLayoutReady] = useState(false);
  const [positions, setPositions] = useState([]);
  const [cellSize, setCellSize] = useState(4);
  const [gridCols, setGridCols] = useState(32);
  const [done, setDone] = useState(false);

  const converterAnim = useAnimation();

  // normalize pixels into RGB
  const pixelsArr = (() => {
    if (!input) return [];
    if (typeof input[0] === "number") {
      const arr = [];
      for (let i = 0; i < input.length; i += 4) {
        arr.push([input[i], input[i + 1], input[i + 2]]);
      }
      return arr;
    }
    return input;
  })();

  // map to RGB colors
   const pixelColors = pixelsArr.map(([r, g, b]) => {
    return `rgb(${r * 85}, ${g * 85}, ${b * 85})`;
  
  });
  // const pixelColors = pixelsArr.map(([r, g, b]) => {
  //   const R = r * 85;
  //   const G = g * 85;
  //   const B = b * 85;
  //   return {
  //     color: `rgb(${R}, ${G}, ${B})`,
  //     rgb: `rgb(${R}, ${G}, ${B})`,
  //   };
  // });


  const animateCount = Math.min(2000, pixelColors.length);

  // measure layout
  const computeLayout = useCallback(() => {
    const root = rootRef.current;
    const grid = gridRef.current;
    const conv = converterRef.current;
    if (!root || !grid || !conv) return;

    const rootRect = root.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    const convRect = conv.getBoundingClientRect();

    const totalPixels = pixelColors.length || 1;
    let cols = Math.round(Math.sqrt(totalPixels));
    if (cols < 1) cols = 1;

    const maxGridWidth = Math.max(
      64,
      Math.min(gridRect.width, rootRect.width * 0.28)
    );
    const computedCell = Math.max(2, Math.floor(maxGridWidth / cols));

    const initialPosition = [];
    for (let i = 0; i < animateCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const startX = gridRect.left - rootRect.left + col * computedCell;
      const startY = gridRect.top - rootRect.top + row * computedCell;

      const midX = convRect.left - rootRect.left + convRect.width / 2;
      const midY = convRect.top - rootRect.top + convRect.height / 2;

      initialPosition.push({
        start: { x: startX, y: startY },
        mid: { x: midX, y: midY },
        color: pixelColors[i],
        index: i,
      });
    }

    setPositions(initialPosition);
    setGridCols(cols);
    setCellSize(computedCell);
    setLayoutReady(true);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => computeLayout());
    window.addEventListener("resize", computeLayout);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", computeLayout);
    };
  }, [computeLayout]);

  // trigger glow for each pixel as it passes converter
  useEffect(() => {
    if (!layoutReady) return;
    positions.forEach((p, i) => {
      setTimeout(() => {
        converterAnim.start({
          boxShadow: "0 0 20px #7f00ff, 0 0 40px #00ffff",
          backgroundColor: "#1f1f40",
        });
        setTimeout(() => {
          converterAnim.start({
            boxShadow: "0 0 0px transparent",
            backgroundColor: "#111827",
          });
        }, 300);
      }, i * 500 + 200);
    });

    // schedule completion after last RGB output finishes
    const totalTime = positions.length * 500 + 4000;
    const timer = setTimeout(() => {
      setDone(true);
      if (onComplete) onComplete();
    }, totalTime);

    return () => clearTimeout(timer);
  }, [layoutReady, positions, converterAnim, onComplete]);

  if (!input || pixelColors.length === 0) {
    return <div className="text-white">⚠️ No pixels to render</div>;
  }

 

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 800;

  return (
    <div
      ref={rootRef}
      className="relative w-full h-screen bg-[#030313] text-white overflow-hidden"
    >
      {/* Left: Pixel grid scaffold */}
      <div
        ref={gridRef}
        className="absolute left-10 top-1/2 -translate-y-1/2"
        style={{
          width: `${gridCols * cellSize}px`,
          height: `${Math.ceil(pixelColors.length / gridCols) * cellSize}px`,
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, ${cellSize}px)`,
          gap: 1,
        }}
      >
        {positions.map((_, i) => (
          <div
            key={`grid-${i}`}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: "transparent", // no overlap
              borderRadius: 1,
            }}
          />
        ))}
      </div>

      {/* Center: Converter */}
      <motion.div
        ref={converterRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-40 h-20 flex items-center justify-center border border-cyan-400 bg-[#111827] rounded-lg"
        animate={converterAnim}
      >
        Pixel → RGB
      </motion.div>

      {/* Flying pixels */}
      {layoutReady &&
        positions.map((p, i) => (
          <motion.div
            key={`fly-${i}`}
            className="absolute rounded-sm"
            style={{
              backgroundColor: p.color,
              width: cellSize,
              height: cellSize,
            }}
            initial={{ x: p.start.x, y: p.start.y, opacity: 1 }}
            animate={{
              x: [p.start.x, p.mid.x],
              y: [p.start.y, p.mid.y],
              opacity: 1,
            }}
            transition={{
              delay: i * 0.3,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* RGB values flying to the right and disappearing */}
      {layoutReady &&
        positions.map((p, i) => (
          <motion.div
            key={`rgb-${i}`}
            className="absolute flex items-center gap-1 text-xs"
            initial={{ x: p.mid.x, y: p.mid.y, opacity: 0, scale: 0.9 }}
            animate={{
              x: screenWidth - 80,
              y: p.mid.y + i * 6, // vertical offset to avoid overlap
              opacity: [0, 1, 1, 0],
              scale: [0.9, 1.05, 1], // slight pop/flicker
            }}
            transition={{
              delay: i * 0.6 + 1.5, // slower stagger
              duration: 5, // slow travel across screen
              ease: "easeInOut",
            }}
          >
            <div
              className="w-3 h-3 rounded-sm border border-gray-600"
              style={{ backgroundColor: p.color }}
            />
            <span
              className="font-bold text-lg whitespace-nowrap"
              style={{
                color: p.color,
                textShadow: `
            0 0 5px ${p.color},
            0 0 10px ${p.color},
            0 0 20px ${p.color},
            0 0 40px cyan,
            0 0 80px purple
          `,
              }}
            >
              {p.color}
            </span>
          </motion.div>
        ))}
    </div>
  );
}
