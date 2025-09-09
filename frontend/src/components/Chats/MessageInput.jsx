import { useState } from "react";
import { Send, Image as ImageIcon } from "lucide-react";

export default function MessageInput({ onSend, onImage }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return; // prevent empty messages
    onSend(text);
    setText(""); // clear input after sending
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) onImage && onImage(file);
  };

  return (
    <div className="h-16 flex items-center px-4 border-t border-cyan-400/20 bg-[#0a0a1a] shadow-[0_0_15px_rgba(0,255,255,0.15)]">

      {/* Image Upload Button */}
      <label className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-cyan-500/20 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,255,255,0.3)] cursor-pointer hover:scale-105 transition-transform duration-300">
        <ImageIcon size={22} className="text-cyan-300 group-hover:text-pink-400 transition-colors duration-300" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>

      {/* Text Input */}
      <input
        type="text"
        placeholder="Type your quantum message..."
        value={text}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 mx-3 border rounded-xl px-4 py-2 text-white bg-[#111827] border-cyan-400/30
          text-sm outline-none placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.15)]
          transition-all duration-300"
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 
          hover:from-pink-500 hover:to-purple-500 text-white shadow-[0_0_12px_rgba(255,0,255,0.4)] hover:scale-105 
          transition-all duration-300"
      >
        <Send size={20} />
      </button>
    </div>
  );
}

