import ChatInterface from "./ChatInterface";
export default function MessageArea() {
  return (
    <div className="relative flex-1 flex flex-col h-full bg-[#1B1C18] overflow-hidden">
      <ChatInterface />
    </div>
  );
}
