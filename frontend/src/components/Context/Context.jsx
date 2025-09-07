import { createContext } from "react";

export const Context = createContext({
  stage: null,
  speed: null,
  data: null,
  onAliceInput: () => {},
  onComplete: () => {},
})
