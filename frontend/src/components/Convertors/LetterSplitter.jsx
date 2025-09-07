import { useContext } from "react";
import Flow from "../Flows/FlowSingleToArray";
import { Context } from "../Context/Context";

export default function LetterSplitter() {

  const { stage, data } = useContext(Context)

  const input = data[stage - 1] ? data[stage - 1].output : data[stage].input
  const output = input.split("")

  return (
    <Flow input={input} convertor="Letter Splitter" output={output} />
  );
}
