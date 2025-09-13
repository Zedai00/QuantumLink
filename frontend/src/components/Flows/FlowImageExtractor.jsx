import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import { Context } from "../Context/Context";


export default function FlowImageExtractor({ input, output }) {
  const { onComplete } = useContext(Context);
  const rootRef = useRef(null);
  const originalRef = useRef(null);
  const extractorRef = useRef(null);
  const gridRef = useRef(null);

  // layout & animation control
  const [startPoint, setStartPoint] = useState(null); // {x,y} relative to container
  const [targets, setTargets] = useState([]); // array of {x,y} relative to container
  const [cellSize, setCellSize] = useState(6); // in px (will compute)
  const [gridCols, setGridCols] = useState(32);
  const [gridVisible, setGridVisible] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);

  // normalize output to array of [r,g,b]
  const pixelsArr = (() => {
    if (!output) return [];
    if (typeof output[0] === "number") {
      // flat Uint8ClampedArray or number array RGBA
      const arr = [];
      for (let i = 0; i < output.length; i += 4) {
        arr.push([output[i], output[i + 1], output[i + 2]]);
      }
      return arr;
    }
    // assume already [[r,g,b], ...]
    return output;
  })();

  // pixel colors (scale if tiny values like 0..3)
  const pixelColors = pixelsArr.map(([r, g, b]) => {
    // If values seem 0..3, scale to 0..255
    return `rgb(${r * 85}, ${g * 85}, ${b * 85})`;
  
    // return `rgb(${r}, ${g}, ${b})`;
  });

  // Only animate first N pixels for performance (you can tweak)
  const animateCount = Math.min( 2000, pixelColors.length);
  const animatedPixelIndices = Array.from({ length: animateCount }, (_, i) => i);

  // durations / timings
  const originalMoveDuration = 1.6; // seconds the original slides into extractor
  const flightDuration = 0.7; // seconds each pixel flies
  const stagger = 0.01; // seconds between pixel launches
  const finalBuffer = 0.4; // seconds after last pixel before stage complete

  // compute layout (positions) in one place — call on mount and on resize
  const computeLayout = useCallback(() => {
    const root = rootRef.current;
    const extractor = extractorRef.current;
    const original = originalRef.current;
    const grid = gridRef.current;
    if (!root || !extractor || !original || !grid) return;

    const rootRect = root.getBoundingClientRect();
    const extrRect = extractor.getBoundingClientRect();
    const origRect = original.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();

    // extractor center relative to container top-left
    const startX = extrRect.left + extrRect.width / 2 - rootRect.left;
    const startY = extrRect.top + extrRect.height / 2 - rootRect.top;

    // compute grid columns — try to keep as near-square as possible
    const totalPixels = pixelColors.length || 1;
    let cols = Math.round(Math.sqrt(totalPixels));
    if (cols < 1) cols = 1;

    // cell size fits within gridRect width (leave small padding)
    const maxGridWidth = Math.max(64, Math.min(gridRect.width, rootRect.width * 0.28)); // cap
    const computedCell = Math.max(2, Math.floor(maxGridWidth / cols));

    // compute target coordinates for first animateCount pixels
    const t = [];
    for (let i = 0; i < animateCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      // target top-left for that cell relative to root
      const targetX = gridRect.left - rootRect.left + col * computedCell;
      const targetY = gridRect.top - rootRect.top + row * computedCell;
      t.push({ x: targetX, y: targetY });
    }

    // also compute how much original must translate to center on extractor
    const origCenterX = origRect.left + origRect.width / 2 - rootRect.left;
    const origCenterY = origRect.top + origRect.height / 2 - rootRect.top;
    const origDeltaX = startX - origCenterX;
    const origDeltaY = startY - origCenterY;

    setCellSize(computedCell);
    setGridCols(cols);
    setStartPoint({ x: startX, y: startY, origDeltaX, origDeltaY });
    setTargets(t);
    setLayoutReady(true);
  }, [animateCount, pixelColors.length]);

  // measure layout initially and on resize
  useEffect(() => {
    // compute on next paint to ensure DOM measured
    const id = requestAnimationFrame(() => computeLayout());
    const onResize = () => computeLayout();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [computeLayout]);

  // orchestrate animation and completion
  useEffect(() => {
    if (!layoutReady || !startPoint || targets.length === 0) return;

    // reveal static grid only after last pixel arrives
    const totalTime =
      originalMoveDuration + animateCount * stagger + flightDuration + finalBuffer; // seconds
    const revealTimer = setTimeout(() => setGridVisible(true), (originalMoveDuration + animateCount * stagger + flightDuration) * 1000);

    // call onComplete after everything
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, totalTime * 1000 + 50);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
  }, [layoutReady, startPoint, targets, animateCount, onComplete]);

  if (!input || !output || pixelColors.length === 0) {
    return <div className="text-white">⚠️ No pixels to render</div>;
  }

  return (
    <div
      ref={rootRef}
      className="relative w-full h-screen bg-[#030313] text-white overflow-hidden"
    >
      <div className="absolute left-8 top-12 flex flex-col items-center">
        {/* Original image — we will animate this into the extractor using computed delta */}
        <motion.div
          ref={originalRef}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={
            startPoint
              ? {
                  x: startPoint.origDeltaX,
                  y: startPoint.origDeltaY,
                  opacity: 0,
                }
              : {}
          }
          transition={{ duration: originalMoveDuration, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <h3 className="mb-2 text-sm">Original</h3>
          <img src={input} width={150} height={150} alt="original" draggable={false} />
        </motion.div>
      </div>

      {/* Extractor box (center column) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/3">
        <div
          ref={extractorRef}
          className="w-40 h-40 flex items-center justify-center border border-cyan-400 rounded bg-[#111827] text-cyan-300 font-bold"
        >
          Pixel Extractor
        </div>
      </div>

      {/* Right static grid container — we place it near right side */}
      <div
        ref={gridRef}
        className="absolute right-10 top-28"
        style={{
          // actual CSS grid to display final pixels (hidden until reveal)
          width: `${gridCols * cellSize}px`,
          height: `${Math.ceil(pixelColors.length / gridCols) * cellSize}px`,
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, ${cellSize}px)`,
          gap: 1,
          background: "transparent",
        }}
      >
        
      </div>

      {/* Animated pixel layer: absolute positioned elements that fly from extractor -> targets */}
      {/* We render only first `animateCount` pixels to keep performance sane. */}
      <div className="absolute left-0 top-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
        {startPoint &&
          targets.map((t, i) => {
            const color = pixelColors[i];
            // initial: startPoint (extractor center); target: t (grid cell)
            return (
              <motion.div
                key={`fly-${i}`}
                initial={{ x: startPoint.x, y: startPoint.y, opacity: 1, scale: 0.9 }}
                animate={{
                  x: t.x,
                  y: t.y,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: originalMoveDuration + i * stagger,
                  duration: flightDuration,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: color,
                  borderRadius: 1,
                }}
              />
            );
          })}
      </div>
    </div>
  );
}
