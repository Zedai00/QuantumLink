import { useState } from "react";
import NavBar from "./components/Chats/NavBar";
import SideBar from "./components/Chats/SideBar";
import ChatWindow from "./components/Chats/ChatWindow";
import { UserContext } from "./store/start-end-context";

export default function App() {
  const [startChat, setStartChat] = useState({
    start: true,
    sender: {name: "Alice", img: "Alice-pp.jpg"},
    receiver: {name: "Bob", img: "Bob-pp.jpg"},
  })

  function handleEnd(){
    setStartChat((prev) => ({
      ...prev,
      start: !prev.start,
      sender: prev.start ? {name: "Bob", img: "Bob-pp.jpg"} : {name: "Alice", img: "Alice-pp.jpg"},
      receiver: prev.start ? {name: "Alice", img: "Alice-pp.jpg"} : {name: "Bob", img: "Bob-pp.jpg"},

    }))
  }
  const ctxValue = { 
    startChat,
    endChat: handleEnd,
  }
  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      <UserContext value={ctxValue}>
      <NavBar />

      {/* Main Section: Sidebar + Chat */}
      <div className="flex flex-1">
        <SideBar startChat={startChat}/>
        <ChatWindow startChat={startChat}/>
      </div>
      </UserContext>
    </div>
  );
}
