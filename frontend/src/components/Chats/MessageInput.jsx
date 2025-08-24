import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput({onSend}) {
  const [text, setText] = useState("");

  const handleSend = () => {
    onSend(text);
    setText(""); // clear input after sending
  };
  return (
    <div className="h-14 flex items-center px-4 border-t bg-white">
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onKeyDown={(e) => e.key === 'Enter' ? handleSend() : undefined}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded-lg p-2 mr-2"
      />
      <button onClick={handleSend} className="ml-2 p-2 bg-green-500 rounded-full text-white hover:bg-green-600 hover:cursor-pointer">
        <Send size={20} />
      </button>
    </div>
  );
}
