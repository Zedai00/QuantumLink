import { createTimeline, createScope, svg, utils } from "animejs";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../../Context/Context";

export default function Flow({ input, convertor, output }) {
  const root = useRef(null);
  const scope = useRef(null);
  const hasCompleted = useRef(null);
  const tlRef = useRef(null);
  const { onComplete, speed, animate } = useContext(Context); // use global speed

  useEffect(() => {
    hasCompleted.current = false;

    scope.current = createScope({ root }).add(() => {
      const { translateX: ltcX, translateY: ltcY, rotate: ltcRotate } = svg.createMotionPath("#ltc");
      const { translateX: ctrX, translateY: ctrY, rotate: ctrRotate } = svg.createMotionPath("#ctr");
      const tl = createTimeline({ defaults: { duration: 2000 } });
      tlRef.current = tl;

      // Input letters animation
      const el = document.createElement("div");
      el.textContent = input;
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

      // Output letters animation
      output.forEach((elm, i) => {
        const el = document.createElement("div");
        el.textContent = elm;
        el.className = `absolute opacity-0 p-5 left-160 top-42 min-w-16 min-h-16 z-40 flex justify-center items-center
          text-xl font-extrabold text-pink-400 
          bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2e] to-[#000] 
          rounded-xl backdrop-blur-lg border border-pink-400/50
          shadow-[0_0_25px_rgba(255,0,255,0.8)] 
          animate-pulse-glow neon-particle`;

        root.current.appendChild(el);

        tl.add(
          el,
          {
            keyframes: { "10%": { opacity: 1 } },
            translateX: ctrX,
            translateY: ctrY,
            rotate: ctrRotate,
            opacity: 1,
            loop: false,
            onComplete: () => {
              if (i === output.length - 1 && !hasCompleted.current) {
                hasCompleted.current = true;
                onComplete();
              }
              el.remove();
            },
          },
          "+=0"
        );
      });
    });

    return () => {
      scope.current.revert();
      const lc = document.querySelectorAll(".letter-container");
      lc.forEach((l) => l.remove());
    };
  }, [onComplete]);

  // Update timeline speed whenever global speed changes
  useEffect(() => {
    if (tlRef.current) utils.sync(() => (tlRef.current.speed = speed));
  }, [speed]);

  useEffect(() => {
    if (tlRef) {
      animate ? utils.sync(() => tlRef.current.play()) : utils.sync(() => tlRef.current.pause())
    }
  }, [animate])

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

