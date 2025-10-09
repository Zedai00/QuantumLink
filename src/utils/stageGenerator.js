export function generateStages(messageType) {
  switch (messageType) {
    case "text":
      return textStages;
    case "image":
      return imageStages;
    default:
      throw new Error(`Unknown message type: ${messageType}`);
  }
}