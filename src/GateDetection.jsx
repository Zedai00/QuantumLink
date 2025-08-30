import React, { useEffect, useRef } from "react";
import "./GateDetection.css";

export default function GateDetection() {
  const inputRef = useRef(null);
  const gateRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    const gate = gateRef.current;

    function animateBinary(binary) {
      const fly = document.createElement("div");
      fly.className = "flying";
      fly.textContent = binary;
      fly.style.left = "20px";
      fly.style.top = "50%";
      document.body.appendChild(fly);

      const rect = gate.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;

      let pos = 20;
      const interval = setInterval(() => {
        pos += 2;
        fly.style.left = pos + "px";

        if (pos >= mid - 30) {
          clearInterval(interval);
          fly.remove();

          detectGate(binary, rect);
        }

        if (pos > window.innerWidth + 200) {
          clearInterval(interval);
          fly.remove();
        }
      }, 16);
    }

    function detectGate(binary, rect) {
      let gateType;
      if (/^0+$/.test(binary)) {
        gateType = "AND";
      } else if (/^1+$/.test(binary)) {
        gateType = "OR";
      } else {
        gateType = "XOR";
      }

      const result = document.createElement("div");
      result.className = "gate-result";
      result.textContent = `${gateType} Gate Detected`;
      result.style.left = rect.left + rect.width / 2 + "px";
      result.style.top = rect.top + rect.height / 2 + "px";
      document.body.appendChild(result);

      // Animate result flying to right
      setTimeout(() => {
        result.style.left = window.innerWidth + "px";
      }, 100);

      setTimeout(() => {
        result.remove();
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
        id="gateInput"
        type="text"
        placeholder="Enter binary (e.g. 111 or 101)"
      />
      <div ref={gateRef} id="gateBox">
        Gate Detection
      </div>
    </>
  );
}
