import { useContext, useMemo } from "react";
import Flow from "../Flow";
import { Context } from "../Context";

export default function LetterSplitter() {

  const { stage, data } = useContext(Context)

  const currentData = data[stage] || { input: [] }
  const output = useMemo(() => {
    return currentData.input
  }, [currentData.input])

  const input = currentData.input

  return (
    <Flow input={input} convertor="Letter Splitter" output={output} />
  );
}
