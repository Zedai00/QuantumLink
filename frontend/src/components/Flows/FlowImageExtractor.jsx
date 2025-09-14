import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import { Context } from "../Context/Context";

export default function FlowImageExtractor({ input, output, width, height }) {
  const { onComplete } = useContext(Context);
  const rootRef = useRef(null);
  const originalRef = useRef(null);
  const extractorRef = useRef(null);
  const gridRef = useRef(null);

  // layout & animation control
  const [startPoint, setStartPoint] = useState(null);
  const [targets, setTargets] = useState([]);
  const [cellSize, setCellSize] = useState(6);
  const [gridCols, setGridCols] = useState(width || 32);
  const [layoutReady, setLayoutReady] = useState(false);

  const pixelColors = output.map(([r, g, b]) => `rgb(${r},${g},${b})`);
  console.log("PixelColors length: ", pixelColors.length);

  const animateCount = Math.min(2000, pixelColors.length);
  const animatedPixelIndices = Array.from(
    { length: animateCount },
    (_, i) => i
  );

  const originalMoveDuration = 1.6;
  const flightDuration = 0.7;
  const stagger = 0.01;
  const finalBuffer = 0.4;
  const gap = 1;

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

    const startX = extrRect.left + extrRect.width / 2 - rootRect.left;
    const startY = extrRect.top + extrRect.height / 2 - rootRect.top;

    const totalPixels = pixelColors.length || 1;
    let cols = width || Math.round(Math.sqrt(totalPixels));
    let rows = height ? height : Math.ceil(totalPixels / cols);

    // fit within available space
    const maxGridWidth = Math.max(
      64,
      Math.min(gridRect.width, rootRect.width * 0.28)
    );
    const computedCell = Math.max(2, Math.floor(maxGridWidth / cols));

    // compute target coordinates
    const t = [];
    for (let i = 0; i < animateCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const targetX =
        gridRect.left - rootRect.left + col * (computedCell + gap);
      const targetY = gridRect.top - rootRect.top + row * (computedCell + gap);
      t.push({ x: targetX, y: targetY });
    }

    const origCenterX = origRect.left + origRect.width / 2 - rootRect.left;
    const origCenterY = origRect.top + origRect.height / 2 - rootRect.top;
    const origDeltaX = startX - origCenterX;
    const origDeltaY = startY - origCenterY;

    setCellSize(computedCell);
    setGridCols(cols);
    setStartPoint({ x: startX, y: startY, origDeltaX, origDeltaY });
    setTargets(t);
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
    if (!layoutReady || !startPoint || targets.length === 0) return;
    const totalTime =
      originalMoveDuration +
      animateCount * stagger +
      flightDuration +
      finalBuffer;
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, totalTime * 1000 + 50);
    return () => clearTimeout(completeTimer);
  }, [layoutReady, startPoint, targets, animateCount, onComplete]);

  if (!input || !output || pixelColors.length === 0) {
    return <div className="text-stone-900">⚠️ No pixels to render</div>;
  }

  return (
    <div
      ref={rootRef}
      className="relative w-full h-screen bg-[#030313] text-white overflow-hidden"
    >
      {/* Left: Original image */}
      <div className="absolute left-8 top-12 flex flex-col items-center">
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
          <img
            src={input}
            width={150}
            height={150}
            alt="original"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Extractor */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/3">
        <div
          ref={extractorRef}
          className="w-40 h-40 flex items-center justify-center border border-cyan-400 rounded bg-[#111827] text-cyan-300 font-bold"
        >
          Pixel Extractor
        </div>
      </div>

      {/* Grid (final pixels) */}
      <div
        ref={gridRef}
        className="absolute right-10 top-28"
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

      {/* Flying pixels */}
      <div className="absolute left-0 top-0 pointer-events-none w-full h-full">
        {startPoint &&
          targets.map((t, i) => {
            const color = pixelColors[i];
            return (
              <motion.div
                key={`fly-${i}`}
                initial={{
                  x: startPoint.x,
                  y: startPoint.y,
                  opacity: 1,
                  scale: 0.9,
                }}
                animate={{ x: t.x, y: t.y, opacity: 1, scale: 1 }}
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
                }}
              />
            );
          })}
      </div>
    </div>
  );
}
