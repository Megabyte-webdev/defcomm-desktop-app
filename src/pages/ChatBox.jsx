import React, { useContext, useState } from "react";
import { IoFlash } from "react-icons/io5";
import { BiMoon } from "react-icons/bi";
import SEOHelmet from "../engine/SEOHelmet";
import ChatBotInput from "../components/Chatbot/ChatBotInput";
import { BotContext } from "../context/BotContext"; // Import Bot Context
import { tasks } from "../utils/dummies"; // Import Bot Context
import ThemeToggleButton from "../components/ThemeToggleButton";
import ChatInterface from "../components/Chatbot/ChatInterface"
const ChatBox = () => {
  const { selectedBotChat, getActiveConversation } = useContext(BotContext); // Use context
  const activeConversation = getActiveConversation();
  return (
    <div className="relative flex flex-col gap-4 h-full">
      <SEOHelmet title="Defcomm Ai" />

      {/* Header Section */}
      <div className="sticky top-0 z-50 flex justify-between items-center bg-oliveDark text-white p-4 text-sm font-medium dark:bg-oliveLight">
        <button className="bg-white text-black dark:bg-gray-800 dark:text-white rounded-lg flex items-center gap-2 px-3 py-2 border border-olive transition-all hover:scale-105">
          <IoFlash className="text-yellow" /> <span className="hidden md:block">Switch to Advance  AI</span>
        </button>

        <p className="px-3 truncate">{activeConversation?.title}</p>

        {/* Dark Mode Toggle Button */}
        <ThemeToggleButton />
      </div>

      {/* Chat UI */}
      <div className="relative w-full flex flex-col bg-[#d0eb8e] dark:bg-oliveDark max-h-[70vh] transition-all duration-300 overflow-y-auto">
        {selectedBotChat ? (
          <ChatInterface />
        ) : (
          <>
            <div className="flex-1 w-full flex flex-col items-center space-y-4 p-4 py-2">
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200 mb-1 font-bold animate-fadeIn">
                Hello, Defcomm!
              </p>
              <p className="text-sm md:text-xl lg:text-2xl my-2 animate-fadeIn dark:text-gray-300">
                How can I help you today?
              </p>
              <p className="text-xs md:text-sm mt-5 mb-3 text-gray-700 dark:text-gray-400 font-medium animate-fadeIn">
                Take a look at the tasks I can handle:
              </p>
            </div>

            {/* Task List */}
            <div className="grid grid-cols-responsive-sm gap-4 mx-auto w-[90%] max-w-[700px] animate-slideUp pb-10">
              {tasks.map((task, index) => (
                <section
                  key={index}
                  className="bg-white dark:bg-gray-900 dark:text-gray-200 py-3 px-4 min-h-32 rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                </section>
              ))}
            </div>
          </>
        )}

        <ChatBotInput  />
      </div>
    </div>
  );
};

export default ChatBox;
