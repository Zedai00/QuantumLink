import { useState } from "react";
// import NavBar from "./components/Chats/NavBar";
// import SideBar from "./components/Chats/SideBar";
// import ChatWindow from "./components/Chats/ChatWindow";

import LetterSplitter from "./components/Convertors/LetterSplitter";
import { Context } from "./components/Context";
import LetterToBinary from "./components/Convertors/LetterToBinary";
import BinarySplitter from "./components/Convertors/BinarySplitter";

export default function App() {
  const [stage, setStage] = useState(0)
  const [complete, setComplete] = useState(false)
  const [data, setData] = useState([{
    id: 0,
    input: "Hello, World".split(""),
    output: null
  }])

  const stages = [
    LetterSplitter,
    LetterToBinary,
    BinarySplitter
  ]

  const handleOnComplete = (input, output) => {
    console.log("Input: " + input)
    console.log("Output: " + output)
    if (stage >= stages.length - 1) {
      setComplete(true)
    } else {
      if (data.find(elm => elm.id === stage)) {

        setData(data.map((elm) => {
          if (elm.id === stage) {
            return {
              ...elm,
              input: input,
              output: output
            }
          }
        }))
      } else {
        setData([...data, {
          id: stage,
          input: input,
          output: output
        }])
      }
      setStage(stage + 1)
    }

  }

  const CurrentStage = stages[stage]
  return (
    <div className="h-screen flex flex-col">
      {complete && "Complete"}
      {!complete && <Context.Provider value={{ stage, data, onComplete: handleOnComplete }}>
        <CurrentStage />
      </Context.Provider>}
      {/* {/* Top Navbar */}
      {/* <NavBar /> */}
      {/**/}
      {/* {/* Main Section: Sidebar + Chat */}
      {/* <div className="flex flex-1"> */}
      {/*   <SideBar startChat={startChat} /> */}
      {/*   <ChatWindow startChat={startChat} /> */}
      {/* </div> */}
    </div>
  );
}
