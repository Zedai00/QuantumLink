import React, { useEffect, useRef } from "react";
import "./BinaryDecoder.css";

export default function BinaryDecoder() {
  const decoderRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const decoder = decoderRef.current;
    const inputBox = inputRef.current;

    function binaryToText(binaryStr) {
      const binaries = binaryStr.match(/.{1,8}/g) || [];
      return binaries
        .map((bin) => String.fromCharCode(parseInt(bin, 2)))
        .join("");
    }

    function animateBinary(binary) {
      const fly = document.createElement("div");
      fly.className = "fly";
      fly.textContent = binary;
      document.body.appendChild(fly);

      const startX = 30;
      const startY = window.innerHeight / 2;
      fly.style.left = startX + "px";
      fly.style.top = startY + "px";

      const decoderRect = decoder.getBoundingClientRect();
      const destX = decoderRect.left + 30;
      const destY = decoderRect.top + decoderRect.height / 2;

      requestAnimationFrame(() => {
        fly.style.left = destX + "px";
        fly.style.top = destY + "px";
      });

      setTimeout(() => {
        fly.remove();

        const outputLetter = document.createElement("div");
        outputLetter.className = "fly output";
        outputLetter.textContent = binaryToText(binary);
        document.body.appendChild(outputLetter);

        outputLetter.style.left =
          decoderRect.left + decoderRect.width / 2 + "px";
        outputLetter.style.top =
          decoderRect.top + decoderRect.height / 2 + "px";

        requestAnimationFrame(() => {
          outputLetter.style.left = window.innerWidth + "px";
        });

        setTimeout(() => {
          outputLetter.remove();
        }, 3000);
      }, 2000);
    }

    inputBox.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const binaries = inputBox.value.trim().match(/.{1,8}/g);
        if (binaries) {
          let delay = 0;
          binaries.forEach((bin) => {
            setTimeout(() => animateBinary(bin), delay);
            delay += 2500;
          });
        }
        inputBox.value = "";
      }
    });
  }, []);

  return (
    <div id="container">
      <input
        ref={inputRef}
        id="inputBox"
        type="text"
        placeholder="Enter binary (e.g. 01001000)"
      />
      <div ref={decoderRef} id="decoder">
        Binary Decoder
      </div>
    </div>
  );
}
