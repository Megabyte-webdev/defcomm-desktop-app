import { FaSmile, FaPaperclip, FaMicrophone, FaPaperPlane } from "react-icons/fa";

export default function MessageInput() {
  return (
    <div className="p-4 border-t border-gray-700 flex items-center space-x-2">
      <FaSmile className="text-green-500" />
      <input
        className="flex-1 rounded-full bg-gray-900 text-white px-4 py-2 focus:outline-none"
        placeholder="Write a message..."
      />
      <FaPaperclip className="text-green-500" />
      <FaMicrophone className="text-green-500" />
      <button className="bg-green-600 p-2 rounded-full">
        <FaPaperPlane className="text-white" />
      </button>
    </div>
  );
}
