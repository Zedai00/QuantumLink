import React, { useRef, useEffect } from "react";

export default function SineWave({
  width = 500,
  height = 150,
  amplitude = 20,
  frequency = 0.02,
  speed = 2,
  hideStart = 50, // pixels to hide at the start
  color = "#38bdf8",
}) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;

      for (let x = hideStart; x <= width; x++) {
        const y = height / 2 + amplitude * Math.sin(frequency * (x - Date.now() * speed * 0.1));
        if (x === hideStart) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [width, height, amplitude, frequency, speed, hideStart, color]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ display: "block" }} />;
}

