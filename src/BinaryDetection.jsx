import React, { useEffect, useRef } from "react";
import "./BinaryDetection.css";

export default function BinaryDetection() {
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    const box = boxRef.current;

    function animateBinary(binary) {
      const fly = document.createElement("div");
      fly.className = "fly";
      fly.textContent = binary;
      fly.style.left = "20px";
      fly.style.top = "50%";
      document.body.appendChild(fly);

      const rect = box.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;

      let pos = 20;
      const interval = setInterval(() => {
        pos += 2;
        fly.style.left = pos + "px";

        if (pos >= mid - 30) {
          clearInterval(interval);
          fly.remove();

          detectBinary(binary, rect);
        }

        if (pos > window.innerWidth + 200) {
          clearInterval(interval);
          fly.remove();
        }
      }, 16);
    }

    function detectBinary(binary, rect) {
      const detection = document.createElement("div");
      detection.className = "detection-result";
      detection.textContent = `Detected: ${binary.length} bits`;
      detection.style.left = rect.left + rect.width / 2 + "px";
      detection.style.top = rect.top + rect.height / 2 + "px";
      document.body.appendChild(detection);

      setTimeout(() => {
        detection.style.left = window.innerWidth + "px";
      }, 100);

      setTimeout(() => {
        detection.remove();
      }, 2500);
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
        id="binaryDetectionInput"
        type="text"
        placeholder="Enter binary (e.g. 101010)"
      />
      <div ref={boxRef} id="binaryDetectionBox">
        Binary Detection
      </div>
    </>
  );
}
