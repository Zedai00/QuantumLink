import { useContext } from "react";
import ChatWindow from "./ChatWindow";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Context } from "../Context/Context"

export default function Chat() {
  const { onComplete, data, stage } = useContext(Context)
  return (
    <div className="w-screen h-screen">
      < NavBar />
      <div className="h-screen">
        <SideBar startChat={stage === 0 ? true : false} />
        <ChatWindow startChat={stage === 0 ? true : false} input={data[stage].input} onComplete={onComplete} />
      </div>
    </div>
  )
}
