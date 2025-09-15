import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { motion, useAnimation } from "framer-motion";
import { Context } from "../../Context/Context";

export default function FlowRGBValues({ input, output, width, height }) {
  const { onComplete, speed } = useContext(Context);

  console.log("Speed: ", speed);
  // debugging
  // console.log("Input (rgb strings): ", input);
  // console.log("Output (rgb triplets): ", output);

  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const converterRef = useRef(null);

  const [layoutReady, setLayoutReady] = useState(false);
  const [positions, setPositions] = useState([]);
  const [cellSize, setCellSize] = useState(6);
  const [gridCols, setGridCols] = useState(width || 32);

  const converterAnim = useAnimation();

  // ---------------- data
  // use the final pixel colors array (output is your full image RGB triplets)
  const MAX_PIXELS = 8000;
  let pixelData = output || [];
  if (pixelData.length > MAX_PIXELS) {
    const step = Math.ceil(pixelData.length / MAX_PIXELS);
    pixelData = pixelData.filter((_, i) => i % step === 0);
    // console.warn(`Downsampled pixels to ${pixelData.length} for perf`);
  }

  const pixelColors = useMemo(
    () =>
      pixelData && pixelData.length
        ? pixelData.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`)
        : [],
    [pixelData]
  );

  // The left-side RGB labels (text) — if `input` is already rgb strings, use them.
  // Fallback: derive from pixelColors first N items
  const rgbLabels = useMemo(() => {
    if (input && input.length) return input; // expects strings like 'rgb(141,134,119)'
    return pixelColors.map((c) => c);
  }, [input, pixelColors]);

  // ---------------- layout params
  const gap = 1;
  const animateCount = pixelColors.length;

  // ---------- animation timing controlled by speed
  const {
    rgbFlyDuration,
    pixelFlyDuration,
    staggerDelay,
    gridFadeDelayAfterLanding,
  } = useMemo(() => {
    return {
      rgbFlyDuration: speed > 5 ? 1.2 / speed : 6, // label flies faster when speed > 1
      pixelFlyDuration: speed > 5 ? 0.6 / speed : 0.3, // pixel also scales with speed
      staggerDelay: speed > 5 ? 0.03 / speed : 2, // launch interval
      gridFadeDelayAfterLanding: speed > 5 ? 0.08 : 0.8, // keep small constant
    };
  }, [speed]);

  // ---------------- compute positions for converter & final grid
  const computeLayout = useCallback(() => {
    const root = rootRef.current;
    const grid = gridRef.current;
    const conv = converterRef.current;
    if (!root || !grid || !conv) return;

    const rootRect = root.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    const convRect = conv.getBoundingClientRect();

    const cols =
      width || Math.max(1, Math.round(Math.sqrt(pixelColors.length || 1)));
    const rows = height || Math.ceil((pixelColors.length || 1) / cols);

    // try to fit grid into a reasonable width
    const maxGridWidth = Math.max(
      64,
      Math.min(gridRect.width || 150, rootRect.width * 0.28)
    );
    const computedCell = Math.max(
      2,
      Math.floor(maxGridWidth / Math.max(1, cols))
    );

    const pos = [];
    for (let i = 0; i < animateCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const endX = gridRect.left - rootRect.left + col * (computedCell + gap);
      const endY = gridRect.top - rootRect.top + row * (computedCell + gap);

      const midX = convRect.left - rootRect.left + convRect.width / 2;
      const midY = convRect.top - rootRect.top + convRect.height / 2;

      pos.push({
        end: { x: endX, y: endY },
        mid: { x: midX, y: midY },
        color: pixelColors[i],
        label: rgbLabels[i] || pixelColors[i],
        index: i,
      });
    }

    setPositions(pos);
    setGridCols(cols);
    setCellSize(computedCell);
    setLayoutReady(true);
  }, [width, height, pixelColors, rgbLabels, animateCount]);

  useEffect(() => {
    const id = requestAnimationFrame(() => computeLayout());
    window.addEventListener("resize", computeLayout);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", computeLayout);
    };
  }, [computeLayout]);

  // ---------------- strong converter glow (flash)
  const glowConverter = (fast = false) => {
    // stronger flash: slight scale + bright shadow
    converterAnim.start({
      boxShadow: "0 0 28px rgba(127,0,255,0.9), 0 0 60px rgba(0,255,255,0.85)",
      backgroundColor: "#1f1830",
      scale: 1.03,
      transition: { duration: fast ? 0.15 : 0.25 },
    });
    setTimeout(
      () => {
        converterAnim.start({
          boxShadow: "0 0 0px transparent",
          backgroundColor: "#111827",
          scale: 1,
          transition: { duration: fast ? 0.15 : 0.25 },
        });
      },
      fast ? 120 : 300
    );
  };

  if (!pixelColors.length) {
    return <div className="text-white">⚠️ No pixels to render</div>;
  }

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;

  // ---------------- main render
  return (
    <div
      ref={rootRef}
      className="relative w-full h-screen bg-[#030313] text-white overflow-hidden"
    >
      {/* Pixel grid on right */}
      <div
        ref={gridRef}
        className="absolute right-10 top-1/2 -translate-y-1/2"
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
        {/* Permanent grid cells: start invisible; fade in after pixel lands */}
        {positions.map((p, i) => (
          <motion.div
            key={`grid-${i}`}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: p.color,
              opacity: 0,
            }}
            // become visible slightly after pixel flight completes
            animate={{ opacity: 1 }}
            transition={{
              delay:
                i * staggerDelay +
                rgbFlyDuration +
                pixelFlyDuration +
                gridFadeDelayAfterLanding,
              duration: 0.18,
            }}
          />
        ))}
      </div>

      {/* Converter in center */}
      <motion.div
        ref={converterRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-44 h-20 flex items-center justify-center border border-cyan-400 bg-[#111827] rounded-lg"
        animate={converterAnim}
      >
        <div className="text-cyan-300 font-bold">RGB → Pixel</div>
      </motion.div>

      {/* Flow logic:
            1) RGB label flies from left to converter (x -> mid.x) and fades out at the end.
            2) On complete of rgb flight we trigger a fast converter glow.
            3) A pixel square spawns at converter and flies to the final position.
            4) After pixel lands, the permanent grid cell fades in (handled by the grid cell's animate delay).
      */}
      {layoutReady &&
        positions.map((p, i) => (
          <div key={`flow-${i}-${speed}`}>
            {/* RGB label flies TO the converter and disappears */}
            <motion.div
              className="absolute flex items-center gap-2 text-xs"
              initial={{ x: -160, y: p.mid.y, opacity: 0 }}
              animate={{
                x: p.mid.x,
                y: p.mid.y,
                opacity: [0, 1, 0], // visible in middle, then vanish at end (at converter)
              }}
              transition={{
                delay: i * staggerDelay,
                duration: rgbFlyDuration + 1,
                ease: "easeInOut",
              }}
              onAnimationComplete={() => {
                // flash the converter when a label reaches it
                glowConverter(true);
              }}
              style={{ pointerEvents: "none" }}
            >
              <div
                className="w-3 h-3 rounded-sm border border-gray-600"
                style={{ backgroundColor: p.color }}
              />
              <span className="font-bold text-sm whitespace-nowrap">
                {p.label}
              </span>
            </motion.div>

            {/* Pixel spawns at converter and flies to final grid slot */}
            <motion.div
              className="absolute"
              style={{
                backgroundColor: p.color,
                width: cellSize,
                height: cellSize,
                borderRadius: 1,
                boxShadow: "0 0 6px rgba(0,0,0,0.35)",
              }}
              initial={{ x: p.mid.x, y: p.mid.y, opacity: 0, scale: 0.9 }}
              animate={{ x: p.end.x, y: p.end.y, opacity: 1, scale: 1 }}
              transition={{
                // start right after the rgb label arrives (rgbFlyDuration)
                delay: i * staggerDelay + rgbFlyDuration * 0.98,
                duration: pixelFlyDuration,
                ease: "easeInOut",
              }}
              onAnimationComplete={() => {
                // last pixel triggers onComplete
                if (
                  i === positions.length - 1 &&
                  typeof onComplete === "function"
                ) {
                  // give a tiny delay so grid cell fade finishes visually
                  setTimeout(() => onComplete(), 120);
                }
              }}
            />
          </div>
        ))}
    </div>
  );
}
