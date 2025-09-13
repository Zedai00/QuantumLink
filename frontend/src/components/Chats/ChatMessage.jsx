import { Check, CheckCheck } from "lucide-react";
import DynamicAvatar from "./DynamicAvatar";

export default function ChatMessage({ msg }) {
  const isMe = msg.sender === "Alice";

  return (
    <div className={`flex items-end mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
      {/* Avatar for other person's messages */}
      {!isMe && (
        <div className="mr-2">
          <DynamicAvatar name={msg.sender} size={32} />
        </div>
      )}

      {/* Chat bubble */}
      <div
        className={`relative px-4 py-3 rounded-2xl max-w-xs sm:max-w-sm text-sm shadow-lg transition-all duration-300 ${
          isMe
            ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-[0_0_15px_rgba(255,0,255,0.4)]"
            : "bg-[#1a1a2e] text-gray-200 border border-cyan-500/20 shadow-[0_0_10px_rgba(0,255,255,0.15)]"
        }`}
      >
        {/* Text or image */}
        {msg.type === "image" ? (
          <img
            src={msg.content}
            alt="Sent"
            className="rounded-lg mb-2 max-w-full shadow-[0_0_10px_rgba(0,255,255,0.3)]"
          />
        ) : (
          <p className="break-words leading-snug">{msg.content}</p>
        )}

        {/* Timestamp + status */}
        <div className="flex items-center justify-end space-x-1 mt-1 text-xs opacity-80">
          <span>{msg.time}</span>
          {isMe && (
            <>
              {msg.status === "sent" && <Check size={14} />}
              {msg.status === "delivered" && <CheckCheck size={14} className="text-cyan-300" />}
              {msg.status === "seen" && <CheckCheck size={14} className="text-pink-400" />}
            </>
          )}
        </div>
      </div>

      {/* Avatar for my messages */}
      {isMe && (
        <div className="ml-2">
          <DynamicAvatar name={msg.sender} size={32} />
        </div>
      )}
    </div>
  );
}
