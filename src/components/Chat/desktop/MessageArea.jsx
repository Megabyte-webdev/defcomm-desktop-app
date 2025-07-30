import { useContext } from "react"
import { ChatContext } from "../../../context/ChatContext";
import SendMessage from "../SendMessage";

import ChatInterface from "./ChatInterface";

export default function MessageArea() {
  const {
    selectedChatUser,messages } = useContext(ChatContext);
    return (
      <div className="relative flex-1 flex flex-col h-full bg-[#1B1C18] overflow-hidden">
        <ChatInterface />
        {selectedChatUser && <div className="absolute bottom-0 w-full z-[10]"><SendMessage messageData={messages?.chat_meta} desktop={true} /></div>}
      </div>
    );
  }
  
