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
import SuperdenseCompletion from "./components/SuperdenseCompletion";
import RGBToBinary from "./components/Convertors/RGBToBinary";
import RGBToPixels from "./components/Convertors/RGBToPixels";
import PixelsToImage from "./components/Convertors/PixelsToImage";
import BinaryToRGB from "./components/Convertors/BinaryToRGB";
import AliceChat from "./components/Chats/AliceChat";
import BobChat from "./components/Chats/BobChat";
import Circuit from "./components/Convertors/Circuit";
import PixelsToRGB from "./components/Convertors/PixelToRGB";

import "./App.css";

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

  const [settings, setSettings] = useState({
    errorRate: 0,
    noiseMode: "depolarizing",
  });
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
    BobChat,
  ];

  const [hidden, setHidden] = useState(false);

  const transitionStage = (nextStage) => {
    setHidden(true); // fade out
    setTimeout(() => {
      setStage(nextStage); // swap after fade
      setHidden(false); // fade in
    }, 400); // match transition duration
  };

  const handleLastStage = () => {
    setTimeout(() => {
      setComplete(true);
    }, 5000);
  };

  const splitBinTo2 = (binary) => {
    return binary.map((item) =>
      item.split("").reduce((acc, char, index) => {
        if (index % 2 === 0) acc.push("");
        acc[acc.length - 1] += char;
        return acc;
      }, []),
    );
  };

  const calculateFidelity = (mode, errorRate) => {
    let base = 1 - errorRate;
    switch (mode) {
      case "ideal":
        return base * 1.0;
      case "depolarizing":
        return base * (0.92 + Math.random() * 0.03);
      case "bit-flip":
        return base * (0.88 + Math.random() * 0.04);
      case "phase-flip":
        return base * (0.9 + Math.random() * 0.03);
      case "combined":
        return base * (0.85 + Math.random() * 0.03);
      default:
        return base;
    }
  };

  const generateStagesData = (
    inputMsg,
    errorRate = 0,
    noiseMode = "depolarizing",
  ) => {
    let binarySplit = [];
    let letters = [];
    let binary = [];
    let rgbPixels = [];
    let pixelBinary = [];

    if (inputMsg.type === "text") {
      letters = inputMsg.content.split("");
      binary = letters.map((l) => l.charCodeAt(0).toString(2).padStart(8, "0"));
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
        rgbPixels.push([r, g, b]);

        const rBin = r.toString(2).padStart(8, "0");
        const gBin = g.toString(2).padStart(8, "0");
        const bBin = b.toString(2).padStart(8, "0");
        binary.push(rBin + gBin + bBin);

        const pixelChunks =
          (rBin + gBin + bBin).slice(0, 8).match(/.{1,2}/g) || [];
        for (let k = 0; k < pixelChunks.length; k += 4) {
          binarySplit.push(pixelChunks.slice(k, k + 4));
        }
      }

      binarySplit = binarySplit.slice(0, 20);
      pixelBinary = [...binarySplit];
    }

    const rgbValues = rgbPixels.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
    const reducedImgBin = binary.slice(0, 20);
    const b8Bin = reducedImgBin.map((b) => b.slice(0, 8));
    const b8BinSplit = splitBinTo2(b8Bin);

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
      }),
    );

    const allGates = ["I", "X", "Z", "XZ"];
    const blochVisual = [...gates.flat()].map((gate) => {
      if (Math.random() < errorRate) {
        switch (noiseMode) {
          case "bit-flip":
            return gate === "I" ? "X" : gate === "X" ? "I" : gate;
          case "phase-flip":
            return gate === "I" ? "Z" : gate === "Z" ? "I" : gate;
          case "depolarizing": {
            const available = allGates.filter((g) => g !== gate);
            return available[Math.floor(Math.random() * available.length)];
          }
          case "combined": {
            let newGate = gate;
            if (Math.random() < 0.5) {
              newGate = newGate === "I" ? "X" : newGate === "X" ? "I" : newGate;
            }
            if (Math.random() < 0.5) {
              newGate = newGate === "I" ? "Z" : newGate === "Z" ? "I" : newGate;
            }
            return newGate;
          }
          default:
            return gate;
        }
      }
      return gate;
    });

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

    const chunkSize = 4;
    const binary2D = [];
    for (let i = 0; i < gatesBack.length; i += chunkSize) {
      binary2D.push(gatesBack.slice(i, i + chunkSize));
    }
    const mergedBinary = binary2D.map((group) => group.join(""));
    const lettersBack = mergedBinary.map((bStr) =>
      String.fromCharCode(parseInt(bStr, 2)),
    );
    const mergedText = lettersBack.join("");

    const fidelityValue = calculateFidelity(noiseMode, errorRate);

    if (inputMsg.type === "text") {
      return [
        { stage: 0, input: inputMsg.content, output: inputMsg.content },
        { stage: 1, input: inputMsg.content, output: letters },
        { stage: 2, input: letters, output: binary },
        { stage: 3, input: binary, output: binarySplit },
        { stage: 4, input: binarySplit, output: gates },
        {
          stage: 5,
          input: [...gates.flat()],
          output: blochVisual,
          fidelity: fidelityValue,
          errorRate,
          noiseMode,
        },
        { stage: 6, input: blochVisual, output: gatesBack },
        { stage: 7, input: binary2D, output: mergedBinary },
        { stage: 8, input: mergedBinary, output: lettersBack },
        { stage: 9, input: lettersBack, output: mergedText },
        { stage: 10, input: mergedText, output: inputMsg.content },
      ];
    }

    if (inputMsg.type === "image") {
      return [
        { stage: 0, input: inputMsg, output: inputMsg.content },
        { stage: 1, input: inputMsg.content, output: rgbPixels },
        { stage: 2, input: rgbPixels, output: rgbValues },
        { stage: 3, input: rgbValues, output: reducedImgBin },
        { stage: 4, input: b8Bin, output: b8BinSplit },
        { stage: 5, input: b8BinSplit, output: gates },
        {
          stage: 6,
          input: gates.flat(),
          output: blochVisual,
          fidelity: fidelityValue,
          errorRate,
          noiseMode,
        },
        { stage: 7, input: blochVisual, output: gatesBack },
        { stage: 8, input: binary2D, output: mergedBinary },
        { stage: 9, input: reducedImgBin, output: rgbValues },
        { stage: 10, input: rgbValues, output: rgbPixels },
        { stage: 11, input: rgbPixels, output: inputMsg.b64Img },
        { stage: 12, input: inputMsg, output: inputMsg },
      ];
    }
  };

  const handleChatComplete = (userInput) => {
    const stagesPipeline = userInput.type === "text" ? textStages : imageStages;
    setStages(stagesPipeline);

    const { errorRate, noiseMode } = settings;
    const data = generateStagesData(userInput, errorRate, noiseMode);
    setStagesData(data);
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
      handleLastStage();
      return;
    }
    transitionStage(stage + 1);
  };

  const handleRestart = () => {
    setComplete(false);
    setStagesData([]);
    setStage(0);
    setCircuitView(false);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const isBlochPage = stages[stage] === BlochPage;
  const StageToRender = isBlochPage && circuitView ? Circuit : stages[stage];

  return (
    <div
      ref={containerRef}
      className={`fade ${hidden ? "fade-hidden" : ""} h-screen w-screen flex flex-col justify-center items-center`}
    >
      {isBlochPage && (
        <button
          onClick={() => setCircuitView((prev) => !prev)}
          className="absolute top-5 right-5 px-4 py-2 bg-[#7f00ff] text-white rounded-md shadow-md hover:bg-[#a14cff] transition z-50"
        >
          {circuitView ? "Back to Bloch" : "Go to Circuit"}
        </button>
      )}

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

      {complete ? (
        <SuperdenseCompletion
          encodedMessage={
            !imgData ? (
              stagesData[0].input
            ) : (
              <img src={stagesData[0].input.b64Img} width={100} height={100} />
            )
          }
          decodedMessage={
            !imgData ? (
              stagesData[10].input
            ) : (
              <img src={stagesData[0].input.b64Img} width={100} height={100} />
            )
          }
          onRestart={handleRestart}
          stagesData={stagesData}
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
            settings,
            onComplete: handleOnComplete,
            onChatComplete: handleChatComplete,
            onSettingsChange: handleSettingsChange,
          }}
        >
          <StageToRender />
        </Context.Provider>
      )}
    </div>
  );
}
