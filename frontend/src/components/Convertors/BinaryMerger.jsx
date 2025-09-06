import { useContext } from "react";
import Flow from "../Flow2DToArray";
import { Context } from "../Context";

export default function BinaryJoiner() {
  const { stage, data } = useContext(Context);

  // Get input from current stage or previous stage output
  const input1D = data[stage] ? data[stage].input : [...data[stage - 1].output];

  // Convert 1D input to 2D array
  const chunkSize = 4; // every 4 items → 1 group
  const input2D = [];
  for (let i = 0; i < input1D.length; i += chunkSize) {
    input2D.push(input1D.slice(i, i + chunkSize));
  }

  // Combine each group into single 8-bit string as output
  const output = input2D.map(group => group.join(""));

  console.log("2D Input:", input2D);
  console.log("Output:", output);

  return (
    <Flow input={input2D} convertor="BinaryJoiner" output={output} />
  );
}

