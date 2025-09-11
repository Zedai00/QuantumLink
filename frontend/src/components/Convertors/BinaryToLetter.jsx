import { useContext } from "react";
import Flow from "../Flows/FlowArray";
import { Context } from "../Context/Context";

export default function BinaryToLetter() {

  const { stage, stagesData } = useContext(Context);


  return (
    <Flow input={stagesData[stage].input} convertor="BinaryToLetter" output={stagesData[stage].output} />
  );
}

