import { useEffect, useRef } from "react";

export default function FlowImageExtractor({ input, output }) {
  console.log("Output: ", output);

  if (!input || !output) {
    return <div className="text-white">⚠️ No pixels to render</div>;
  }

  // Try to infer width/height (fallback to 32x32)
  // const width = Math.sqrt(input.length / 4) || 32;
  // const height = width;

  // // Draw original image
  // // useEffect(() => {
  // //   if (!canvasRef.current) return;

  // //   const ctx = canvasRef.current.getContext("2d");
  // //   const imgData = ctx.createImageData(width, height);

  // //   // Copy RGBA values directly
  // //   for (let i = 0; i < input.length; i += 4) {
  // //     imgData.data[i] = input[i];     // R
  // //     imgData.data[i + 1] = input[i + 1]; // G
  // //     imgData.data[i + 2] = input[i + 2]; // B
  // //     imgData.data[i + 3] = 255;      // force full alpha
  // //   }

  // //   ctx.putImageData(imgData, 0, 0);
  // // }, [input, width, height]);

  // output is a Uint8ClampedArray: [R,G,B,A,R,G,B,A,...]
  const pixelColors = output.map(([r, g, b]) => {
    const scaledR = r * 85;
    const scaledG = g * 85;
    const scaledB = b * 85;
    return `rgb(${scaledR},${scaledG},${scaledB})`;
  });

  console.log("Colors: ", pixelColors);
  return (
    <div className="relative flex justify-between items-center p-10 w-full h-screen bg-[#030313] text-white">
      {/* Left: Original */}
      <div className="flex flex-col items-center">
        <h3 className="mb-2">Original</h3>
        {/* <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-cyan-400 w-32 h-32"
        /> */}

        <img src={input} width={150} height={150} />
      </div>

      {/* Middle: Pixel Extractor */}
      <div className="flex items-center justify-center w-40 h-20 border border-cyan-400 bg-[#111827] rounded">
        Pixel Extractor
      </div>

      <div className="grid grid-cols-50 gap-1 max-w-[400px] ">
        {pixelColors.map((color, i) => (
          <div
            key={i}
            className="w-1 h-1 border border-gray-700"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
