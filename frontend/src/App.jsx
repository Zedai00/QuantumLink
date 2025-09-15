import { useState, useRef } from "react";
import { animate } from "animejs";
import LetterSplitter from "./components/Convertors/LetterSplitter";
import { Context } from "./components/Context/Context";
import LetterToBinary from "./components/Convertors/LetterToBinary";
import BinarySplitter from "./components/Convertors/BinarySplitter";
import RGBBinarySplitter from "./components/Convertors/RGBBinarySplitter";
import BinaryToGate from "./components/Convertors/BinaryToGate";
import BlochPage from "./components/Convertors/BlochPage";
import GateToBinary from "./components/Convertors/GateToBinary";
import BinaryMerger from "./components/Convertors/BinaryMerger";
import BinaryToLetter from "./components/Convertors/BinaryToLetter";
import ImageResizerPixelExtractor from "./components/Convertors/ImageResizerPixelExtractor";
import LetterMerger from "./components/Convertors/LetterMerger";
import RGBToBinary from "./components/Convertors/RGBToBinary";
import RGBToPixels from "./components/Convertors/RGBToPixels";
import QuantumCompletion from "./components/QuantumCompletion";
import PixelsToImage from "./components/Convertors/ImageReconstructor";
import BinaryToRGB from "./components/Convertors/BinaryToRGB";
import AliceChat from "./components/Chats/AliceChat";
import BobChat from "./components/Chats/BobChat";
import Circuit from "./components/Convertors/Circuit";
import PixelsToRGB from "./components/Convertors/PixelToRGB";

export default function App() {
  const [stage, setStage] = useState(0);
  const [stages, setStages] = useState([AliceChat]);
  const [imgData, setImgData] = useState();
  const [imgDim, setImgDim] = useState({});
  const [complete, setComplete] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [animateState, setAnimateState] = useState(true);
  const [stagesData, setStagesData] = useState([]);
  const [circuitView, setCircuitView] = useState(false); // Toggle Bloch <-> Circuit
  const containerRef = useRef(null);

  const textStages = [
    AliceChat,
    LetterSplitter,
    LetterToBinary,
    BinarySplitter,
    BinaryToGate,
    BlochPage,
    GateToBinary,
    BinaryMerger,
    BinaryToLetter,
    LetterMerger,
    BobChat,
  ];

  const imageStages = [
    AliceChat,
    ImageResizerPixelExtractor,
    PixelsToRGB,
    RGBToBinary,
    RGBBinarySplitter,
    BinaryToGate,
    BlochPage,
    GateToBinary,
    BinaryMerger,
    BinaryToRGB,

    RGBToPixels,

    PixelsToImage,
    // ImagePreview,
    BobChat,
  ];

  const transitionStage = (nextStage) => {
    if (!containerRef.current) return;

    animate(containerRef.current, {
      opacity: [1, 0],
      scale: [1, 0.96],
      filter: ["blur(0px)", "blur(10px)"],
      duration: 350,
      ease: "inOutSine",
    }).then(() => {
      setStage(nextStage);

      animate(containerRef.current, {
        opacity: [0, 1],
        scale: [0.96, 1],
        filter: ["blur(10px)", "blur(0px)"],
        duration: 400,
        ease: "outExpo",
      });
    });
  };

  const handleLastStage = () => {
    setTimeout(() => {
      setComplete(true);
    }, 8000);
  };

  const handleChatComplete = (userInput) => {
    // Pick pipeline based on input type
    const stagesPipeline = userInput.type === "text" ? textStages : imageStages;
    setStages(stagesPipeline);

    // Generate stage snapshots
    const data = generateStagesData(userInput);
    setStagesData(data);

    // Start the first transition
    transitionStage(1);
  };

  const handleOnComplete = () => {
    if (stage >= stages.length - 1) {
      handleLastStage();
      return;
    }
    transitionStage(stage + 1);
  };

  const handlePrev = () => {
    if (stage <= 0) return;
    if (stage === 1 && !imgData) setStagesData("");
    transitionStage(stage - 1);
  };

  const handleNext = () => {
    if (stage >= stages.length - 1) {
      setStagesData("");
      handleLastStage();
      return;
    }
    transitionStage(stage + 1);
  };

  const splitBinTo2 = (binary) => {
    return binary.map((item) =>
      item.split("").reduce((acc, char, index) => {
        if (index % 2 === 0) acc.push("");
        acc[acc.length - 1] += char;
        return acc;
      }, [])
    );
  };

  const generateStagesData = (inputMsg) => {
    let binarySplit = [];
    let letters = [];
    let binary = [];
    let rgbPixels = [];
    let pixelBinary = [];

    if (inputMsg.type === "text") {
      // Split text into letters
      letters = inputMsg.content.split("");
      // Convert letters to 8-bit binary
      binary = letters.map((l) => l.charCodeAt(0).toString(2).padStart(8, "0"));
      // Split binary into pairs
      binarySplit = splitBinTo2(binary);
    }

    if (inputMsg.type === "image") {
      const { b64Img, content: pixels, width, height } = inputMsg;

      setImgData(b64Img);
      setImgDim({ width, height });

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Save for rendering (skip alpha)
        rgbPixels.push([r, g, b]);

        // Convert channels → 8-bit binary
        const rBin = r.toString(2).padStart(8, "0");
        const gBin = g.toString(2).padStart(8, "0");
        const bBin = b.toString(2).padStart(8, "0");

        binary.push(rBin + gBin + bBin);

        // Split into 2-bit chunks
        const pixelChunks =
          (rBin + gBin + bBin).slice(0, 8).match(/.{1,2}/g) || [];
        for (let k = 0; k < pixelChunks.length; k += 4) {
          binarySplit.push(pixelChunks.slice(k, k + 4));
        }
      }

      binarySplit = binarySplit.slice(0, 20);

      pixelBinary = [...binarySplit]; // for later stages
    }

    // Reduced Values
    const rgbValues = rgbPixels
      // .slice(0, 20)
      .map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
    const reducedImgBin = binary.slice(0, 20);

    const b8Bin = reducedImgBin.map((b) => b.slice(0, 8));
    const b8BinSplit = splitBinTo2(b8Bin);

    // console.log("Step1 Pixels:", pixelBinary);
    // console.log("Step2 Binary:", binary);
    // console.log("Step3 Split:", binarySplit);
    // console.log("Step4 RGB Output:", b8Bin);
    // console.log("Step4 RGB Output:", b8BinSplit);

    // Convert binary/pixels to quantum gates
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

    // Convert back from gates to binary
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

    // Prepare binary 2D and merge for text reconstruction
    const chunkSize = 4;
    const binary2D = [];
    for (let i = 0; i < gatesBack.length; i += chunkSize) {
      binary2D.push(gatesBack.slice(i, i + chunkSize));
    }
    const mergedBinary = binary2D.map((group) => group.join(""));
    const lettersBack = mergedBinary.map((bStr) =>
      String.fromCharCode(parseInt(bStr, 2))
    );
    const mergedText = lettersBack.join("");

    const { content: data } = inputMsg;

    if (inputMsg.type === "text") {
      return [
        { stage: 0, input: inputMsg, output: data }, // AliceChat
        { stage: 1, input: data, output: letters }, // LetterSplitter
        { stage: 2, input: letters, output: binary }, // LetterToBinary
        { stage: 3, input: binary, output: binarySplit }, // BinarySplitter
        { stage: 4, input: binarySplit, output: gates }, // BinaryToGate
        { stage: 5, input: gates.flat(), output: blochVisual }, // BlochPage
        { stage: 6, input: blochVisual, output: gatesBack }, // GateToBinary
        { stage: 7, input: binary2D, output: mergedBinary }, // BinaryMerger
        { stage: 8, input: mergedBinary, output: lettersBack }, // BinaryToLetter
        { stage: 9, input: lettersBack, output: mergedText }, // LetterMerger
        { stage: 10, input: data, output: data }, // BobChat
      ];
    }

    if (inputMsg.type === "image") {
      return [
        // { stage: 0, sender, input: data, output: data }, // AliceChat
        { stage: 0, input: inputMsg, output: data }, // AliceChat
        { stage: 1, input: data, output: rgbPixels }, // ImageResizerPixelExtractor
        { stage: 2, input: rgbPixels, output: rgbValues }, // PixelToRGB
        { stage: 3, input: rgbValues, output: reducedImgBin }, // RGBToBinary
        { stage: 4, input: b8Bin, output: b8BinSplit }, // BinarySplitter
        { stage: 5, input: b8BinSplit, output: gates }, // BinaryToGate
        { stage: 6, input: gates.flat(), output: blochVisual }, // BlochPage
        { stage: 7, input: blochVisual, output: gatesBack }, // GateToBinary
        { stage: 8, input: binary2D, output: mergedBinary }, // BinaryMerger
        { stage: 9, input: reducedImgBin, output: rgbValues }, // BinaryToRGB

        { stage: 10, input: rgbValues, output: rgbPixels }, // RGBToPixels

        { stage: 11, input: data, output: data }, // ImageReconstructor / BobChat
      ];
    }
  };

  const handleRestart = () => {
    setComplete(false);
    setStagesData([]);
    setStage(0);
    setCircuitView(false);
  };

  const isBlochPage = stages[stage] === BlochPage;
  const StageToRender = isBlochPage && circuitView ? Circuit : stages[stage];

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen flex flex-col justify-center items-center"
    >
      {/* Bloch <-> Circuit Toggle */}
      {isBlochPage && (
        <button
          onClick={() => setCircuitView((prev) => !prev)}
          className="absolute top-5 right-5 px-4 py-2 bg-[#7f00ff] text-white rounded-md shadow-md hover:bg-[#a14cff] transition z-50"
        >
          {circuitView ? "Back to Bloch" : "Go to Circuit"}
        </button>
      )}

      {/* Speed Slider */}
      {stage !== 0 && stage !== stages.length - 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white z-50">
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(+e.target.value)}
            className="w-64 h-2 rounded-full appearance-none cursor-pointer
              bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600
              shadow-[0_0_15px_rgba(0,255,255,0.6)]
              border border-cyan-300/40
              backdrop-blur-md
              accent-cyan-500"
            style={{ WebkitAppearance: "none" }}
          />
          <span
            className="text-cyan-300 font-bold text-lg px-3 py-1 rounded-lg
            bg-[#0f0f1f]/70 border border-cyan-400/30
            shadow-[0_0_15px_rgba(0,255,255,0.6)]
            backdrop-blur-md"
          >
            {speed}x
          </span>
        </div>
      )}

      {/* Prev / Play / Next Buttons */}
      {stage !== 0 && stage !== stages.length - 1 && !complete && (
        <div
          className="absolute top-2 left-[50%-h-15] flex items-center gap-3 z-50 h-15 w-auto rounded-2xl p-5
          bg-gradient-to-r from-[#0f0f1f] via-[#111827] to-[#1a1a2e]
          border border-cyan-400/30
          shadow-[0_0_25px_rgba(0,255,255,0.4)]
          backdrop-blur-md
          text-white"
        >
          <button
            className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]
              text-cyan-300 border border-cyan-400/50
              shadow-[0_0_15px_rgba(0,255,255,0.5)]
              hover:shadow-[0_0_25px_rgba(0,255,255,0.8)]
              transition-all duration-300"
            onClick={handlePrev}
          >
            Prev
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#2d0f2d] via-[#3b0f3b] to-[#1a001a]
              text-pink-400 border border-pink-400/50
              shadow-[0_0_15px_rgba(255,0,255,0.5)]
              hover:shadow-[0_0_25px_rgba(255,0,255,0.8)]
              transition-all duration-300"
            onClick={() => setAnimateState((prev) => !prev)}
          >
            {animateState ? "Pause" : "Play"}
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]
              text-cyan-300 border border-cyan-400/50
              shadow-[0_0_15px_rgba(0,255,255,0.5)]
              hover:shadow-[0_0_25px_rgba(0,255,255,0.8)]
              transition-all duration-300"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      )}

      {/* Stage Indicator */}
      {stage !== 0 && stage !== stages.length - 1 && !complete && (
        <div
          className="absolute top-4 left-4 px-4 py-2 text-lg font-semibold rounded-xl
          bg-gradient-to-br from-[#111827] via-[#1a1a2e] to-[#0f0f1f]
          text-cyan-300 border border-cyan-400/40
          shadow-[0_0_20px_rgba(0,255,255,0.5)]
          backdrop-blur-md z-50"
        >
          Stage {stage} / {stages.length - 1}
        </div>
      )}

      {/* Render Current Stage */}
      {complete ? (
        <QuantumCompletion
          decodedMessage={
            !imgData ? (
              stagesData[0].input.content
            ) : (
              <img src={stagesData[0].input.b64Img} width={100} height={100} />
            )
          }
          onRestart={handleRestart}
        />
      ) : (
        <Context.Provider
          value={{
            stage,
            imgData,
            imgDim,
            stages,
            stagesData,
            speed,
            animate: animateState,
            onComplete: handleOnComplete,
            onChatComplete: handleChatComplete,
          }}
        >
          <StageToRender />
        </Context.Provider>
      )}
    </div>
  );
}
