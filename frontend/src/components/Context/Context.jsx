import { createContext } from "react";

export const Context = createContext({
  stage: null,
  stagesData: null,
  speed: null,
  animate: null,
  settings: null,
  onComplete: () => { },
  onChatComplete: () => { },
  onAliceInput: () => { },
  onImageComplete: () => { },
  onSettingsChange: () => { }
})
