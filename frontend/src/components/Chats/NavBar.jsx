import { useContext } from "react";
import { UserContext } from "../../store/start-end-context";
export default function NavBar() {

  const {startChat, endChat} = useContext(UserContext);
  const {start} = startChat;
 

  const btnText = start ? "to End" : "to Start"
  const navText = start ? "Alice sending text to Bob." : "Bob receiving text from Alice."
  return (
    <div className="h-12 bg-gray-800 text-white flex items-center justify-between px-4">
      <h1 className="text-lg font-semibold">Qchat</h1>
      <span>{navText}</span>
      <div className="flex space-x-4">
        <button onClick={endChat} className="bg-green-400 px-3 rounded-sm hover:cursor-pointer hover:bg-green-300">{btnText}</button>
      </div>
    </div>
  );
}
