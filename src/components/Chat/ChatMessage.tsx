import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomAudioMessage from "./CustomAudioMessage";
import ChatFilePreview from "./ChatFilePreview";
import ChatCallInvite from "./ChatCallInvite";
import { ChatContext } from "../../context/ChatContext";
import { parseHtml } from "../../utils/formmaters";

const ChatMessage = ({ msg, selectedChatUser }) => {
  const { chatVisibility, setShowCall, setMeetingId, showToggleSwitch } =
    useContext(ChatContext);
  const [isVisible, setIsVisible] = useState(chatVisibility || false);
  const [userToggled, setUserToggled] = useState(false); // Tracks manual toggle
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_LENGTH = 100;

  // Sync with chatVisibility from context if user hasn't manually toggled
  useEffect(() => {
    if (chatVisibility && userToggled) {
      setIsVisible(chatVisibility);
      setUserToggled(false);
    } else {
      setIsVisible(chatVisibility);
    }
  }, [chatVisibility]);

  const handleAcceptCall = (msg) => {
    setShowCall(true);
    setMeetingId(msg?.message?.split("CALL_INVITE:")[1]);
  };

  // Format message date
  const getFormattedDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) return "Today";
    if (messageDate.toDateString() === yesterday.toDateString())
      return "Yesterday";

    return messageDate.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formattedDate = getFormattedDate(msg?.updated_at);

  return (
    <div
      className={`flex flex-col ${
        msg?.is_my_chat === "yes" ? "items-end" : "items-start"
      } space-y-1 text-sm`}
    >
      {/* Toggle Switch */}
      {showToggleSwitch && (
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isVisible}
              onChange={() => {
                setIsVisible(!isVisible);
                setUserToggled(true);
              }}
            />
            <div
              className={`w-10 h-5 rounded-full relative transition-all ${
                msg?.is_my_chat === "yes"
                  ? "bg-oliveDark peer-checked:bg-oliveGreen"
                  : "bg-gray-300 peer-checked:bg-oliveGreen"
              }`}
            >
              <motion.div
                className="absolute top-0 bottom-0 left-[2px] my-auto w-4 h-4 bg-white rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                animate={{ x: isVisible ? 19 : 0 }}
              />
            </div>
          </label>
        </div>
      )}

      {/* Message Content */}
      <div
        className={`p-2 rounded-lg shadow-md max-w-60 md:max-w-80 overflow-wrap break-words transition-all ${
          msg?.is_my_chat === "yes"
            ? "bg-oliveDark text-white"
            : "bg-white text-black"
        }`}
      >
        <AnimatePresence mode="wait">
          {isVisible ? (
            <motion.div
              key="message-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {msg?.type === "audio" ? (
                <CustomAudioMessage />
              ) : msg?.is_file === "yes" && msg?.message ? (
                <ChatFilePreview
                  isMyChat={msg?.is_my_chat}
                  fileType={msg?.message?.split(".")[1]}
                  fileUrl={`${import.meta.env.VITE_BASE_URL}secure/${
                    msg?.message
                  }`}
                  fileName={msg?.file_name}
                />
              ) : msg?.message.startsWith("CALL_INVITE") ? (
                (() => {
                  const callTimestamp = new Date(msg?.updated_at).getTime();
                  const currentTime = Date.now();
                  const timeDifference = (currentTime - callTimestamp) / 1000;

                  return (
                    <ChatCallInvite
                      msg={msg}
                      isMyChat={msg?.is_my_chat === "yes"}
                      onAcceptCall={() => handleAcceptCall(msg)}
                      status={
                        timeDifference <= 30 ? "Ringing..." : "Call Ended"
                      }
                      caller={selectedChatUser?.contact_name}
                    />
                  );
                })()
              ) : (
                <div>
                  {/* Show "Read More" only for text messages */}
                  {msg?.message.length > MAX_LENGTH && !isExpanded ? (
                    <>
                      {msg?.message.slice(0, MAX_LENGTH)}...
                      <button
                        className="text-oliveHover ml-1"
                        onClick={() => setIsExpanded(true)}
                      >
                        Read More
                      </button>
                    </>
                  ) : (
                    parseHtml(msg?.message)
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hidden-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                if (!showToggleSwitch) {
                  setIsVisible(true);
                }
              }}
              title={!showToggleSwitch ? "click to show" : "toggle to show"}
              className={`${
                showToggleSwitch ? "" : "cursor-pointer"
              } w-full max-w-60 md:max-w-80 rounded-md flex items-center justify-center relative font-bold tracking-widest break-all`}
            >
              {msg?.message
                ? "*".repeat(Math.min(msg.message.length, 300))
                : "****"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message Timestamp */}
      <div className="text-xs text-gray-500">
        {new Date(msg?.updated_at).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </div>
    </div>
  );
};

export default ChatMessage;

{
  /* <motion.div
                            key="hidden-message"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-60 md:max-w-80 h-10 bg-gray-300 rounded-md blur-sm italic flex items-center justify-center relative"
                        >
                            <span className="">
                                Message is hidden
                            </span>
                        </motion.div> */
}
