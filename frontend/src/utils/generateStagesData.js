import { resizeImageToData, pixelsToBinary } from "./imageUtils";
import { splitBinaryIntoPairs } from "./binaryUtils";

export const generateStagesData = async (inputMsg) => {
  let letters = [];
  let binary = [];
  let binarySplit = [];

  if (inputMsg.type === "text") {
    letters = inputMsg.content.split("");
    binary = letters.map((l) => l.charCodeAt(0).toString(2).padStart(8, "0"));
    binarySplit = splitBinaryIntoPairs(binary);
  }

  if (inputMsg.type === "image") {
  binarySplit = inputMsg.content; // already binarySplit
}

  // Gates mapping
  const gates = binarySplit.map((item) =>
    item.map((pair) => {
      switch (pair) {
        case "00": return "I";
        case "01": return "X";
        case "10": return "Z";
        case "11": return "XZ";
        default: return "I";
      }
    })
  );

  const blochVisual = gates.flat();
  const gatesBack = blochVisual.map((g) => {
    switch (g) {
      case "I": return "00";
      case "X": return "01";
      case "Z": return "10";
      case "XZ": return "11";
      default: return "00";
    }
  });

  // Merge back into chunks
  const chunkSize = 4;
  const binary2D = [];
  for (let i = 0; i < gatesBack.length; i += chunkSize) {
    binary2D.push(gatesBack.slice(i, i + chunkSize));
  }

  const mergedBinary = binary2D.map((group) => group.join(""));
  const lettersBack = mergedBinary.map((b) =>
    String.fromCharCode(parseInt(b, 2))
  );
  const mergedText = lettersBack.join("");

  const { content: data, sender } = inputMsg;

  return [
    { stage: 0, sender, input: data, output: data },
    { stage: 1, sender, input: data, output: letters },
    { stage: 2, sender, input: letters, output: binary },
    { stage: 3, sender, input: binary, output: binarySplit },
    { stage: 4, sender, input: binarySplit, output: gates },
    { stage: 5, sender, input: gates.flat(), output: blochVisual },
    { stage: 6, sender, input: blochVisual, output: gatesBack },
    { stage: 7, sender, input: binary2D, output: mergedBinary },
    { stage: 8, sender, input: mergedBinary, output: lettersBack },
    { stage: 9, sender, input: lettersBack, output: mergedText },
    { stage: 10, sender, input: data, output: data },
  ];
};
