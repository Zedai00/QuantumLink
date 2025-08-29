import { useContext } from "react";
import Flow from "../Flow";
import { Context } from "../Context";

export default function BinarySplitter() {

  const { stage, data } = useContext(Context)

  const input = data[stage] ? data[stage].input : [...data[stage - 1].output].reverse()
  const output = data[stage] ? data[stage].output : input.map((item) => {
    return item.split("")
  })

  return (
    <Flow input={input} convertor="LetterToBinary" output={output} />
  );
}
