import { useState, useContext } from "react";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";
import { UserContext } from "../../store/start-end-context";

export default function ChatWindow() {
  const { startChat } = useContext(UserContext);
  const { sender, receiver } = startChat;

  const [messages, setMessages] = useState([]);


  // Function to send a new message
  const handleSendMessage = (text) => {
    if (!text.trim()) return; // prevent empty messages

    const newMessage = {
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }), //time that Alice sent the message
      status: "sent",
      img: sender.img,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="h-12 bg-gray-200 flex items-center px-4 border-b">
        <span className="font-semibold flex gap-2 text-xl">
          <img src={receiver.img} alt="" className="size-7 rounded-full" />
          {receiver.name}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} msg={msg} />
        ))}
      </div>

      {/* Input */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
