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

export default function FlowRGBValues({ input, width, height }) {
  const { onComplete } = useContext(Context);

  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const converterRef = useRef(null);
  const pixelCanvasRef = useRef(null);
  const rgbCanvasRef = useRef(null);

  const [layoutReady, setLayoutReady] = useState(false);
  const [positions, setPositions] = useState([]);
  const [cellSize, setCellSize] = useState(6);
  const [gridCols, setGridCols] = useState(width || 32);

  const converterAnim = useAnimation();

  // cap pixel count for performance
  const MAX_PIXELS = 6000;
  let pixelData = input || [];
  if (pixelData.length > MAX_PIXELS) {
    const step = Math.ceil(pixelData.length / MAX_PIXELS);
    pixelData = pixelData.filter((_, i) => i % step === 0);
    console.warn(
      `⚠️ Input had ${input.length} pixels, downscaled to ${pixelData.length}.`
    );
  }

  // Memoize pixelColors to avoid unnecessary recalcs
  const pixelColors = useMemo(
    () => pixelData.map(([r, g, b]) => `rgb(${r},${g},${b})`),
    [pixelData]
  );

  const gap = 1;
  const animateCount = pixelColors.length;

  // layout calculation
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

    const layout = [];
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 800;

    for (let i = 0; i < animateCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const startX = gridRect.left - rootRect.left + col * (computedCell + gap);
      const startY = gridRect.top - rootRect.top + row * (computedCell + gap);

      const midX = convRect.left - rootRect.left + convRect.width / 2;
      const midY = convRect.top - rootRect.top + convRect.height / 2;

      const endX = screenWidth - 80;
      const endY = midY + i * 6;

      layout.push({
        start: { x: startX, y: startY },
        mid: { x: midX, y: midY },
        end: { x: endX, y: endY },
        color: pixelColors[i],
        index: i,
      });
    }

    setPositions(layout);
    setGridCols(cols);
    setCellSize(computedCell);
    setLayoutReady(true);
  }, [width, height, pixelColors, animateCount]);

  useEffect(() => {
    const id = requestAnimationFrame(computeLayout);
    window.addEventListener("resize", computeLayout);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", computeLayout);
    };
  }, [computeLayout]);

  // animate converter glow + handle complete
  useEffect(() => {
    if (!layoutReady || positions.length === 0) return;
    let isMounted = true;

    // glowing effect loop
    const glowLoop = positions.map((_, i) =>
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
      }, i * 500 + 200)
    );

    // compute when all done
    const lastDelay = (positions.length - 1) * 0.3;
    const rgbDuration = 1.5;
    const totalTime = lastDelay * 1000 + rgbDuration * 1000;

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, totalTime);

    return () => {
      isMounted = false;
      glowLoop.forEach(clearTimeout);
      clearTimeout(timer);
    };
  }, [layoutReady, positions, converterAnim, onComplete]);

  // pixel animation on canvas
  useEffect(() => {
    if (!layoutReady || !pixelCanvasRef.current) return;
    const canvas = pixelCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const startTime = performance.now();
    let rafId;

    function draw(now) {
      if (!canvas) return;
      const elapsed = (now - startTime) / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      positions.forEach((p, i) => {
        const delay =  i * 0.3;
        const duration = 1.5;
        const t = Math.min(1, Math.max(0, (elapsed - delay) / duration));

        const x = p.start.x + (p.mid.x - p.start.x) * t;
        const y = p.start.y + (p.mid.y - p.start.y) * t;

        ctx.fillStyle = p.color;
        ctx.fillRect(x, y, cellSize, cellSize);
      });

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [layoutReady, positions, cellSize]);

  // RGB label animation on canvas
  useEffect(() => {
    if (!layoutReady || !rgbCanvasRef.current) return;
    const canvas = rgbCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "14px monospace";
    ctx.textBaseline = "top";
    let rafId;
    const startTime = performance.now();

    function draw(now) {
      if (!canvas) return;
      const elapsed = (now - startTime) / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      positions.forEach((p, i) => {
        const delay =  i * 1.5; 
        const duration = 5;
        const t = Math.min(1, Math.max(0, (elapsed - delay) / duration));

        if (t > 0 && t <= 1) {
          const x = p.mid.x + (p.end.x - p.mid.x) * t;
          const y = p.mid.y + (p.end.y - p.mid.y) * t;

          ctx.globalAlpha = Math.sin(Math.PI * t); // fade in/out
          ctx.fillStyle = "white";
          ctx.fillText(p.color, x + 20, y);

          ctx.fillStyle = p.color;
          ctx.fillRect(x, y, 10, 10);
        }
      });

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [layoutReady, positions]);

  if (!pixelColors.length) {
    return <div className="text-white">⚠️ No pixels to render</div>;
  }

  return (
    <div
      ref={rootRef}
      className="relative w-full h-screen bg-[#030313] text-white overflow-hidden"
    >
      {/* Pixel grid placeholder */}
      <div
        ref={gridRef}
        className="absolute left-10 top-1/2 -translate-y-1/2"
        style={{
          width: `${gridCols * (cellSize + gap)}px`,
          height: `${
            Math.ceil(pixelColors.length / gridCols) * (cellSize + gap)
          }px`,
        }}
      />

      {/* Converter */}
      <motion.div
        ref={converterRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-40 h-20 flex items-center justify-center border border-cyan-400 bg-[#111827] rounded-lg"
        animate={converterAnim}
      >
        Pixel → RGB
      </motion.div>

      {/* Flying pixels canvas */}
      <canvas
        ref={pixelCanvasRef}
        className="absolute left-0 top-0 w-full h-full pointer-events-none"
        width={typeof window !== "undefined" ? window.innerWidth : 800}
        height={typeof window !== "undefined" ? window.innerHeight : 600}
      />

      {/* RGB labels canvas */}
      <canvas
        ref={rgbCanvasRef}
        className="absolute font-bold left-0 top-0 w-full h-full pointer-events-none"
        width={typeof window !== "undefined" ? window.innerWidth : 800}
        height={typeof window !== "undefined" ? window.innerHeight : 600}
      />
    </div>
  );
}
