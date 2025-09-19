import { useContext } from "react";
import FlowRGBToPixels from "../Flows/FlowImage/FlowRGBToPixels";
import { Context } from "../Context/Context";

export default function RGBToPixels() {
  const { stage, stagesData, imgDim} = useContext(Context);

  return (
    <FlowRGBToPixels
      input={stagesData[stage]?.input}
      convertor="Pixel To RGB"
      output={stagesData[stage]?.output}
      width={imgDim?.width}
      height={imgDim?.height}
    />
  );
}
