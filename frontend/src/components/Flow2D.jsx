import { createScope, createTimeline, svg } from "animejs";
import { useContext, useEffect, useRef } from "react";
import { Context } from "./Context";

export default function Flow({ input, convertor, output }) {
  const root = useRef(null);
  const scope = useRef(null);
  const hasCompleted = useRef(false);
  const { onComplete } = useContext(Context);

  useEffect(() => {
    hasCompleted.current = false;

    scope.current = createScope({ root }).add(() => {
      const { translateX: ltcX, translateY: ltcY, rotate: ltcRotate } =
        svg.createMotionPath("#ltc");
      const { translateX: ctrX, translateY: ctrY, rotate: ctrRotate } =
        svg.createMotionPath("#ctr");
      const tl = createTimeline({ defaults: { duration: 3000 } });

      // ✅ We know input & output are always 2D arrays
      input.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
          // 🔹 Create input letter box
          const el = document.createElement("div");
          el.textContent = letter;
          el.className = `
            letter-box opacity-0 absolute min-w-16 min-h-16 p-5 flex justify-center items-center
            text-2xl font-extrabold text-cyan-300 
            bg-gradient-to-br from-[#1e1e2f] via-[#111827] to-[#000] 
            rounded-xl backdrop-blur-lg border border-cyan-400/50
            shadow-[0_0_25px_rgba(0,255,255,0.8)] 
            animate-pulse-glow neon-particle
          `;

          root.current.prepend(el);

          tl.add(
            el,
            {
              keyframes: { "10%": { opacity: 1 } },
              translateX: ltcX,
              translateY: ltcY,
              rotate: ltcRotate,
              opacity: 1,
              loop: false,
              onComplete: () => el.remove(),
            },
            "+=200"
          );

          // 🔹 Create corresponding output letter box
          const outVal = output[rowIndex][colIndex]; // ✅ Correct mapping
          const outEl = document.createElement("div");
          outEl.textContent = outVal;
          outEl.className = `
            absolute opacity-0 p-5 left-160 top-42 min-w-16 min-h-16 z-40 flex justify-center items-center
            text-xl font-extrabold text-pink-400 
            bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2e] to-[#000] 
            rounded-xl backdrop-blur-lg border border-pink-400/50
            shadow-[0_0_25px_rgba(255,0,255,0.8)] 
            animate-pulse-glow neon-particle
          `;

          root.current.appendChild(outEl);

          tl.add(
            outEl,
            {
              keyframes: { "10%": { opacity: 1 } },
              translateX: ctrX,
              translateY: ctrY,
              rotate: ctrRotate,
              opacity: 1,
              loop: false,
              onComplete: () => {
                outEl.remove();
                if (
                  rowIndex === input.length - 1 &&
                  colIndex === row.length - 1 &&
                  !hasCompleted.current
                ) {
                  hasCompleted.current = true;
                  onComplete(input, output);
                }
              },
            },
            "+=0"
          );
        });
      });
    });

    return () => {
      scope.current.revert();
      const lc = document.querySelectorAll(".letter-container");
      lc.forEach((l) => l.remove());
    };
  }, [input, onComplete, output]);

  return (
    <div ref={root} className="relative bg-[#030313] min-h-screen overflow-hidden">
      {/* Motion Paths */}
      <svg width="500" height="600" viewBox="0 0 500 600">
        <path id="ltc" d="M 0 229 l 543 0" fill="none" stroke="none" />
      </svg>

      <svg
        width="800"
        height="600"
        viewBox="0 0 800 600"
        className="absolute bottom-0"
      >
        <path id="ctr" d="M 0 58 l 800 0" fill="none" stroke="none" />
      </svg>

      {/* Converter Box */}
      <div
        className="absolute top-50 left-120 w-100 h-32 bg-gradient-to-r from-[#111827] via-[#1a1f3c] to-[#0f0f1f]
        rounded-xl shadow-[0_0_35px_rgba(0,255,255,0.9)]
        flex items-center justify-center text-cyan-300
        font-bold text-2xl border border-cyan-400/40 backdrop-blur-md
        animate-holo-shimmer z-50"
      >
        {convertor}
      </div>
    </div>
  );
}

