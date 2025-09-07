import { useContext } from "react";
import Flow from "../Flows/FlowArrayToSingle";
import { Context } from "../Context/Context";

export default function LetterMerger() {

  const { stage, data } = useContext(Context);

  // Input is an array of letters

  const input = data[stage] ? data[stage].input : [...data[stage - 1].output];

  // Join letters into a single string
  const output = data[stage] ? data[stage].output : [input.join("")];

  return (
    <Flow input={input} convertor="Letter Merger" output={output} />
  );
}

