import { useContext } from "react";
import ChatWindow from "./ChatWindow";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Context } from "../Context/Context"

export default function Chat() {
  const { stagesData, stage, onChatComplete } = useContext(Context)
  return (
    <div className="w-screen h-screen">
      < NavBar />
      <div className="h-screen">
        <SideBar startChat={stage === 0 ? true : false} />
        <ChatWindow startChat={stage === 0 ? true : false} input={stagesData[stage] ? stagesData[stage].input : ""} onComplete={onChatComplete} />
      </div>
    </div>
  )
}
