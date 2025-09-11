import DynamicAvatar from "./DynamicAvatar";

export default function SideBar({ startChat }) {
  const chats = [
    { name: startChat ? "Bob" : "Alice", img: startChat ? "/Bob-pp.jpg" : "/Alice-pp.jpg" },
  ];

  return (
    <div className="w-1/3 h-full bg-[#030313] border-r border-cyan-400/30 shadow-[0_0_25px_rgba(0,255,255,0.2)] flex flex-col">
      {/* Header */}
      <div className="p-4 text-xl font-bold text-cyan-300 tracking-wide border-b border-cyan-400/30 bg-gradient-to-r from-[#0f0f1f] via-[#1a1f3c] to-[#0f0f1f] shadow-[0_0_20px_rgba(0,255,255,0.4)]">
        Quantum Chats
      </div>

      {/* Chat List */}
      <ul className="flex-1 overflow-y-auto">
        {chats.map((chat, i) => (
          <li
            key={i}
            className="flex items-center space-x-3 p-4 cursor-pointer group transition-all duration-300
                       bg-[#0a0a1a] hover:bg-gradient-to-r hover:from-cyan-500/10 hover:via-pink-500/10 hover:to-purple-500/10
                       border-b border-cyan-400/10 hover:border-cyan-400/40"
          >
            {/* Profile Image */}
            <div className="relative">
              {/* <img src={chat.img} */}
              {/*   alt={chat.name} */}
              {/*   className="w-12 h-12 rounded-full object-cover border border-cyan-400/40 shadow-[0_0_15px_rgba(0,255,255,0.4)] group-hover:scale-105 transition-transform duration-300" */}
              {/* /> */}
              <DynamicAvatar name={chat.name} size={40} />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border border-black rounded-full shadow-[0_0_10px_rgba(0,255,100,0.8)]"></span>
            </div>

            {/* Chat Details */}
            <div className="flex-1">
              <p className="font-semibold text-cyan-300 group-hover:text-pink-400 transition-colors duration-300">
                {chat.name}
              </p>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Hey!
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-400 border-t border-cyan-400/20 bg-[#060617]">
        <span className="text-cyan-300">⚡ Quantum Messenger</span> v1.0
      </div>
    </div>
  );
}

