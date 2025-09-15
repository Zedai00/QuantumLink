import { useContext } from "react";
import Flow from "../Flows/FlowText/FlowArrayTo2D";
import { Context } from "../Context/Context";

export default function BinarySplitter() {

  const { stage, stagesData } = useContext(Context)


  return (
    <Flow input={stagesData[stage].input} convertor="BinarySplitter" output={stagesData[stage].output} />
  );
}
