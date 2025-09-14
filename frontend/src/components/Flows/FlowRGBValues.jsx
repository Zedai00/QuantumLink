import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";

export default function FlowRGBValues({ input, output }) {
  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const converterRef = useRef(null);

  const [layoutReady, setLayoutReady] = useState(false);
  const [positions, setPositions] = useState([]);
  const [target, setTarget] = useState([]);
  const [cellSize, setCellSize] = useState(4);
  const [gridCols, setGridCols] = useState(32);

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

  // pixel colors (scale if tiny values like 0..3)
 const pixelColors = pixelsArr.map(([r, g, b]) => {
  const R = r * 85;
  const G = g * 85;
  const B = b * 85;
  return {
    color: `rgb(${R}, ${G}, ${B})`,
    rgb: `rgb(${R}, ${G}, ${B})`,
  };
});


  const [showOutput, setShowOutput] = useState([]);

  useEffect(() => {
    // reveal outputs one by one, in sync with animations
    pixelColors.forEach((_, i) => {
      const timer = setTimeout(() => {
        setShowOutput((prev) => [...prev, i]);
      }, 500 + i * 600); // delay: wait until pixel passes center
      return () => clearTimeout(timer);
    });
  }, []);

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

    // compute grid columns — try to keep as near-square as possible
    const totalPixels = pixelColors.length || 1;
    let cols = Math.round(Math.sqrt(totalPixels));
    if (cols < 1) cols = 1;

    // cell size fits within gridRect width (leave small padding)
    const maxGridWidth = Math.max(
      64,
      Math.min(gridRect.width, rootRect.width * 0.28)
    ); // cap
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
        ...pixelColors[i],
        index: i,
      });
    }

    const newCols = 10;
    const newComputedCell = 1;
    const newPosition = [];
    for (let i = 0; i < animateCount; i++) {
      const row = Math.floor(i / newCols);
      const col = i % newCols;
      const startX = gridRect.left - rootRect.left + col * newComputedCell;
      const startY = gridRect.top - rootRect.top + row * newComputedCell;

      const midX = convRect.left - rootRect.left + convRect.width / 2;
      const midY = convRect.top - rootRect.top + convRect.height / 2;

      newPosition.push({
        start: { x: startX, y: startY },
        mid: { x: midX, y: midY },
        ...pixelColors[i],
        index: i,
      });
    }
    setPositions(initialPosition);
    setTarget(newPosition);
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

  // trigger glow for each pixel
  useEffect(() => {
    if (!layoutReady) return;
    target.forEach((p, i) => {
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
  }, [layoutReady, target, converterAnim]);

  if (!output || pixelColors.length === 0) {
    return <div className="text-white">⚠️ No pixels to render</div>;
  }

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 800;

  return (
    <div
      ref={rootRef}
      className="relative w-full h-screen bg-[#030313] text-white overflow-hidden"
    >
      {/* Left: Pixel grid */}
      <div
        ref={gridRef}
        className="absolute left-10 top-1/2 -translate-y-1/2"
        style={{
          width: `${gridCols * cellSize}px`,
          height: `${Math.ceil(pixelColors.length / gridCols) * cellSize}px`,
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, ${cellSize}px)`,
          gap: 1,
          background: "transparent",
        }}
      >
        {positions.map((t, i) => {
          const color = pixelColors[i];
          return (
            <motion.div
              key={`grid-${i}`}
              className="w-3 h-3"
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: t.color,
                borderRadius: 1,
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{
                delay: i * 0.5, // fade out in sync with animation start
                duration: 0.3,
              }}
            />
          );
        })}
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
        target.map((p, i) => ( 
          <motion.div
            key={`fly-${i}`}
            className="absolute rounded-sm"
            style={{
              backgroundColor: p.color,
              width: cellSize,
              height: cellSize
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
            initial={{ x: p.mid.x, y: p.mid.y, opacity: 0 }}
            animate={{
              x: screenWidth - 50,
              y: p.mid.y,
              opacity: [0, 1, 0],
            }}
            transition={{
              delay: i * 0.3 + 1.5,
              duration: 4,
              ease: "easeInOut",
            }}
          >
            <div
              className="w-3 h-3 rounded-sm border border-gray-600"
              style={{ backgroundColor: p.color }}
            />
            <span className="font-bold text-lg">{p.rgb}</span>
          </motion.div>
        ))}
    </div>
  );
}
