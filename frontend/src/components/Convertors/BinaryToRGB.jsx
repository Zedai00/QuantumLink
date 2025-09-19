import { useContext } from "react";
import Flow from "../Flows/FlowText/FlowArray";
import { Context } from "../Context/Context";

export default function BinaryToRGB() {
  const { stage, stagesData } = useContext(Context);

  return (
    <Flow
      input={stagesData[stage].input}
      convertor="BinaryToRGB"
      output={stagesData[stage].output}
    />
  );
}
