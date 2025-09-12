import { useState, useRef } from "react";
import { animate } from "animejs";
import LetterSplitter from "./components/Convertors/LetterSplitter";
import { Context } from "./components/Context/Context";
import LetterToBinary from "./components/Convertors/LetterToBinary";
import BinarySplitter from "./components/Convertors/BinarySplitter";
import BinaryToGate from "./components/Convertors/BinaryToGate";
import BlochPage from "./components/Convertors/BlochPage";
import GateToBinary from "./components/Convertors/GateToBinary";
import BinaryMerger from "./components/Convertors/BinaryMerger";
import BinaryToLetter from "./components/Convertors/BinaryToLetter";
import LetterMerger from "./components/Convertors/LetterMerger";
import SuperdenseCompletion from "./components/SuperdenseCompletion";
import AliceChat from "./components/Chats/AliceChat";
import BobChat from "./components/Chats/BobChat";
import Circuit from "./components/Convertors/Circuit";

export default function App() {
  const [stage, setStage] = useState(0);
  const [complete, setComplete] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [animateState, setAnimateState] = useState(true);
  const [stagesData, setStagesData] = useState([]);
  const [circuitView, setCircuitView] = useState(false); // Toggle Bloch <-> Circuit

  const [settings, setSettings] = useState({
    errorRate: 0,
    noiseMode: "depolarizing"
  })
  const containerRef = useRef(null);

  const stages = [
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
    }, 5000);
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
    if (stage === 1) setStagesData("");
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

  const calculateFidelity = (mode, errorRate) => {
    let base = 1 - errorRate; // base from slider
    switch (mode) {
      case "ideal":
        return base * 1.0;
      case "depolarizing":
        return base * (0.92 + Math.random() * 0.03); // 0.92–0.95
      case "bit-flip":
        return base * (0.88 + Math.random() * 0.04); // 0.88–0.92
      case "phase-flip":
        return base * (0.90 + Math.random() * 0.03); // 0.90–0.93
      case "combined":
        return base * (0.85 + Math.random() * 0.03); // 0.85–0.88
      default:
        return base;
    }
  };

  const generateStagesData = (inputText, errorRate = 0, noiseMode = "depolarizing") => {
    const letters = inputText.split("");
    const binary = letters.map((l) =>
      l.charCodeAt(0).toString(2).padStart(8, "0")
    );
    const binarySplit = binary.map((item) =>
      item.split("").reduce((acc, char, index) => {
        if (index % 2 === 0) acc.push("");
        acc[acc.length - 1] += char;
        return acc;
      }, [])
    );

    const gates = [...binarySplit].map((item) =>
      item.map((letter) => {
        switch (letter) {
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

    const allGates = ["I", "X", "Z", "XZ"];
    const blochVisual = [...gates.flat()].map((gate) => {
      if (Math.random() < errorRate) {
        switch (noiseMode) {
          case "bit-flip":
            return gate === "I" ? "X" : gate === "X" ? "I" : gate; // only flip X errors
          case "phase-flip":
            return gate === "I" ? "Z" : gate === "Z" ? "I" : gate; // only Z errors
          case "depolarizing": {
            const available = allGates.filter((g) => g !== gate);
            return available[Math.floor(Math.random() * available.length)];
          }
          case "combined": {
            // Apply both bit-flip and phase-flip randomly
            let newGate = gate;
            if (Math.random() < 0.5) {
              // bit-flip
              newGate = newGate === "I" ? "X" : newGate === "X" ? "I" : newGate;
            }
            if (Math.random() < 0.5) {
              // phase-flip
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

    const gatesBack = blochVisual.map((item) => {
      switch (item) {
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
    const mergedBinary = [...binary2D].map((group) => group.join(""));
    const lettersBack = [...mergedBinary].map((binaryStr) =>
      String.fromCharCode(parseInt(binaryStr, 2))
    );
    const mergedText = lettersBack.join("");

    const fidelityValue = calculateFidelity(settings.mode, settings.errorRate);

    return [
      { stage: 0, input: inputText, output: inputText },
      { stage: 1, input: inputText, output: letters },
      { stage: 2, input: letters, output: binary },
      { stage: 3, input: binary, output: binarySplit },
      { stage: 4, input: [...binarySplit], output: gates },
      {
        stage: 5, input: [...gates.flat()], output: blochVisual, fidelity: fidelityValue, errorRate: settings.errorRate,  // <-- add this
        noiseMode: settings.mode
      },
      { stage: 7, input: blochVisual, output: gatesBack },
      { stage: 8, input: binary2D, output: mergedBinary },
      { stage: 9, input: mergedBinary, output: lettersBack },
      { stage: 10, input: lettersBack, output: mergedText },
      { stage: 11, input: mergedText, output: inputText },
    ];
  };

  const handleChatComplete = (userInput) => {
    const { errorRate, noiseMode } = settings;
    const data = generateStagesData(userInput, errorRate, noiseMode);
    setStagesData(data);
    transitionStage(1);
  };

  const handleRestart = () => {
    setComplete(false);
    setStagesData("");
    setStage(0);
    setCircuitView(false);
  };

  const handleSettingsChange = (newSettings) => {
    console.log(newSettings)
    setSettings((prev) => ({ ...prev, ...newSettings }));
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
          <span className="text-cyan-300 font-bold text-lg px-3 py-1 rounded-lg
            bg-[#0f0f1f]/70 border border-cyan-400/30
            shadow-[0_0_15px_rgba(0,255,255,0.6)]
            backdrop-blur-md">
            {speed}x
          </span>
        </div>
      )}

      {/* Prev / Play / Next Buttons */}
      {stage !== 0 && stage !== stages.length - 1 && !complete && (
        <div className="absolute top-2 left-[50%-h-15] flex items-center gap-3 z-50 h-15 w-auto rounded-2xl p-5
          bg-gradient-to-r from-[#0f0f1f] via-[#111827] to-[#1a1a2e]
          border border-cyan-400/30
          shadow-[0_0_25px_rgba(0,255,255,0.4)]
          backdrop-blur-md
          text-white">
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
        <div className="absolute top-4 left-4 px-4 py-2 text-lg font-semibold rounded-xl
          bg-gradient-to-br from-[#111827] via-[#1a1a2e] to-[#0f0f1f]
          text-cyan-300 border border-cyan-400/40
          shadow-[0_0_20px_rgba(0,255,255,0.5)]
          backdrop-blur-md z-50">
          Stage {stage} / {stages.length - 1}
        </div>
      )}

      {/* Render Current Stage */}
      {complete ? (
        <SuperdenseCompletion encodedMessage={stagesData[0].output} decodedMessage={stagesData[stagesData.length - 1].input} onRestart={handleRestart} stagesData={stagesData} />
      ) : (
        <Context.Provider
          value={{
            stage,
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

