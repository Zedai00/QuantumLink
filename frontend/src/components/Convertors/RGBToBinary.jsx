import { useContext } from "react";
import Flow from "../Flows/FlowArray";
import { Context } from "../Context/Context";

export default function RGBToBinary() {
  const { stage, stagesData, imgDim } = useContext(Context);

  return (
    <Flow
      input={stagesData[stage].input}
      convertor="RGB To Binary"
      output={stagesData[stage].output}
      width={imgDim?.width}
      height={imgDim?.height}
    />
  );
}
