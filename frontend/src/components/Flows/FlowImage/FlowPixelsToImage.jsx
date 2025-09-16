import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import { Context } from "../../Context/Context";

export default function FlowPixelsToImage({ input, output, width, height }) {
  const { onComplete } = useContext(Context);
  const rootRef = useRef(null);
  const extractorRef = useRef(null);
  const originalRef = useRef(null);
  const gridRef = useRef(null);

  // layout & animation control
  const [startPoints, setStartPoints] = useState([]);
  const [targetPoint, setTargetPoint] = useState(null);
  const [cellSize, setCellSize] = useState(6);
  const [gridCols, setGridCols] = useState(width || 32);
  const [layoutReady, setLayoutReady] = useState(false);

  const pixelColors = input.map(([r, g, b]) => `rgb(${r},${g},${b})`);
  const animateCount = Math.min(2000, pixelColors.length);

  // durations
  const flightDuration = 0.7;
  const stagger = 0.01;
  const extractorDuration = 1.6;
  const finalBuffer = 0.4;
  const gap = 1;

  const computeLayout = useCallback(() => {
    const root = rootRef.current;
    const extractor = extractorRef.current;
    const original = originalRef.current;
    const grid = gridRef.current;
    if (!root || !extractor || !grid) return;

    const rootRect = root.getBoundingClientRect();
    const extrRect = extractor.getBoundingClientRect();
    const origRect = original
      ? original.getBoundingClientRect()
      : { left: 0, top: 0, width: 150, height: 150 };
    const gridRect = grid.getBoundingClientRect();

    // compute grid positions as starting points
    const totalPixels = pixelColors.length || 1;
    let cols = width || Math.round(Math.sqrt(totalPixels));
    let rows = height ? height : Math.ceil(totalPixels / cols);

    const maxGridWidth = Math.max(
      64,
      Math.min(gridRect.width, rootRect.width * 0.28)
    );
    const computedCell = Math.max(2, Math.floor(maxGridWidth / cols));

    const starts = [];
    for (let i = 0; i < animateCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const sx = gridRect.left - rootRect.left + col * (computedCell + gap);
      const sy = gridRect.top - rootRect.top + row * (computedCell + gap);
      starts.push({ x: sx, y: sy });
    }

    // extractor center
    const ex = extrRect.left + extrRect.width / 2 - rootRect.left;
    const ey = extrRect.top + extrRect.height / 2 - rootRect.top;

    // original center (final resting place)
    const ox = origRect.left + origRect.width / 2 - rootRect.left;
    const oy = origRect.top + origRect.height / 2 - rootRect.top;

    setCellSize(computedCell);
    setGridCols(cols);
    setStartPoints(starts);
    setTargetPoint({ ex, ey, ox, oy });
    setLayoutReady(true);
  }, [animateCount, pixelColors.length, width, height]);

  useEffect(() => {
    const id = requestAnimationFrame(() => computeLayout());
    const onResize = () => computeLayout();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [computeLayout]);

  useEffect(() => {
    if (!layoutReady || !targetPoint || startPoints.length === 0) return;
    const totalTime =
      animateCount * stagger + flightDuration + extractorDuration + finalBuffer;
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, totalTime * 1000 + 50);
    return () => clearTimeout(completeTimer);
  }, [layoutReady, targetPoint, startPoints, animateCount, onComplete]);

  if (!input || !output || pixelColors.length === 0) {
    return <div className="text-stone-900">⚠️ No pixels to render</div>;
  }

  return (
    <div
      ref={rootRef}
      className="relative w-full h-screen bg-[#030313] text-white overflow-hidden flex items-center justify-between px-10"
    >
      {/* Grid (source pixels) on LEFT */}
      <div
        ref={gridRef}
        className="relative"
        style={{
          width: `${gridCols * (cellSize + gap)}px`,
          height: `${
            Math.ceil(pixelColors.length / gridCols) * (cellSize + gap)
          }px`,
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, ${cellSize}px)`,
          gap: gap,
        }}
      ></div>

      {/* Converter in CENTER */}
      <div className="relative flex items-center justify-center">
        <motion.div
          ref={extractorRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-40 h-40 flex items-center justify-center border border-cyan-400 rounded bg-[#111827] text-cyan-300 font-bold"
        >
          Pixel Merger
        </motion.div>
      </div>

      {/* Original (RIGHT) */}
      <div className="relative flex flex-col items-center">
        <motion.div
          ref={originalRef}
          initial={{
            x: targetPoint ? targetPoint.ex - 75 : 0,
            y: targetPoint ? targetPoint.ey - 75 : 0,
            opacity: 0, // fully invisible at the start
            scale: 0.6,
          }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1, // fades in only after delay
            scale: 1,
          }}
          transition={{
            delay: animateCount * stagger + flightDuration + extractorDuration,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <h3 className="mb-2 text-sm">Reconstructed</h3>
          <img
            src={output}
            width={150}
            height={150}
            alt="reconstructed"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Flying pixels (grid → converter) */}
      <div className="absolute left-0 top-0 pointer-events-none w-full h-full">
        {layoutReady &&
          startPoints.map((s, i) => {
            const color = pixelColors[i];
            return (
              <motion.div
                key={`rev-fly-${i}`}
                initial={{
                  x: s.x,
                  y: s.y,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: targetPoint.ex,
                  y: targetPoint.ey,
                  opacity: 0.6,
                  scale: 0.8,
                }}
                transition={{
                  delay: i * stagger,
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
                }}
              />
            );
          })}
      </div>
    </div>
  );
}
