import { useContext } from "react";
import ChatWindow from "./ChatWindow";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Context } from "../Context/Context";

export default function Chat() {
  const { onComplete, data, stage } = useContext(Context);

  const input = data[stage] ? data[stage].input : [...data[stage - 1].output];

  return (
    <div className="w-screen h-full mb-13">
      <NavBar />
      <div className="flex h-full">
        <SideBar className=" h-full overflow-x-hidden" startChat={false} />
        <ChatWindow
          startChat={false}
          alice_msg={input}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
}
