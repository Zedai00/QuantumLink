import { createScope, createTimeline, svg } from "animejs";
import { useContext, useEffect, useRef } from "react";
import { Context } from "./Context";

export default function Flow2({ input, convertor, output }) {

  const root = useRef(null)
  const scope = useRef(null)
  const hasCompleted = useRef(null)
  const { onComplete } = useContext(Context)

  useEffect(() => {
    hasCompleted.current = false
    scope.current = createScope({ root }).add(() => {

      const container = document.createElement("div");
      container.className = "letter-container w-16 h-16  flex justify-center items-center text-xl font-bold text-white rounded-md"
      root.current.prepend(container)

      const { translateX, translateY, rotate } = svg.createMotionPath('path');
      const tl = createTimeline({ defaults: { duration: 3000 } })

      input.forEach((letter, i) => {
        const el = document.createElement("div")
        el.textContent = letter
        el.className = `letter-box opacity-0 absolute z-40  w-16 h-16  flex justify-center items-center text-white text-xl font-bold`
        container.appendChild(el)

        tl.add(el, {
          keyframes: {
            "10%": { opacity: 1 }
          },
          translateX: translateX,
          translateY: translateY,
          rotate: rotate,
          opacity: 1,
          // duration: 3000,
          loop: false,
          // delay: (input.length - i - 1) * 500,
          onComplete: () => el.remove()
        }, "+=200")

        output[i].forEach((elm, j) => {
          const el = document.createElement("div");
          el.textContent = elm
          el.className = "absolute left-160 top-42 z-40 w-16 h-16 bg-blue-500 flex justify-center items-center text-xl font-bold text-white rounded-md";

          root.current.appendChild(el);

          tl.add(el, {
            keyframes: [
              { translateX: 332, translateY: 0, duration: 800 },
              { translateX: 332, translateY: 330, duration: 800 },
              { translateX: 1000, translateY: 330, duration: 800 }
            ],
            // delay: 3000 + (500 * j),
            duration: 500,
            loop: false,
            onComplete: () => {
              el.remove()
              if (i === input.length - 1 && j === output[i].length - 1 && !hasCompleted.current) {
                hasCompleted.current = true;
                onComplete(input, output);
              }
            }
          }, `${j > 0 ? "-=2000" : "+=0"}`);
        })
      })


      // output.forEach((box, i) => {
      //   box.forEach((elm, j) => {
      //     const el = document.createElement("div");
      //     el.textContent = elm
      //     el.className = "absolute left-160 top-42 z-40 w-16 h-16 bg-blue-500 flex justify-center items-center text-xl font-bold text-white rounded-md";
      //
      //     root.current.appendChild(el);
      //
      //     animate(el, {
      //       keyframes: [
      //         { translateX: 332, translateY: 0, duration: 800 },
      //         { translateX: 332, translateY: 330, duration: 800 },
      //         { translateX: 1000, translateY: 330, duration: 800 }
      //       ],
      //       delay: 3000 + (500 * j),
      //       loop: false,
      //       onComplete: () => {
      //         el.remove()
      //       }
      //     });
      //   })
      // })

    })
    return () => {
      scope.current.revert()
      const lc = document.querySelectorAll(".letter-container")
      lc.forEach(l => {
        l.remove()
      })
    }
  }, [input, onComplete, output])

  return (
    <div ref={root}>
      <svg width="500" height="600" viewBox="0 0 500 600">
        <path
          id="my-l-path"
          d="M 0 495 L 288 493 C 330 483 330.6667 461.6667 331 445 L 327 198 C 324 160 359.3333 165 374 165 L 546 162"
          fill="none"
          stroke="none"
          strokeWidth="2"
        />
      </svg>

      <div className="absolute bottom-20 left-0 w-15 z-50 h-20 bg-blue-500 "></div>
      <div className="absolute bottom-20 left-0 w-80 h-20 bg-blue-500 ">
      </div>
      <div className="absolute bottom-20 left-74 w-32 h-100 bg-blue-500 rounded-bl-none rounded-br-md" />
      <div className="absolute top-40 left-76 w-52 h-20  bg-blue-500 rounded-md" />

      <div className="absolute top-32 left-120 w-100 h-32 bg-red-500  rounded-xl shadow-[0_0_12px_rgba(0,0,0,0.4)]
 flex items-center justify-center text-white text-xl font-bold z-50">
        {convertor}
      </div>

      <div className="absolute top-40 right-76 w-80 h-20 bg-blue-500 -z-0 rounded-md" />
      <div className="absolute bottom-20 right-76 w-28 h-100 bg-blue-500 rounded-br-none rounded-bl-md" />
      <div className="absolute bottom-20 right-0 w-100 h-25 bg-blue-500" />

      <div className="letter-container absolute  bottom-22  w-16 h-16 bg-blue-500 flex justify-center items-center text-l font-bold text-white rounded-md"></div>
    </div>
  );
}

