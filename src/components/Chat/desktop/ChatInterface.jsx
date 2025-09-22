import React, { useState, useRef, useEffect, useContext } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import SEOHelmet from "../../../engine/SEOHelmet";
import { ChatContext } from "../../../context/ChatContext";
import useChat from "../../../hooks/useChat";
import ChatMessage from "../ChatMessage"; // Import the new Message component
import { getFormattedDate } from "../../../utils/formmaters";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import SendMessage from "../SendMessage";
import ChatMessageList from "../ChatMessageList";

const ChatInterface = () => {
  const { typingUsers } = useContext(ChatContext);
  const { getChatMessages } = useChat();
  const messageRef = useRef(null);

  const location = useLocation();
  const chatUserData = location?.state;
  const messagesEndRef = useRef(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = getChatMessages(chatUserData?.contact_id_encrypt);

  const messages = data?.pages.flatMap((page) => page.data) ?? [];
  const chatMeta = data?.pages?.[0]?.chat_meta;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [typingUsers[Number(chatUserData?.contact_id)]]);
  return (
    <div className="flex-1 relative gap-4 h-full">
      <SEOHelmet title="Secure Chat" />
      <div
        ref={messageRef}
        className="w-full h-full overflow-y-auto flex flex-col p-4 pb-14"
      >
        {chatUserData ? (
          isLoading ? (
            <div className="h-20 flex justify-center items-center text-oliveGreen gap-2">
              <FaSpinner className="animate-spin text-2xl" /> Loading Messages
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">
              Failed to load messages. Please try again.
            </p>
          ) : (
            <>
              <ChatMessageList
                desktop={true}
                messages={messages}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                messagesContainerRef={messageRef}
              />

              {/* 🔹 Typing indicator as a new bubble */}
              {typingUsers[chatUserData?.contact_id] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start space-x-1"
                >
                  <div className="p-2 rounded-lg bg-white text-black shadow-md flex items-center space-x-1 max-w-40">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </>
          )
        ) : (
          <p className="text-center text-lg font-bold mt-10">
            Select a chat to start messaging.
          </p>
        )}
      </div>
      {chatUserData && (
        <SendMessage
          messageData={chatMeta}
          scrollRef={messageRef}
          messagesEndRef={messagesEndRef}
        />
      )}
    </div>
  );
};

export default ChatInterface;
