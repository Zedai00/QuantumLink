import { createContext } from "react";

export const Context = createContext({
  stage: null,
  stages: [],
  imgData: "",
  rgbValues: [],
  stagesData: null,
  speed: null,
  animate: null,
  setRGBValues: () => {},
  onComplete: () => { },
  onChatComplete: () => { },
  onAliceInput: () => { },
  onImageComplete: () => { }
})
