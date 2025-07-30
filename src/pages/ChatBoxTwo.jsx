import React, { useContext, useState } from "react";
import { AiOutlineMenuFold } from "react-icons/ai";
import { BiInfoCircle } from "react-icons/bi";
import SEOHelmet from "../engine/SEOHelmet";
import ChatBotInput from "../components/Chatbot/ChatBotInput";
import { BotContext } from "../context/BotContext"; // Import Bot Context
import { BotReference, tasks } from "../utils/dummies"; // Import Bot Context
import ThemeToggleButton from "../components/ThemeToggleButton";
import ChatInterface from "../components/Chatbot/ChatInterface"
import { MdClose } from "react-icons/md";
const ChatBoxTwo = () => {
  const { selectedBotChat, setSelectedBotReference, selectedBotReference } = useContext(BotContext); // Use context
  const [more, showMore] = useState(false)
  return (
    <div className="relative flex flex-col lg:flex-row gap-4 h-full">
      <SEOHelmet title="Defcomm Ai" />
      <div className="relative flex-1 min-w-80 flex flex-col gap-4 h-full">
        {/* Header Section */}
        <div className="sticky top-0 z-50 flex justify-between items-center gap-2 bg-oliveDark text-white p-4 text-sm font-medium dark:bg-oliveLight">
          <p className="px-3 truncate w-[60%] flex-1">{selectedBotChat}</p>

          {/* Dark Mode Toggle Button */}
          <ThemeToggleButton />
          <AiOutlineMenuFold onClick={() => showMore(true)} size={24} className="block lg:hidden ml-2 cursor-pointer" />
        </div>

        {/* Chat UI */}
        <div className="flex-1 relative w-full flex flex-col bg-[#d0eb8e] dark:bg-oliveDark max-h-[70vh] pt-10 transition-all duration-300 overflow-y-auto">
          {selectedBotChat ? (
            <>
              {
                selectedBotReference ?
                  <div className="bg-[#d0eb8e] dark:bg-olive p-4 h-full w-full my-2  pb-10">
                    <div className="py-2 flex items-center text-black text-xl lg:text-2xl font-medium">
                      <p className="px-3 rounded-full border border-olive text-olive dark:border-oliveLight dark:text-oliveLight flex items-center justify-center leading-0">{selectedBotReference?.id}</p>
                      <p className="px-3 truncate font-medium text-xl lg:text-2xl">{selectedBotReference?.title}</p>
                    </div>
                    <p className="text-sm lg:text-sm my-2">{selectedBotReference?.content}</p>
                    <p className="text-sm lg:text-sm my-2">{selectedBotReference?.more_content}</p>
                  </div>
                  :
                  <ChatInterface />
              }
            </>

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

          <ChatBotInput />
        </div>
      </div>
      <div className={`${more ? "absolute top-0 right-0" : "hidden"} lg:relative lg:block max-w-72 bg-oliveDark max-h-[80vh] overflow-y-auto`}>
        {/* Header Section */}
        <div className="sticky top-0 z-50 flex justify-between items-center bg-oliveGreen text-gray-300 p-4 text-sm font-medium dark:bg-oliveLight">
          <MdClose onClick={() => showMore(false)} size={20} className="block lg:hidden cursor-pointer text-red-500 hover:text-red-600" />

          <p className="text-[18px] px-3 truncate w-[60%]">References</p>

          {/* Dark Mode Toggle Button */}
          <BiInfoCircle size={24} />
        </div>
        {
          BotReference?.map((item) => (
            <div onClick={() => setSelectedBotReference(item)} className={`${selectedBotReference?.id === item.id ? "bg-[#ddf2ab]/80 dark:bg-olive/70" : "bg-[#ddf2ab] dark:bg-olive"} p-4 w-[95%] min-h-40 mx-auto my-2 cursor-pointer`}>
              <div className="py-2 flex items-center text-black text-sm font-medium">
                <p className="px-2 rounded-full border border-olive text-olive dark:border-oliveLight dark:text-oliveLight flex items-center justify-center text-sm">{item.id}</p>
                <p className="text-sm px-3 truncate font-medium">{item.title}</p>
              </div>
              <p className="text-xs">{item?.content}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ChatBoxTwo;
