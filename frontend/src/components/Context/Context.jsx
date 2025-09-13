import { createContext } from "react";

export const Context = createContext({
  stage: null,
  stages: [],
  imgData: "",
  stagesData: null,
  speed: null,
  animate: null,
  onComplete: () => { },
  onChatComplete: () => { },
  onAliceInput: () => { },
  onImageComplete: () => { }
})
