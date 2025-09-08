import ChatMessage from "./ChatMessage";
import DynamicAvatar from "./DynamicAvatar";
import MessageInput from "./MessageInput";

export default function ChatWindow({ startChat, onComplete, input }) {
  // Function to send a new message
  const handleSendMessage = (text) => {
    if (!text.trim()) return; // Prevent empty messages
    onComplete(text);
  };

  if (!startChat) {
    onComplete("")
  }
  return (
    <div className="flex-1 flex flex-col bg-[#030313] border border-cyan-400/30  shadow-[0_0_30px_rgba(0,255,255,0.2)] overflow-hidden">
      {/* Chat Header */}
      <div className="h-14 flex items-center px-5 border-b border-cyan-400/40 bg-gradient-to-r from-[#0f0f1f] via-[#1a1f3c] to-[#0f0f1f] shadow-[0_0_20px_rgba(0,255,255,0.4)]">
        <span className="font-semibold flex gap-3 text-lg text-cyan-300 items-center">
          {/* <img */}
          {/*   src={startChat ? "/Bob-pp.jpg" : "/Alice-pp.jpg"} */}
          {/*   alt="profile" */}
          {/*   className="w-8 h-8 rounded-full border border-cyan-300 shadow-[0_0_10px_rgba(0,255,255,0.6)]" */}
          {/* /> */}
          <DynamicAvatar name={startChat ? "Bob" : "Alice"} />
          {startChat ? "Bob" : "Alice"}
        </span>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-gradient-to-b from-[#050517] to-[#09091f]">
        {/* Default Bob Message */}
        <div className={`flex justify-start ${startChat ? "" : "justify-self-end"}`}>
          <ChatMessage
            msg={{
              sender: "Bob",
              text: "Hey!",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              img: "/Bob-pp.jpg",
            }}
          />
        </div>

        {/* Alice's Reply */}
        {input && (
          <div className={`flex justify-end ${startChat ? "" : "justify-self-start"}`}>
            <ChatMessage
              msg={{
                sender: "Alice",
                text: input,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                img: "/Alice-pp.jpg",
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

