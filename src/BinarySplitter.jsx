import React, { useEffect, useRef } from "react";
import "./BinarySplitter.css";

export default function BinarySplitter() {
  const inputRef = useRef(null);
  const splitterRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    const splitter = splitterRef.current;

    function splitIntoPairs(binary) {
      return binary.match(/.{1,2}/g) || [];
    }

    function animateBinary(binary) {
      const flyIn = document.createElement("div");
      flyIn.className = "flying";
      flyIn.textContent = binary;
      flyIn.style.left = "20px";
      flyIn.style.top = "50%";
      document.body.appendChild(flyIn);

      let pos = 20;
      const end = window.innerWidth + 200;
      const rect = splitter.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;

      const interval = setInterval(() => {
        pos += 2;
        flyIn.style.left = pos + "px";

        if (pos >= mid - 30) {
          clearInterval(interval);
          flyIn.remove();

          const pairs = splitIntoPairs(binary);
          animatePairs(pairs, rect);
        }

        if (pos > end) {
          clearInterval(interval);
          flyIn.remove();
        }
      }, 16);
    }

    function animatePairs(pairs, rect) {
      const created = [];
      let index = 0;

      function nextPair() {
        if (index < pairs.length) {
          const pair = document.createElement("div");
          pair.className = "flying flash";
          pair.textContent = pairs[index];
          pair.style.left = rect.left + rect.width / 2 + "px";
          pair.style.top = "50%";
          document.body.appendChild(pair);
          created.push(pair);

          // Glow splitter
          splitter.classList.add("glow");
          setTimeout(() => splitter.classList.remove("glow"), 600);

          const offset = 120 + index * 35;
          setTimeout(() => {
            pair.style.top = `calc(50% - ${offset}px)`;
          }, 100);

          setTimeout(() => pair.classList.remove("flash"), 500);

          index++;
          setTimeout(nextPair, 1000);
        } else {
          setTimeout(() => movePairsRight(created), 1200);
        }
      }

      nextPair();
    }

    function movePairsRight(elements) {
      elements.forEach((el, i) => {
        setTimeout(() => {
          let pos = parseInt(el.style.left);
          const end = window.innerWidth + 200;

          const interval = setInterval(() => {
            pos += 3;
            el.style.left = pos + "px";

            if (pos > end) {
              clearInterval(interval);
              el.style.opacity = "0";
              setTimeout(() => el.remove(), 500);
            }
          }, 4);
        }, i * 120);
      });
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const binary = input.value.trim();
        if (/^[01]+$/.test(binary)) {
          animateBinary(binary);
        } else {
          alert("Enter a valid binary string (only 0s and 1s)");
        }
        input.value = "";
      }
    });
  }, []);

  return (
    <>
      <input
        ref={inputRef}
        id="binaryInput"
        type="text"
        placeholder="Enter binary (e.g. 101101)"
      />
      <div ref={splitterRef} id="splitter">
        Binary Splitter
      </div>
    </>
  );
}
