import { useContext } from "react";
import Flow from "../Flow2D";
import { Context } from "../Context";

export default function BinaryToGate() {

  const { stage, data } = useContext(Context)

  const input = data[stage] ? [data[stage].input] : [...data[stage - 1].output]
  console.log(input)
  const output = data[stage] ? data[stage].output : input.map((item) => {
    return item.map((letter) => {
      switch (letter) {
        case "00":
          return "I"
        case "01":
          return "X"
        case "10":
          return "Z"
        case "11":
          return "XZ"
        default:
          return "I"
      }
    })
  })
  console.log(output)


  return (
    <Flow input={input} convertor="BinaryToGate" output={output} />
  );
}
