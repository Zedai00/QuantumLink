import { animate, createScope, svg, text } from "animejs";
import { useEffect, useRef } from "react";

export default function Pipe() {

  const root = useRef(null)
  const scope = useRef(null)
  const TEXT = "HELLLO, World@"


  function splitText(text) {
    const result = [];
    for (let char of text) {
      if (char === " ") {
        result.push(char);
      } else {
        result.push(char);
      }
    }
    return result;
  }

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      const letters = splitText(TEXT)
      letters.reverse()
      console.log(letters)

      const container = document.createElement("div");
      container.className = "letter-container     w-16 h-16  flex justify-center items-center text-xl font-bold text-white rounded-md"
      root.current.prepend(container)

      letters.forEach((letter, i) => {
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
          delay: (letters.length - i - 1) * 100,
        })
      })

      const chars = splitText(TEXT)
      console.log(chars)
      chars.forEach((char, i) => {
        const el = document.createElement("div");
        el.textContent = char
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
          onComplete: () => el.remove()
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
  }, [])

  return (
    <div ref={root}>
      <svg width="500" height="600" viewBox="0 0 500 600">
        <path
          id="my-l-path"
          d="M0,495 L330,495 L330,165 L 495,165"
          fill="none"
          stroke="none"
          stroke-width="2"
        />
      </svg>

      <div className="absolute bottom-20 left-0 w-15 z-50 h-20 bg-blue-500 "></div>
      <div className="absolute bottom-20 left-0 w-80 h-20 bg-blue-500 ">
      </div>
      <div className="absolute bottom-20 left-80 w-20 h-100 bg-blue-500 rounded-bl-none rounded-br-md" />
      <div className="absolute top-40 left-80 w-52 h-20  bg-blue-500 rounded-md" />

      <div className="absolute top-32 left-120 w-100 h-32 bg-red-500  rounded-xl shadow-[0_0_12px_rgba(0,0,0,0.4)]
 flex items-center justify-center text-white text-xl font-bold z-50">
        Letter Splitter
      </div>

      <div className="absolute top-40 right-80 w-48 h-20 bg-green-400 -z-0 rounded-md" />
      <div className="absolute bottom-20 right-80 w-20 h-100 bg-green-400 rounded-br-none rounded-bl-md" />
      <div className="absolute bottom-20 right-0 w-80 h-20 bg-green-400" />

      <div className="letter-container absolute  bottom-22  w-16 h-16 bg-blue-500 flex justify-center items-center text-xl font-bold text-white rounded-md"></div>
    </div>
  );
}
