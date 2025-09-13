import { useContext } from "react";
import FlowImageResizer from "../Flows/FlowImageExtractor";
import { Context } from "../Context/Context";

export default function ImageResizerPixelExtractor() {

  const { stage, stagesData, imgData } = useContext(Context)

  return (
    <FlowImageResizer input={imgData}  output={stagesData[stage] ? stagesData[stage].output : imgData}/>
  );
}
