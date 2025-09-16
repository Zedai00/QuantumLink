import { useContext } from "react";
import FlowPixelsToImage from "../Flows/FlowImage/FlowPixelsToImage";
import { Context } from "../Context/Context";

export default function PixelsToImage() {
  const { stage, stagesData, imgDim } = useContext(Context);

  console.log(stagesData[stage].input)

  return (
    <FlowPixelsToImage
      input={stagesData[stage].input}
      output={stagesData[stage].output}
      width={imgDim?.width}
      height={imgDim?.height}
    />
  );
}
