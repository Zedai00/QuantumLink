import { useContext } from "react";
import Flow2 from "../Flow2";
import { Context } from "../Context";

export default function BinarySplitter() {

  const { stage, data } = useContext(Context)

  const input = data[stage] ? data[stage].input : [...data[stage - 1].output].reverse()
  const output = data[stage] ? data[stage].output : input.map((item) => {
    return item.split("").reduce((acc, char, index) => {
      if (index % 2 === 0) acc.push('');
      acc[acc.length - 1] += char;
      return acc;
    }, [])
  })

  return (
    <Flow2 input={input} convertor="LetterToBinary" output={output} />
  );
}
