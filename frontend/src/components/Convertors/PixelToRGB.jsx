import { useContext } from "react";
import FlowRGBValues from "../Flows/FlowImage/FlowRGBValues";
import { Context } from "../Context/Context";

export default function PixelToRGB() {
  const { stage, stagesData, imgDim} = useContext(Context);

  return (
    <FlowRGBValues
      input={stagesData[stage]?.input}
      convertor="Pixel To RGB"
      output={stagesData[stage]?.output}
      width={imgDim?.width}
      height={imgDim?.height}
    />
  );
}
