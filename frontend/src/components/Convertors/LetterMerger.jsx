import { useContext } from "react";
import Flow from "../Flows/FlowText/FlowArrayToSingle";
import { Context } from "../Context/Context";

export default function LetterMerger() {

  const { stage, stagesData } = useContext(Context);


  return (
    <Flow input={stagesData[stage].input} convertor="Letter Merger" output={stagesData[stage].output} />
  );
}

