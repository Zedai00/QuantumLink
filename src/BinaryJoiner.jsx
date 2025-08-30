import React, { useEffect, useRef } from "react";
import "./BinaryJoiner.css";

export default function BinaryJoiner() {
  const inputRef = useRef(null);
  const joinerRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    const joiner = joinerRef.current;

    function animateJoiner(binaries) {
      const rect = joiner.getBoundingClientRect();
      let created = [];

      binaries.forEach((binary, index) => {
        const fly = document.createElement("div");
        fly.className = "fly-in";
        fly.textContent = binary;
        fly.style.left = "20px";
        fly.style.top = `${40 + index * 30}px`;
        document.body.appendChild(fly);

        setTimeout(() => {
          fly.style.left = rect.left + rect.width / 2 + "px";
          fly.style.top = rect.top + rect.height / 2 + "px";
        }, 100);

        setTimeout(() => {
          fly.remove();
          created.push(binary);

          if (created.length === binaries.length) {
            showJoined(created.join(""), rect);
          }
        }, 2000 + index * 500);
      });
    }

    function showJoined(joined, rect) {
      const output = document.createElement("div");
      output.className = "joined-output";
      output.textContent = joined;
      output.style.left = rect.left + rect.width / 2 + "px";
      output.style.top = rect.top + rect.height / 2 + "px";
      document.body.appendChild(output);

      setTimeout(() => {
        output.style.left = window.innerWidth + "px";
      }, 100);

      setTimeout(() => {
        output.remove();
      }, 3000);
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const parts = input.value.trim().split(" ");
        if (parts.every((p) => /^[01]+$/.test(p))) {
          animateJoiner(parts);
        } else {
          alert("Enter valid binary parts separated by spaces (e.g. 101 110 111)");
        }
        input.value = "";
      }
    });
  }, []);

  return (
    <>
      <input
        ref={inputRef}
        id="binaryJoinerInput"
        type="text"
        placeholder="Enter binaries (e.g. 101 110 111)"
      />
      <div ref={joinerRef} id="joiner">
        Binary Joiner
      </div>
    </>
  );
}
