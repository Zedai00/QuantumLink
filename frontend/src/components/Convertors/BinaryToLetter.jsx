import { useContext } from "react";
import Flow from "../Flows/FlowArray";
import { Context } from "../Context/Context";

export default function BinaryToLetter() {

  const { stage, data } = useContext(Context);

  // Input is the previous stage's output (array of 8-bit binary strings)
  const input = data[stage] ? [data[stage].input] : [...data[stage - 1].output];

  // Convert each 8-bit binary string back to its character
  const output = data[stage] ? data[stage].output : input.map((binaryStr) => {
    return String.fromCharCode(parseInt(binaryStr, 2));
  });

  return (
    <Flow input={input} convertor="BinaryToLetter" output={output} />
  );
}

