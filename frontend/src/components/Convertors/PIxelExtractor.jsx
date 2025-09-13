import React, { useEffect, useState } from "react";

export default function PixelExtractor({ input }) {
  const [pixels, setPixels] = useState([]);

  useEffect(() => {
    if (!input || !Array.isArray(input)) return;

    // Normalize input to ensure each pixel is an array of 3 numbers
    const normalizedPixels = input.map(row =>
      row.map(pixel => {
        if (!Array.isArray(pixel)) return [0, 0, 0]; // If pixel is missing, default to black
        return [
          isNaN(pixel[0]) ? 0 : pixel[0],
          isNaN(pixel[1]) ? 0 : pixel[1],
          isNaN(pixel[2]) ? 0 : pixel[2]
        ];
      })
    );

    setPixels(normalizedPixels);
  }, [input]);

  return (
    <div className="pixel-grid">
      {pixels.map((row, i) => (
        <div key={i} className="pixel-row" style={{ display: "flex" }}>
          {row.map((pixel, j) => {
            const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            return (
              <div
                key={j}
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: color,
                  border: "1px solid #ccc"
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
