import { useState } from "react";
// import NavBar from "./components/Chats/NavBar";
// import SideBar from "./components/Chats/SideBar";
// import ChatWindow from "./components/Chats/ChatWindow";

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
import Chat from "./components/Chats/Chat";

export default function App() {
  const [stage, setStage] = useState(0)
  const [complete, setComplete] = useState(false)
  const [data, setData] = useState([])

  const stages = [
    Chat,
    LetterSplitter,
    LetterToBinary,
    BinarySplitter,
    BinaryToGate,
    BlochPage,
    GateToBinary,
    BinaryJoiner,
    BinaryToLetter,
    LetterMerger
  ]

  const handleOnComplete = (input, output) => {
    console.log("Input:", input);
    console.log("Output:", output);

    if (stage >= stages.length - 1) {
      setComplete(true);
      return;
    }

    setData((prevData) => {
      // Check if current stage already exists
      const exists = prevData.find((elm) => elm.id === stage);

      if (exists) {
        // Update existing entry
        return prevData.map((elm) =>
          elm.id === stage ? { ...elm, input, output } : elm
        );
      } else {
        // Add new entry
        return [...prevData, { id: stage, input, output }];
      }
    });

    // Use functional update to avoid stale state issues
    setStage((prev) => prev + 1);
  };

  const CurrentStage = stages[stage]
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {complete && "Complete"}
      {!complete && <Context.Provider value={{ stage, data, onComplete: handleOnComplete }}>
        <CurrentStage />
      </Context.Provider>}
      {/* Top Navbar */}
      {/* <NavBar /> */}

      {/* {/* Main Section: Sidebar + Chat */}
      {/* <div className="flex flex-1"> */}
      {/*   <SideBar startChat={startChat} /> */}
      {/*   <ChatWindow startChat={startChat} /> */}
      {/* </div> */}
    </div>
  );
}
