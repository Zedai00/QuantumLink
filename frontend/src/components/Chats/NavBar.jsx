import DynamicAvatar from "./DynamicAvatar";

export default function NavBar({ startChat }) {
  return (
    <div className="h-14 bg-[#030313] flex items-center justify-between px-6 border-b border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.1)] relative z-50">

      {/* Logo / Title */}
      <h1 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,0,255,0.7)] animate-pulse">
        ⚡ QChat
      </h1>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-5">
        <button className="relative text-cyan-300 hover:text-pink-400 transition-colors duration-300 font-medium group">
          Chats
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-300 group-hover:w-full rounded-lg"></span>
        </button>
        <button className="relative text-cyan-300 hover:text-pink-400 transition-colors duration-300 font-medium group">
          Images
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-300 group-hover:w-full rounded-lg"></span>
        </button>
        <button className="relative text-cyan-300 hover:text-pink-400 transition-colors duration-300 font-medium group">
          Settings
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-300 group-hover:w-full rounded-lg"></span>
        </button>
      </div>

      {/* Profile Avatar */}
      <div className="flex items-center gap-3">
        {/* <img */}
        {/*   src="/Alice-pp.jpg" */}
        {/*   alt="Profile" */}
        {/*   className="w-10 h-10 rounded-full border border-cyan-400/40 shadow-[0_0_12px_rgba(0,255,255,0.4)] hover:scale-105 transition-transform duration-300 cursor-pointer" */}
        {/* /> */}
        <DynamicAvatar name={startChat ? "Alice" : "Bob"} size={40} />
      </div>
    </div>
  );
}

