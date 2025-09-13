import { useContext } from "react";
import { Context } from "../Context/Context";

export default function PixelToBinary() {
  const { stage, stagesData } = useContext(Context);
  const currentStage = stagesData[stage];

  if (!currentStage) return null;

  return (
    <div className="flex flex-col items-center text-white">
      <h2 className="text-lg mb-2">Pixel to Binary</h2>
      <div className="overflow-auto max-h-80 w-80 border border-cyan-400 p-2 rounded-lg bg-[#111827]">
        {currentStage.output.map((row, i) => (
          <div key={i} className="flex gap-1 text-xs">
            {row.map((binaryChunk, j) => (
              <span key={j} className="px-1 bg-[#1a1a2e] rounded">
                {binaryChunk}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
