
import { useEffect, useRef, useState, useCallback, useContext, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import { Context } from "../../Context/Context";

export default function FlowRGBValues({ input, width, height }) {
  const { onComplete } = useContext(Context);

  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const converterRef = useRef(null);

  const [layoutReady, setLayoutReady] = useState(false);
  const [positions, setPositions] = useState([]);
  const [cellSize, setCellSize] = useState(6);
  const [gridCols, setGridCols] = useState(width || 32);

  const converterAnim = useAnimation();

  // Pixel cap
  const MAX_PIXELS = 8000;
  let pixelData = input;
  if (input.length > MAX_PIXELS) {
    const step = Math.ceil(input.length / MAX_PIXELS);
    pixelData = input.filter((_, i) => i % step === 0);
    console.warn(
      `⚠️ Input had ${input.length} pixels, downscaled to ${pixelData.length}.`
    );
  }

   // Memoize pixelColors to avoid unnecessary recalcs
  const pixelColors = useMemo(
    () => (pixelData ? pixelData.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`) : []),
    [pixelData]
  );

  const gap = 1;
  const animateCount = pixelColors.length;

  // Layout calculation
  const computeLayout = useCallback(() => {
    const root = rootRef.current;
    const grid = gridRef.current;
    const conv = converterRef.current;
    if (!root || !grid || !conv) return;

    const rootRect = root.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    const convRect = conv.getBoundingClientRect();

    const cols = width || Math.round(Math.sqrt(pixelColors.length));
    const rows = height || Math.ceil(pixelColors.length / cols);

    const maxGridWidth = Math.max(
      64,
      Math.min(gridRect.width || 150, rootRect.width * 0.28)
    );
    const computedCell = Math.max(2, Math.floor(maxGridWidth / cols));

    const initialPosition = [];
    for (let i = 0; i < animateCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const startX =
        gridRect.left - rootRect.left + col * (computedCell + gap);
      const startY =
        gridRect.top - rootRect.top + row * (computedCell + gap);

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
  }, [width, height, pixelColors, animateCount]);

  useEffect(() => {
    const id = requestAnimationFrame(() => computeLayout());
    window.addEventListener("resize", computeLayout);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", computeLayout);
    };
  }, [computeLayout]);

  // Glow + onComplete trigger
  useEffect(() => {
    if (!layoutReady || positions.length === 0) return;
    let isMounted = true;

    // Converter glow loop
    positions.forEach((_, i) => {
      setTimeout(() => {
        if (!isMounted) return;
        converterAnim.start({
          boxShadow: "0 0 20px #7f00ff, 0 0 40px #00ffff",
          backgroundColor: "#1f1f40",
        });
        setTimeout(() => {
          if (!isMounted) return;
          converterAnim.start({
            boxShadow: "0 0 0px transparent",
            backgroundColor: "#111827",
          });
        }, 300);
      }, i * 500 + 200);
    });

    // Calculate when last RGB disappears
    const lastDelay = (positions.length - 1) * 0.3;
    const rgbDuration = 1.5;
    const totalTime = lastDelay * 1000 + rgbDuration * 1000;

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, totalTime);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [layoutReady, positions, converterAnim, onComplete]);

  if (!pixelColors.length) {
    return <div className="text-white">⚠️ No pixels to render</div>;
  }

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 800;

  return (
    <div
      ref={rootRef}
      className="relative w-full h-screen bg-[#030313] text-white overflow-hidden"
    >
      {/* Pixel grid */}
      <div
        ref={gridRef}
        className="absolute left-10 top-1/2 -translate-y-1/2"
        style={{
          width: `${gridCols * (cellSize + gap)}px`,
          height: `${
            Math.ceil(pixelColors.length / gridCols) * (cellSize + gap)
          }px`,
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, ${cellSize}px)`,
          gap: gap,
        }}
      >
        {positions.map((_, i) => (
          <div
            key={`grid-${i}`}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: "transparent",
            }}
          />
        ))}
      </div>

      {/* Converter */}
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
            className="absolute"
            style={{
              backgroundColor: p.color,
              width: cellSize,
              height: cellSize,
            }}
            initial={{ x: p.start.x, y: p.start.y, opacity: 1 }}
            animate={{ x: [p.start.x, p.mid.x], y: [p.start.y, p.mid.y] }}
            transition={{
              delay: i * 0.3,
              duration: 1.5,
              ease: "easeInOut", 
            }}
          />
        ))}

      {/* RGB values */}
      {layoutReady &&
        positions.map((p, i) => (
          <motion.div
            key={`rgb-${i}`}
            className="absolute flex items-center gap-1 text-xs"
            initial={{ x: p.mid.x, y: p.mid.y, opacity: 0, scale: 0.9 }}
            animate={{
              x: screenWidth - 80,
              y: p.mid.y + i * 6,
              opacity: [0, 1, 1, 0],
              scale: [0.9, 1.05, 1],
            }}
            transition={{
              delay: i * 0.8 + 1.5,
              duration: 5,
              ease: "easeInOut",
            }}
          >
            <div
              className="w-3 h-3 rounded-sm border border-gray-600"
              style={{ backgroundColor: p.color }}
            />
            <span
              className="font-bold text-lg whitespace-nowrap"

            >
              {p.color}
            </span>
          </motion.div>
        ))}
    </div>
  );
}
