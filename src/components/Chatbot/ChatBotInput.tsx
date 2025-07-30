import React, { useState, useContext } from "react";
import { MdOutlineImage } from "react-icons/md";
import {
  FaFileAlt,
  FaSpinner,
  FaTimes,
  FaMicrophoneAlt,
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { BotContext } from "../../context/BotContext";

function ChatBotInput() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    addMessageToConversation,
    activeConversationId,
  } = useContext(BotContext);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversationId) return;

    const now = new Date().toLocaleTimeString();

    // Add user message to conversation
    addMessageToConversation({
      id: Date.now() + "-user",
      sender: "user",
      content: message,
      time: now,
    });

    setIsLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BOT_URL,
        {
          model: "openai/gpt-4o",
          messages: [{ role: "user", content: message }],
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BOT_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;

      // Add bot response to conversation
      addMessageToConversation({
        id: Date.now() + "-bot",
        sender: "bot",
        content: aiResponse,
        time: new Date().toLocaleTimeString(),
      });

      setMessage("");
      setFile(null);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sticky bottom-0 w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col p-4">
      {file && (
        <div className="flex items-center gap-3 bg-white p-3 mb-2 rounded-lg shadow-md">
          <FaFileAlt className="text-oliveGreen" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium w-[90%] truncate">{file.name}</p>
            <p className="text-xs text-gray-400">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-red-400 hover:text-red-500 transition"
          >
            <FaTimes size={18} />
          </button>
        </div>
      )}

      <div className="relative flex items-center gap-2">
        <label htmlFor="fileUpload" className="cursor-pointer">
          <MdOutlineImage size={24} className="flex-shrink-0" />
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <div className="relative flex-1">
          <textarea
            placeholder="Ask me anything.."
            className="w-full p-4 pr-10 bg-gray-200 dark:bg-gray-500 rounded-lg border-none outline-none resize-none leading-none text-base font-medium placeholder:text-gray-700 dark:placeholder:text-gray-300"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
          />
          <FaMicrophoneAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-black transition" size={18} />
        </div>

        <button
          className="bg-oliveGreen dark:bg-oliveLight text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner size={20} className="animate-spin" />
          ) : (
            <IoSend size={20} />
          )}
        </button>
      </div>

      <small className="max-w-[90%] text-[10px] md:text-xs text-gray-600 dark:text-gray-200 text-center font-bold mt-2 md:tracking-[1px] mx-auto">
        Defcomm AI Chatbot: All information provided is sourced from and recorded in the Military Archive.
      </small>
    </div>
  );
}

export default ChatBotInput;
