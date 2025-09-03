import { useContext } from "react";
import Flow from "../FlowArrayTo2D";
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
    <Flow input={input} convertor="BinarySplitter" output={output} />
  );
}
