import { animate, createScope, svg } from "animejs";
import { useContext, useEffect, useRef } from "react";
import { Context } from "./Context";

export default function Flow({ input, convertor, output }) {

  const root = useRef(null)
  const scope = useRef(null)
  const hasCompleted = useRef(null)
  const { onComplete } = useContext(Context)

  useEffect(() => {
    hasCompleted.current = false
    scope.current = createScope({ root }).add(() => {

      const container = document.createElement("div");
      container.className = "letter-container     w-16 h-16  flex justify-center items-center text-xl font-bold text-white rounded-md"
      root.current.prepend(container)

      input.forEach((letter, i) => {
        const el = document.createElement("div")
        el.textContent = letter
        el.className = `letter-box absolute z-40  w-16 h-16  flex justify-center items-center text-white text-2xl font-bold`
        container.appendChild(el)
        const { translateX, translateY, rotate } = svg.createMotionPath('path');
        animate(el, {
          translateX: translateX,
          translateY: translateY,
          rotate: rotate,
          duration: 3000,
          loop: false,
          delay: (input.length - i - 1) * 100,
        })
      })

      output.forEach((elm, i) => {
        const el = document.createElement("div");
        el.textContent = elm
        el.className = "absolute left-160 top-42 z-40 w-16 h-16 bg-blue-500 flex justify-center items-center text-xl font-bold text-white rounded-md";


        root.current.appendChild(el);

        animate(el, {
          keyframes: [
            { translateX: 332, translateY: 0, duration: 800 },
            { translateX: 332, translateY: 330, duration: 800 },
            { translateX: 1000, translateY: 330, duration: 800 }
          ],
          easing: "easeInOutQuad",
          delay: 3000 + (500 * i),
          loop: false,
          onComplete: () => {
            if (i === output.length - 1 && !hasCompleted.current) {

              hasCompleted.current = true
              onComplete(input, output)
            }
            el.remove()
          }
        });
      })
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
          d="M0,495 L330,495 L330,165 L 495,165"
          fill="none"
          stroke="none"
          strokeWidth="2"
        />
      </svg>

      <div className="absolute bottom-20 left-0 w-15 z-50 h-20 bg-blue-500 "></div>
      <div className="absolute bottom-20 left-0 w-80 h-20 bg-blue-500 ">
      </div>
      <div className="absolute bottom-20 left-76 w-28 h-100 bg-blue-500 rounded-bl-none rounded-br-md" />
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

