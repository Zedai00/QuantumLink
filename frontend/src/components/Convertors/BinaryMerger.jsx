import { useContext } from "react";
import Flow from "../Flows/FlowText/Flow2DToArray";
import { Context } from "../Context/Context";

export default function BinaryMerger() {
  const { stage, stagesData } = useContext(Context);

  // console.log("Input: ",stagesData[stage].input)
  // console.log("Output: ",stagesData[stage].output)

  return (
    <Flow input={stagesData[stage].input} convertor="BinaryJoiner" output={stagesData[stage].output} />
  );
}

