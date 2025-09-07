import { useState, useContext } from "react";
import { Context } from "../Context/Context";
import { Send } from "lucide-react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const { onAliceInput } = useContext(Context);

  const handleSend = () => {
    onSend(text);
    setText(""); // clear input after sending
    // Set alice_msg
    onAliceInput(text);
  };
  return (
    <div className="h-14 flex items-center px-4 border-t bg-white border-gray-800">
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onKeyDown={(e) => (e.key === "Enter" ? handleSend() : undefined)}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded-lg p-2 mr-2 text-white bg-gray-900 border-gray-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <button
        onClick={handleSend}
        className="ml-2 p-2 bg-cyan-600 hover:bg-cyan-500  rounded-full text-white hover:cursor-pointer"
      >
        <Send size={20} />
      </button>
    </div>
  );
}
