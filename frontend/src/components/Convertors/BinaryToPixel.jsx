import { useContext } from "react";
import { Context } from "../Context/Context";

export default function BinaryToPixel() {
  const { stage, stagesData } = useContext(Context);
  const currentStage = stagesData[stage];

  if (!currentStage) return null;

  // Convert binary chunks back to RGB values
  const pixels = currentStage.output.map((row) =>
    row.map((binStr) => {
      // Split 2-bit chunks into R, G, B
      const r = parseInt(binStr.slice(0, 8), 2) || 0;
      const g = parseInt(binStr.slice(8, 16), 2) || 0;
      const b = parseInt(binStr.slice(16, 24), 2) || 0;
      return [r, g, b];
    })
  );

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-white text-lg mb-2">Binary to Pixel</h2>
      <canvas
        width={pixels[0]?.length || 32}
        height={pixels.length || 32}
        ref={(canvas) => {
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          const imgData = ctx.createImageData(canvas.width, canvas.height);
          let i = 0;
          for (let y = 0; y < pixels.length; y++) {
            for (let x = 0; x < pixels[y].length; x++) {
              const [r, g, b] = pixels[y][x];
              imgData.data[i++] = r;
              imgData.data[i++] = g;
              imgData.data[i++] = b;
              imgData.data[i++] = 255;
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }}
        className="border border-cyan-400"
      />
    </div>
  );
}
