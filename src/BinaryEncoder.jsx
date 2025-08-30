import React, { useState, useRef } from "react";
import "./BinaryEncoder.css"; // Move styles here

function App() {
  const [inputValue, setInputValue] = useState("");
  const encoderRef = useRef(null);

  // Convert character to binary
  const charToBinary = (char) => {
    return char.charCodeAt(0).toString(2).padStart(8, "0");
  };

  const startAnimation = () => {
    let index = 0;
    const input = inputValue;

    function nextLetter() {
      if (index >= input.length) return;

      const letter = input[index];
      const binary = charToBinary(letter);

      // Create flying letter
      const letterEl = document.createElement("div");
      letterEl.className = "letter-fly";
      letterEl.textContent = letter;
      document.body.appendChild(letterEl);

      const encoderRect = encoderRef.current.getBoundingClientRect();
      const inputBox = document.getElementById("reactInput");
      const inputRect = inputBox.getBoundingClientRect();

      // Start at input box
      letterEl.style.left = inputRect.left + "px";
      letterEl.style.top = inputRect.top + "px";
      letterEl.style.fontSize = "20px";

      // Animate into encoder
      requestAnimationFrame(() => {
        letterEl.style.left =
          encoderRect.left + encoderRect.width / 2 - 100 + "px";
        letterEl.style.top = encoderRect.top + 27 + "px";
        letterEl.style.fontSize = "30px";
      });

      // After flight -> remove and show binary output
      setTimeout(() => {
        letterEl.remove();

        const outputBox = document.createElement("div");
        outputBox.className = "output-box";
        outputBox.textContent = binary;
        document.body.appendChild(outputBox);

        const encoderRightX = encoderRect.left + encoderRect.width + 10;
        const encoderCenterY = encoderRect.top + encoderRect.height / 2 - 20;
        outputBox.style.left = encoderRightX + "px";
        outputBox.style.top = encoderCenterY + "px";

        const screenWidth = window.innerWidth;
        requestAnimationFrame(() => {
          outputBox.style.left = screenWidth + "px";
        });

        setTimeout(() => {
          outputBox.remove();
          index++;
          nextLetter();
        }, 2000);
      }, 2000);
    }

    nextLetter();
  };

  return (
    <div>
      <div className="input-area">
        <input
          id="reactInput"
          type="text"
          value={inputValue}
          placeholder="Type your message"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={startAnimation}>Encode</button>
      </div>

      <div className="encoder" ref={encoderRef}>
        Binary Encoder
      </div>
    </div>
  );
}

export default App;
