import { useState, useRef } from "react";
import LetterSplitter from "./components/Convertors/LetterSplitter";
import { Context } from "./components/Context/Context";
import LetterToBinary from "./components/Convertors/LetterToBinary";
import BinarySplitter from "./components/Convertors/BinarySplitter";
import BinaryToGate from "./components/Convertors/BinaryToGate";
import BlochPage from "./components/Convertors/BlochPage";
import GateToBinary from "./components/Convertors/GateToBinary";
import BinaryJoiner from "./components/Convertors/BinaryMerger";
import BinaryToLetter from "./components/Convertors/BinaryToLetter";
import LetterMerger from "./components/Convertors/LetterMerger";
import AliceChat from "./components/Chats/AliceChat";
import BobChat from "./components/Chats/BobChat";
import BlochSphere from "./components/Convertors/BlochSphere/BlochSphere";
import * as THREE from "three";

export default function App() {
  const [alice_msg, setAlice_msg] = useState("");
  const [stage, setStage] = useState(0);
  const [complete, setComplete] = useState(false);
  const [data, setData] = useState([]);
  const [speed, setSpeed] = useState(1);
  const aliceDirRef = useRef(new THREE.Vector3(0, 0, 1));

  const stages = [
    AliceChat,
    LetterSplitter,
    LetterToBinary,
    BinarySplitter,
    BinaryToGate,
    BlochPage,
    GateToBinary,
    BinaryJoiner,
    BinaryToLetter,
    LetterMerger,
    BobChat,
  ];

  const handleSetAliceMsg = (txt) => setAlice_msg(txt);

  const handleOnComplete = (input, output) => {
    if (stage >= stages.length - 1) {
      setComplete(true);
      return;
    }

    setData((prevData) => {
      const exists = prevData.find((elm) => elm.id === stage);
      if (exists) {
        return prevData.map((elm) =>
          elm.id === stage ? { ...elm, input, output } : elm
        );
      } else {
        return [...prevData, { id: stage, input, output }];
      }
    });

    setStage((prev) => prev + 1);
  };

  const CurrentStage = stages[stage];

  const ctxValue = {
    // alice_msg: "",
    // onAliceInput: handleSetAliceMsg,
    onComplete: handleOnComplete,
    stage,
    speed,
    data,
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      {/* 🌐 Global Speed Slider — hidden in Chat stage */}
      {stage !== 0 && stage !== stages.length-1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white z-50">
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(+e.target.value)}
          />
          <span>{speed}x</span>
        </div>
      )}

      {/* ✅ Hidden BlochSphere Preload */}
      <div className="absolute opacity-0 pointer-events-none">
        <BlochSphere
          gateKey={0}
          selectedGate="I"
          isBob={false}
          aliceDirRef={aliceDirRef}
          quantumMode={false}
        />
      </div>

      {complete && "Complete"}
      {!complete && (
        <Context.Provider
          value={ctxValue}
        >
          <CurrentStage />
        </Context.Provider>
      )}
    </div>
  );
}
