import { useContext } from "react";
import Flow from "../Flow";
import { Context } from "../Context";

export default function LetterSplitter() {

  const { stage, data } = useContext(Context)

  const input = data[stage].input
  const output = data[stage].input[0].split("")

  return (
    <Flow input={input} convertor="Letter Splitter" output={output} />
  );
}
