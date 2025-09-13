import ChatMessage from "./ChatMessage";
import DynamicAvatar from "./DynamicAvatar";
import MessageInput from "./MessageInput";

export default function ChatWindow({ startChat, onComplete, input, sender }) {
  // ✅ Handle sending messages (text or image)
  const handleSendMessage = (message) => {
    if (message.type === "text" && !message.content.trim()) return;

    onComplete({
      sender: startChat ? "Alice" : "Bob",
      ...message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  if (!startChat) {
    onComplete("");
  }

  return (
    <div className="flex-1 flex flex-col bg-[#030313] border border-cyan-400/30  shadow-[0_0_30px_rgba(0,255,255,0.2)] overflow-hidden">
      {/* Chat Header */}
      <div className="h-14 flex items-center px-5 border-b border-cyan-400/40 bg-gradient-to-r from-[#0f0f1f] via-[#1a1f3c] to-[#0f0f1f] shadow-[0_0_20px_rgba(0,255,255,0.4)]">
        <span className="font-semibold flex gap-3 text-lg text-cyan-300 items-center">
          <DynamicAvatar name={startChat ? "Bob" : "Alice"} />
          {startChat ? "Bob" : "Alice"}
        </span>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-gradient-to-b from-[#050517] to-[#09091f]">
        {/* Default Bob Message */}
        <div className= {startChat ? "flex justify-start": "flex justify-end"}>
          <ChatMessage
            msg={{
              sender: "Bob",
              type: "text",
              content: "Hey!",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }}
          />
        </div>

        {/* Alice or Bob’s Reply */}
        {input && (
          <div
            className={`flex ${startChat ? "justify-end" : "justify-start"}`}
          >
            <ChatMessage
              msg={{
                sender: sender || "Alice",
                type: input.type || "text",
                content: input.content || String(input), // fallback if input was string
                time:
                  input.time ||
                  new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
              }}
            />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-cyan-400/30 bg-[#0f0f1f] shadow-[0_-2px_15px_rgba(0,255,255,0.1)]">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
