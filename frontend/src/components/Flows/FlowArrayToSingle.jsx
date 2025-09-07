import { createTimeline, createScope, svg } from "animejs";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context/Context";

export default function Flow({ input, convertor, output }) {
  const root = useRef(null);
  const scope = useRef(null);
  const hasCompleted = useRef(null);
  const { onComplete } = useContext(Context);

  useEffect(() => {
    hasCompleted.current = false;

    scope.current = createScope({ root }).add(() => {
      const { translateX: ltcX, translateY: ltcY, rotate: ltcRotate } = svg.createMotionPath("#ltc");
      const { translateX: ctrX, translateY: ctrY, rotate: ctrRotate } = svg.createMotionPath("#ctr");
      const tl = createTimeline({ defaults: { duration: 2000 } });

      // Animate input letters
      input.forEach((letter) => {
        const el = document.createElement("div");
        el.textContent = letter;
        el.className = `letter-box opacity-0 absolute min-w-16 min-h-16 p-5 flex justify-center items-center
          text-2xl font-extrabold text-cyan-300 
          bg-gradient-to-br from-[#1e1e2f] via-[#111827] to-[#000] 
          rounded-xl backdrop-blur-lg border border-cyan-400/50
          shadow-[0_0_25px_rgba(0,255,255,0.8)] 
          animate-pulse-glow neon-particle`;

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
      });

      // Animate the single output (already combined as string or array)
      const outEl = document.createElement("div");
      outEl.textContent = Array.isArray(output) ? output.join("") : output;
      outEl.className = `absolute opacity-0 p-5 left-160 top-42 min-w-16 min-h-16 z-40 flex justify-center items-center
        text-xl font-extrabold text-pink-400 
        bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2e] to-[#000] 
        rounded-xl backdrop-blur-lg border border-pink-400/50
        shadow-[0_0_25px_rgba(255,0,255,0.8)] 
        animate-pulse-glow neon-particle`;

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
            if (!hasCompleted.current) {
              hasCompleted.current = true;
              onComplete(input, output);
            }
          },
        },
        "+=0"
      );
    });

    return () => {
      scope.current.revert();
      const lc = document.querySelectorAll(".letter-container");
      lc.forEach((l) => l.remove());
    };
  }, [input, onComplete, output]);

  return (
    <div ref={root} className="relative bg-[#030313] w-full h-full overflow-hidden">
      {/* Motion paths */}
      <svg width="500" height="600" viewBox="0 0 500 600">
        <path id="ltc" d="M 0 229 l 543 0" fill="none" stroke="none" strokeWidth="2" />
      </svg>

      <svg width="800" height="600" viewBox="0 0 800 600" className="absolute bottom-0">
        <path id="ctr" d="M 0 58 l 800 0" fill="none" stroke="none" strokeWidth="2" />
      </svg>

      {/* Converter Box */}
      <div className="absolute top-50 left-120 w-100 h-32 bg-gradient-to-r from-[#111827] via-[#1a1f3c] to-[#0f0f1f]
        rounded-xl shadow-[0_0_35px_rgba(0,255,255,0.9)]
        flex items-center justify-center text-cyan-300
        font-bold text-2xl border border-cyan-400/40 backdrop-blur-md
        animate-holo-shimmer z-50">
        {convertor}
      </div>

      {/* Glow effects */}
      <style>
        {`
          @keyframes holo-shimmer {
            0% { box-shadow: 0 0 15px rgba(0,255,255,0.3), 0 0 40px rgba(255,0,255,0.2); }
            50% { box-shadow: 0 0 35px rgba(0,255,255,0.7), 0 0 60px rgba(255,0,255,0.5); }
            100% { box-shadow: 0 0 15px rgba(0,255,255,0.3), 0 0 40px rgba(255,0,255,0.2); }
          }
          .animate-holo-shimmer { animation: holo-shimmer 3s infinite ease-in-out; }

          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 8px rgba(0,255,255,0.3), 0 0 15px rgba(255,0,255,0.2); }
            50% { box-shadow: 0 0 25px rgba(0,255,255,0.8), 0 0 40px rgba(255,0,255,0.5); }
          }
          .animate-pulse-glow { animation: pulse-glow 1.5s infinite ease-in-out; }

          .neon-particle {
            filter: drop-shadow(0 0 8px rgba(0,255,255,0.5)) drop-shadow(0 0 15px rgba(255,0,255,0.3));
            transition: filter 0.2s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}

