import { useContext } from "react";
import Flow from "../Flows/FlowSingleToArray";
import { Context } from "../Context/Context";

export default function LetterSplitter() {

  const { stage, stagesData } = useContext(Context)


  return (
    <Flow input={stagesData[stage].input} convertor="Letter Splitter" output={stagesData[stage].output} />
  );
}
