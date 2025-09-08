import { useContext } from "react";
import ChatWindow from "./ChatWindow";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Context } from "../Context/Context";

export default function Chat() {
  const { onComplete, stagesData, stage } = useContext(Context);

  const input = stagesData[stage] ? stagesData[stage].input : [...stagesData[stage - 1].output];

  return (
    <div className="w-screen h-full mb-13">
      <NavBar startChat={false} />
      <div className="flex h-full">
        <SideBar className=" h-full overflow-x-hidden" startChat={false} />
        <ChatWindow
          startChat={false}
          input={input}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
}
