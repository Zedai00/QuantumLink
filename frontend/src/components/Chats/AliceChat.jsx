import { useContext, useState } from "react";
import ChatWindow from "./ChatWindow";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Context } from "../Context/Context"
import SettingsPage from "./SettingsPage";

export default function Chat() {
  const { stagesData, stage, onChatComplete, onImageComplete } = useContext(Context)
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div className="w-screen h-full mb-13">
      < NavBar startChat={true} onSettingsClick={() => setShowSettings(true)} />
      <div className="flex h-full">
        <SideBar startChat={stage === 0 ? true : false} />
        <ChatWindow startChat={stage === 0 ? true : false} input={stagesData[stage] ? stagesData[stage].input : ""} onComplete={onChatComplete} onImageComplete={onImageComplete}
        />
      </div>
      {showSettings && (
        <div className="absolute inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[#0f0f1f] border border-cyan-400/30 rounded-xl shadow-2xl p-6 w-96">
            <SettingsPage />
            <button
              onClick={() => setShowSettings(false)}
              className="mt-4 bg-cyan-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg w-full transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
