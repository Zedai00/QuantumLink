import { useContext } from "react";
import Flow from "../Flows/FlowArray";
import { Context } from "../Context/Context";

export default function RGBToBinary() {
  const { stage, stagesData } = useContext(Context);

  return (
    <Flow
      input={stagesData[stage].input.slice(0, 30)}
      convertor="RGB To Binary"
      output={stagesData[stage].output}
    />
  );
}
