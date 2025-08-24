import { useState } from "react";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";

export default function ChatWindow({startChat}) {
  const [messages, setMessages] = useState([
    // {
    //   sender: "Alice",
    //   text: "Hey! How are you?",
    //   time: curTime,
    //   img: "Alice-pp.jpg",
    // },
  ]);

  // Function to send a new message
  const handleSendMessage = (text) => {
    if (!text.trim()) return; // prevent empty messages

    const newMessage = {
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      img: startChat ? "Alice-pp.jpg" : "Bob-pp.jpg",
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="h-12 bg-gray-200 flex items-center px-4 border-b">
        <span className="font-semibold flex gap-2 text-xl">
          <img src={startChat ? "Bob-pp.jpg" : "Alice-pp.jpg"} alt="" className="size-7 rounded-full"/>
          {startChat ? "Bob" : "Alice"}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} msg={msg} />
        ))}
      </div>

      {/* Input */}
      <MessageInput onSend={handleSendMessage}/>
    </div>
  );
}
