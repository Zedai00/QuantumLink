import { useContext } from "react";
import FlowRGBBinarySplitter from "../Flows/FlowArrayTo2D";
import { Context } from "../Context/Context";

export default function RGBBinarySplitter() {
  const { stage, stagesData } = useContext(Context);

  return (
    <FlowRGBBinarySplitter
      input={stagesData[stage].input.slice(0, 10)}
      convertor="BinarySplitter"
      output={stagesData[stage].output.slice(0, 10)}
    />
  );
}
