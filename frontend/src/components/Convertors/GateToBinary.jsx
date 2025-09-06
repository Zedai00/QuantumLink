import { useContext } from "react";
import Flow from "../FlowArray";
import { Context } from "../Context";

export default function GateToBinary() {

  const { stage, data } = useContext(Context)

  const input = data[stage] ? [data[stage].input] : [...data[stage - 1].output]
  console.log(input)
  const output = data[stage] ? data[stage].output : input.map((item) => {
    switch (item) {
      case "I":
        return "00"
      case "X":
        return "01"
      case "Z":
        return "10"
      case "XZ":
        return "11"
      default:
        return "00"
    }
  })
  console.log(output)


  return (
    <Flow input={input} convertor="GateToBinary" output={output} />
  );
}
