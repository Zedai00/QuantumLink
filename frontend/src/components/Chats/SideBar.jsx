export default function SideBar({ startChat }) {
  const chats = [
    { name: startChat ? "Bob" : "Alice", img: startChat ? "/Bob-pp.jpg" : "/Alice-pp.jpg" },
    // { name: "Bob", img: "/Bob-pp.jpg" },

  ];

  return (
    <div className="w-1/3 h-full bg-gray-900 text-gray-200 border-r border-gray-700">


      {/* Chat list */}
      <ul>
        {chats.map((chat, i) => (
          <li
            key={i}
            className="flex items-center space-x-3 p-3 hover:bg-gray-200 cursor-pointer bg-stone-300"
          >
            {/* Profile image */}
            <img
              src={chat.img}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover bg-stone-500"
            />

            {/* Chat details */}
            <div className="flex-1 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              <p className="font-semibold ">{chat.name}</p>
              <p className="text-sm text-gray-500 truncate">Hey!</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
