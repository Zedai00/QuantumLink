import { createContext } from "react";

export const UserContext = createContext({
  startChat: {
    start: true,
    sender: { name: "Alice", img: "Alice-pp.jpg" },
    receiver: { name: "Bob", img: "Bob-pp.jpg" },
  },
  endChat: () => {},
});
