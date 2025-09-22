import Sidebar from "../components/Chat/desktop/Sidebar";
import ChatList from "../components/Chat/desktop/ChatList";
import ChatHeader from "../components/Chat/desktop/ChatHeader";
import MessageArea from "../components/Chat/desktop/MessageArea";
import RightPanel from "../components/Chat/desktop/RightPanel";
import GroupChatInterface from "./GroupChatInterface";

export default function SecureGroupChat() {
  return (
    <div
      className="flex h-screen text-white bg-gradient-to-b from-oliveLight to-black"
      style={{
        background: `linear-gradient(to bottom, #36460A 10%, #000000 40%)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Sidebar />
      <ChatList />
      <div className="flex-1 flex flex-col">
        <GroupChatInterface />
      </div>
      <RightPanel />
    </div>
  );
}
