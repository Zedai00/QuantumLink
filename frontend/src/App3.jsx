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
import QuantumCompletion from "./components/QuantumCompletion";
import AliceChat from "./components/Chats/AliceChat";
import BobChat from "./components/Chats/BobChat";
import Circuit from "./components/Convertors/Circuit";

export default function App() {
  const [stage, setStage] = useState(0);
  const [complete, setComplete] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [animateState, setAnimateState] = useState(true);
  const [stagesData, setStagesData] = useState([]);
  const containerRef = useRef(null);

  const stages = [
    AliceChat,
    LetterSplitter,
    LetterToBinary,
    BinarySplitter,
    BinaryToGate,
    // BlochPage,
    Circuit,
    GateToBinary,
    BinaryMerger,
    BinaryToLetter,
    LetterMerger,
    BobChat,
  ];

  // ✅ Smooth Stage Transition Handler (Anime.js v4)
  const transitionStage = (nextStage) => {
    if (!containerRef.current) return;

    // Fade out, shrink & blur
    animate(containerRef.current, {
      opacity: [1, 0],
      scale: [1, 0.96],
      filter: ["blur(0px)", "blur(10px)"],
      duration: 350,
      ease: "inOutSine",
    }).then(() => {
      // Switch the stage AFTER fade out completes
      setStage(nextStage);

      // Fade back in with expansion
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
      setComplete(true)
    }, 5000)
  }

  const handleOnComplete = () => {
    if (stage >= stages.length - 1) {
      handleLastStage()
      return;
    }
    transitionStage(stage + 1);
  };

  const handlePrev = () => {
    if (stage <= 0) return;
    if (stage === 1) setStagesData("")
    transitionStage(stage - 1);
  };

  const handleNext = () => {
    if (stage >= stages.length - 1) {
      setStagesData("")
      handleLastStage()
      return;
    }
    transitionStage(stage + 1);
  };

  const generateStagesData = (inputText) => {
    const letters = inputText.split("");
    const binary = letters.map((l) => l.charCodeAt(0).toString(2).padStart(8, "0"));
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

    const blochVisual = [...gates.flat()];
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

    return [
      { stage: 0, input: inputText, output: inputText },
      { stage: 1, input: inputText, output: letters },
      { stage: 2, input: letters, output: binary },
      { stage: 3, input: binary, output: binarySplit },
      { stage: 4, input: [...binarySplit], output: gates },
      { stage: 5, input: [...gates.flat()], output: blochVisual },
      { stage: 6, input: blochVisual, output: gatesBack },
      { stage: 7, input: binary2D, output: mergedBinary },
      { stage: 8, input: mergedBinary, output: lettersBack },
      { stage: 9, input: lettersBack, output: mergedText },
      { stage: 10, input: inputText, output: inputText }
    ];
  };

  const handleChatComplete = (userInput) => {
    const data = generateStagesData(userInput);
    setStagesData(data);
    transitionStage(1); // Instead of setStage(1), use transition
  };

  const handleRestart = () => {
    setComplete(false);
    setStagesData("")
    setStage(0); // Reset stages
  };


  const CurrentStage = stages[stage];


  return (
    <div ref={containerRef} className="h-screen w-screen flex flex-col justify-center items-center">
      <Circuit stagesData={[{ input: ["X", "Z", "I", "XZ"] }]} stage={stage} onComplete={handleOnComplete} />
    </div>
  );
}
