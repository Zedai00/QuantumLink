import { useContext } from "react";
import FlowRGBBinarySplitter from "../Flows/FlowImage/FlowRGBBinarySplitter";
import { Context } from "../Context/Context";

export default function RGBBinarySplitter() {
  const { stage, stagesData } = useContext(Context);

  return (
    <FlowRGBBinarySplitter
      input={stagesData[stage].input}
      convertor="BinarySplitter"
      output={stagesData[stage].output}
    />
  );
}
