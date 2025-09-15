import { useContext } from "react";
import Flow from "../Flows/FlowText/Flow2DToArray";
import { Context } from "../Context/Context";

export default function BinaryMerger() {
  const { stage, stagesData } = useContext(Context);


  return (
    <Flow input={stagesData[stage].input} convertor="BinaryJoiner" output={stagesData[stage].output} />
  );
}

