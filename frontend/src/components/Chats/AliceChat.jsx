import { useContext } from "react";
import ChatWindow from "./ChatWindow";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Context } from "../Context/Context";

export default function Chat() {
  const { stagesData, stage, onChatComplete, onImageComplete, imgData } =
    useContext(Context);
  return (
    <div className="w-screen h-full mb-13">
      <NavBar startChat={true} />
      <div className="flex h-full">
        <SideBar startChat={stage === 0 ? true : false} />
        <ChatWindow
          startChat={stage === 0 ? true : false}
          input={stagesData[stage] ? stagesData[stage].input : ""}
          sender={stagesData[stage] ? stagesData[stage].input.sender : "Alice"}
          onComplete={onChatComplete}
          onImageComplete={onImageComplete}
        />
      </div>
    </div>
  );
}
