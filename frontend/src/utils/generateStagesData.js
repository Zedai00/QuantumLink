import { useContext } from "react";
import { Context } from "../components/Context/Context";

export const generateStagesData = (inputMsg) => {

  const {setImgDim, setImgData} = useContext(Context);

  let binarySplit = [];
  let letters = [];
  let binary = [];
  let rgbPixels = []; // original rgb pixels from upload (array of [r,g,b])
  let pixelBinary = [];

  // TEXT PATH
  if (inputMsg.type === "text") {
    // Split text into letters
    letters = inputMsg.content.split("");
    // Convert letters to 8-bit binary
    binary = letters.map((l) =>
      l.charCodeAt(0).toString(2).padStart(8, "0")
    );
    // Split binary into 2-bit rows of length 4 -> [[..4..], [..4..], ...]
    binarySplit = binary.map((item) =>
      item.match(/.{1,2}/g) // results in array of four 2-bit strings
    );
  }

  // IMAGE PATH
  if (inputMsg.type === "image") {
    const { b64Img, content: pixels, width, height } = inputMsg;

    setImgData(b64Img);
    setImgDim({ width, height });

    // build rgbPixels (flat per-pixel [r,g,b]) and binary arrays
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // Save for rendering (skip alpha)
      rgbPixels.push([r, g, b]);

      // Convert channels → 8-bit binary strings
      const rBin = r.toString(2).padStart(8, "0");
      const gBin = g.toString(2).padStart(8, "0");
      const bBin = b.toString(2).padStart(8, "0");

      // For the "binary" stage we store a single 24-bit string per pixel
      binary.push(rBin + gBin + bBin);

      // Split 24-bit into 2-bit chunks (12 chunks) and turn into rows of 4 (3 rows per pixel)
      const pixelChunks = (rBin + gBin + bBin).match(/.{1,2}/g) || [];
      // push as rows of 4
      for (let k = 0; k < pixelChunks.length; k += 4) {
        binarySplit.push(pixelChunks.slice(k, k + 4)); // keeps binarySplit as array of rows-of-4
      }
    }

    pixelBinary = [...binarySplit]; // keep for later if needed
  }

  // rgbValues = original rgb strings for display stages
  const rgbValues = rgbPixels.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);

  // Convert binary/pixels to quantum gates (each row -> gate row)
  // gates: array-of-rows (each row is array of gate strings)
  const gates = binarySplit.map((row) =>
    row.map((b) => {
      switch (b) {
        case "00":
          return "I";
        case "01":
          return "X";
        case "10":
          return "Z";
        case "11":
          return "XZ";
        default:
          return "I";
      }
    })
  );

  // Flatten gates for Bloch visualization
  const blochVisual = [...gates.flat()];

  // Convert back from gates to binary (flat sequence of 2-bit strings)
  const gatesBack = blochVisual.map((g) => {
    switch (g) {
      case "I":
        return "00";
      case "X":
        return "01";
      case "Z":
        return "10";
      case "XZ":
        return "11";
      default:
        return "00";
    }
  });

  // Re-chunk gatesBack into rows of 4 (binary2D), same shape you had before
  const chunkSize = 4;
  const binary2D = [];
  for (let i = 0; i < gatesBack.length; i += chunkSize) {
    binary2D.push(gatesBack.slice(i, i + chunkSize));
  }

  // For text pipeline: merge 4-chunk groups into bytes and reconstruct letters
  const mergedBinary = binary2D.map((group) => group.join("")); // each is 8-bit string
  const lettersBack = mergedBinary.map((bStr) =>
    String.fromCharCode(parseInt(bStr, 2))
  );
  const mergedText = lettersBack.join("");

  // --- IMAGE: reconstruct pixels from binary2D ---
  // binary2D currently is an array of rows of 4 two-bit strings.
  // For the image path we grouped original pixels into 3 rows per pixel (R,G,B),
  // so we must group every 3 rows into one pixel.
  let pixelsBack = []; // will be array of [r,g,b]
  let rgbValuesBack = []; // will be array of "rgb(r,g,b)" strings

  if (inputMsg.type === "image") {
    for (let i = 0; i < binary2D.length; i += 3) {
      const rRow = (binary2D[i] || []).join(""); // 8-bit string for R
      const gRow = (binary2D[i + 1] || []).join(""); // 8-bit string for G
      const bRow = (binary2D[i + 2] || []).join(""); // 8-bit string for B

      // ensure we have full 8-bit strings; fallback to zeros if missing
      const rBits = rRow.padEnd(8, "0");
      const gBits = gRow.padEnd(8, "0");
      const bBits = bRow.padEnd(8, "0");

      const R = parseInt(rBits, 2);
      const G = parseInt(gBits, 2);
      const B = parseInt(bBits, 2);

      pixelsBack.push([R, G, B]);
      rgbValuesBack.push(`rgb(${R}, ${G}, ${B})`);
    }
  }

  // Build stage snapshots (same stage indices you used)
  if (inputMsg.type === "text") {
    return [
      { stage: 0, input: inputMsg, output: inputMsg.content }, // AliceChat
      { stage: 1, input: inputMsg.content, output: letters }, // LetterSplitter
      { stage: 2, input: letters, output: binary }, // LetterToBinary
      { stage: 3, input: binary, output: binarySplit }, // BinarySplitter (array-of-rows)
      { stage: 4, input: binarySplit, output: gates }, // BinaryToGate
      { stage: 5, input: gates.flat(), output: blochVisual }, // BlochPage
      { stage: 6, input: blochVisual, output: gatesBack }, // GateToBinary
      { stage: 7, input: binary2D, output: mergedBinary }, // BinaryMerger
      { stage: 8, input: mergedBinary, output: lettersBack }, // BinaryToLetter
      { stage: 9, input: lettersBack, output: mergedText }, // LetterMerger
      { stage: 10, input: inputMsg.content, output: inputMsg.content }, // BobChat
    ];
  }

  if (inputMsg.type === "image") {
    return [
      { stage: 0, input: inputMsg, output: inputMsg.content, b64Img: inputMsg.b64Img }, // AliceChat
      { stage: 1, input: inputMsg.content, output: rgbPixels }, // ImageResizerPixelExtractor (raw pixels)
      { stage: 2, input: rgbPixels, output: rgbValues }, // PixelToRGB (display strings)
      { stage: 3, input: rgbValues, output: binary }, // RGBToBinary (24-bit per pixel strings)
      { stage: 4, input: binary, output: binarySplit }, // BinarySplitter (rows of 4)
      { stage: 5, input: binarySplit, output: gates }, // BinaryToGate
      { stage: 6, input: gates.flat(), output: blochVisual }, // BlochPage
      { stage: 7, input: blochVisual, output: gatesBack }, // GateToBinary
      { stage: 8, input: gatesBack, output: binary2D }, // BinaryMerger (re-chunked rows of 4)
      { stage: 9, input: binary2D, output: pixelsBack }, // BinaryToPixel (reconstructed [r,g,b] arrays)
      { stage: 10, input: pixelsBack, output: rgbValuesBack }, // ImageReconstructor / BobChat (final rgb strings)
    ];
  }

  // fallback
  return [];
};
