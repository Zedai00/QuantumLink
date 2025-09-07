import { useState, useContext } from "react";
import { Context } from "../Context/Context";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";

export default function ChatWindow({ startChat, onComplete, alice_msg }) {


  // Function to send a new message
  const handleSendMessage = (text) => {
    if (!text.trim()) return; // prevent empty messages
    onComplete("", text);
  };

  return (
    <div className="flex-1 flex flex-col  border-1">
      {/* Chat header */}
      <div className="h-12 bg-gray-200 flex items-center px-4 border-b">
        <span className="font-semibold flex gap-2 text-xl">
          <img
            src={startChat ? "Bob-pp.jpg" : "Alice-pp.jpg"}
            alt=""
            className="size-7 rounded-full"
          />
          {startChat ? "Bob" : "Alice"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-gray-50">
        {alice_msg && <ChatMessage msg={{
      sender: "Alice",
      text: alice_msg,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      img: "Alice-pp.jpg",
    }} />}
      </div>

      {/* Input */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
