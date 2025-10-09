import { useContext } from "react";
import FlowImageResizer from "../Flows/FlowImage/FlowImageExtractor";
import { Context } from "../Context/Context";

export default function ImageResizerPixelExtractor() {
  const { stage, stagesData, imgData, imgDim } = useContext(Context);

  return (
    <FlowImageResizer
      input={imgData}
      output={stagesData[stage].output}
      width={imgDim?.width}
      height={imgDim?.height}
    />
  );
}
