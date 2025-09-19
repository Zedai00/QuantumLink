import { useContext } from "react";
import Flow from "../Flows/FlowText/FlowArray";
import { Context } from "../Context/Context";

export default function LetterToBinary() {
  const { stage, stagesData } = useContext(Context);

  return (
    <Flow
      input={stagesData[stage].input}
      convertor="LetterToBinary"
      output={stagesData[stage].output}
    />
  );
}
