import { useContext } from "react";
import Flow from "../Flows/FlowText/Flow2D";
import { Context } from "../Context/Context";

export default function BinaryToGate() {

  const { stage, stagesData } = useContext(Context)



  return (
    <Flow input={stagesData[stage].input} convertor="BinaryToGate" output={stagesData[stage].output} />
  );
}
