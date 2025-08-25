import { useContext } from "react";
import { UserContext } from "../../store/start-end-context";
import { Check, CheckCheck } from "lucide-react";

export default function ChatMessage({ msg }) {
  const { startChat} = useContext(UserContext);
  const { start } = startChat;
  const isMe = start && msg.sender === "me";

  return (
    <div className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}>
      {/* Show profile pic only for other person's messages */}
      {!isMe && (
        <img
          src={msg.img || "/Bob-pp.jpg"} // fallback profile pic
          alt={msg.sender}
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      {/* Chat bubble */}
      <div
        className={`relative px-3 py-2 rounded-lg max-w-xs text-sm ${
          isMe ? "bg-green-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        <p>{msg.text}</p>

        {/* Timestamp + status (for my messages) */}
        <div className="flex items-center justify-end space-x-1 mt-1 text-xs opacity-80">
          <span>{msg.time}</span>
          {isMe && (
            <>
              {msg.status === "sent" && <Check size={14} />}
              {msg.status === "delivered" && <CheckCheck size={14} />}
              {msg.status === "seen" && (
                <CheckCheck size={14} className="text-blue-400" />
              )}
            </>
          )}
        </div>
      </div>

      {/* Show profile pic for my messages if needed */}
      {isMe && (
        <img
          src={msg.img || "/Alice-pp.jpg"}
          alt={msg.sender}
          className="size-8 rounded-full ml-2"
        />
      )}
    </div>
  );
}
