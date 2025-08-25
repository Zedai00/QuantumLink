// import { useState } from "react";
// import NavBar from "./components/Chats/NavBar";
// import SideBar from "./components/Chats/SideBar";
// import ChatWindow from "./components/Chats/ChatWindow";

import Pipe2 from "./components/Convertors/Pipe2";

export default function App() {
  // const [startChat, setStartChat] = useState(false)
  return (
    <div className="h-screen flex flex-col">
      {/* {/* Top Navbar */}
      {/* <NavBar /> */}
      {/**/}
      {/* {/* Main Section: Sidebar + Chat */}
      {/* <div className="flex flex-1"> */}
      {/*   <SideBar startChat={startChat} /> */}
      {/*   <ChatWindow startChat={startChat} /> */}
      {/* </div> */}
      <Pipe2 />
    </div>
  );
}
