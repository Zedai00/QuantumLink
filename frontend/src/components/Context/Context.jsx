import { createContext } from "react";

export const Context = createContext({
  stage: null,
  stages: [],
  imgData: "",
  imgDim: {
    width: "150px",
    height: "150px",
  },
  stagesData: null,
  speed: null,
  animate: null,
  setImgDim: () => {},
  setImgData: () => {},
  onComplete: () => { },
  onChatComplete: () => { },
  onAliceInput: () => { },
  onImageComplete: () => { }
})
