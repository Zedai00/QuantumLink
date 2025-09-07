import { useContext } from "react";
import ChatWindow from "./ChatWindow";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Context } from "../Context/Context"

export default function Chat() {
  const { onComplete, data, stage } = useContext(Context)
  return (
    <div className="w-screen h-full mb-13">
      < NavBar />
      <div className="flex h-full">
        <SideBar className=" h-full overflow-x-hidden" startChat={stage === 0 ? true : false} />
        <ChatWindow className="h-full" startChat={stage === 0 ? true : false} input={data[stage] ? data[stage].input : ""} onComplete={onComplete} />
      </div>
    </div>
  )
}
