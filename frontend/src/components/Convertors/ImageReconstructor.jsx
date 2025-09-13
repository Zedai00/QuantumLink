import { useContext } from "react";
import { Context } from "../Context/Context";

export default function ImageReconstructor() {
  const { stage, stagesData } = useContext(Context);
  const currentStage = stagesData[stage];

  if (!currentStage) return null;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-white text-lg mb-2">Reconstructed Image</h2>
      <canvas
        width={currentStage.output[0]?.length || 32}
        height={currentStage.output.length || 32}
        ref={(canvas) => {
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          const imgData = ctx.createImageData(canvas.width, canvas.height);
          let i = 0;

          for (let y = 0; y < currentStage.output.length; y++) {
            for (let x = 0; x < currentStage.output[y].length; x++) {
              const [r, g, b] = currentStage.output[y][x];
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
