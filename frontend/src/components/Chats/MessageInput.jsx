import { useState, useRef } from "react";
import { Send, Image as ImageIcon } from "lucide-react";

export default function MessageInput({ onSend }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState({
    type: "",
    content: "",
    b64Img: "",
    sender: "",
    time: "",
  });

  const handleSend = () => {
    if (message.type === "" || !message.content) return;

    // console.log("Sending:", message);
    
    onSend(message);
    setPreview(null);
    setMessage({ type: "", content: "", b64Img: "", sender: "", time: "" }); // reset after send
  };

  // Open file picker
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result;
      const img = new Image();
      img.src = base64Image;

      img.onload = () => {
        let maxDim = 32; // keep small for performance
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          const scale = Math.min(maxDim / width, maxDim / height);
          width = Math.floor(width * scale);
          height = Math.floor(height * scale);
        }

        // Draw to hidden canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Extract pixels
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        // console.log("Optimized flat binary per pixel:", binarySplit);
        // console.log("Pixel or message.content: ", pixels);

        setPreview(base64Image);
        setMessage({
          type: "image",
          content: pixels, // Uint8ClampedArray
          b64Img: base64Image,
          width,
          height,
        });
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="h-16 flex items-center px-4 border-t border-cyan-400/20 bg-[#0a0a1a] shadow-[0_0_15px_rgba(0,255,255,0.15)]">
      <div className="relative">
        {/* Image Preview */}
        {preview && (
          <div className="absolute bottom-16 left-0 w-20 h-20 border border-cyan-400 rounded-lg overflow-hidden shadow-[0_0_12px_rgba(0,255,255,0.5)]">
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Image Upload Button */}
        <button
          onClick={handleIconClick}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-cyan-500/20 
          border border-cyan-400/40 shadow-[0_0_12px_rgba(0,255,255,0.3)] cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          <ImageIcon
            size={22}
            className="text-cyan-300 group-hover:text-pink-400 transition-colors duration-300"
          />
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Text Input */}
      <input
        type="text"
        placeholder="Type your quantum message..."
        value={message.type === "text" ? message.content : ""}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        onChange={(e) =>
          setMessage({ sender: "Alice", type: "text", content: e.target.value })
        }
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
