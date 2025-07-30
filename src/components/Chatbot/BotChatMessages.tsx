import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomAudioMessage from "../Chat/CustomAudioMessage";
import ChatFilePreview from "../Chat/ChatFilePreview";
import ChatCallInvite from "../Chat/ChatCallInvite";
import { ChatContext } from "../../context/ChatContext";
import { RiVoiceprintFill } from "react-icons/ri";
import { parseHtml } from "../../utils/formmaters";
import ReactMarkdown from "react-markdown"; 
import remarkGfm from "remark-gfm"; // Enables better markdown formatting


const BotChatMessages = ({ msg, selectedChatUser }) => {

    // Format message date
    const getFormattedDate = (dateString) => {
        const messageDate = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) return "Today";
        if (messageDate.toDateString() === yesterday.toDateString()) return "Yesterday";

        return messageDate.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formattedDate = getFormattedDate(msg?.updated_at);

    return (
        <div className={`flex flex-col ${msg?.sender === "user" ? "items-end" : "items-start"} space-y-1`}>

            {msg?.sender === "user" && <section className="flex gap-1 items-center">
                <strong className="text-xs">You</strong>
                {/* Message Timestamp */}
            <div className="text-xs text-gray-500">
                {msg?.time}
                {/* {new Date(msg?.time).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })} */}
            </div>
            </section>}
            {/* Message Content */}
            <div
                className={`p-2 max-w-60 md:w-max md:max-w-[60%] rounded-lg text-sm break-all transition-all ${
                    msg?.sender === "user" ? "bg-oliveDark text-white text-right" : "bg-none"
                }`}
            >
                <AnimatePresence mode="wait">
                        <motion.div
                            key="message-content"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            {msg?.type === "audio" ? (
                                <CustomAudioMessage />
                            ) : msg?.is_file === "yes" && msg?.content ? (
                                <ChatFilePreview
                                    isMyChat={msg?.sender}
                                    fileType={msg?.content?.split(".")[1]}
                                    fileUrl={`${import.meta.env.VITE_BASE_URL}secure/${msg?.content}`}
                                    fileName={msg?.file_name}
                                />
                            ) : (
                                <div className="flex gap-2">
                                    {msg?.sender === "bot" && <div className="flex-shrink-0 border border-black rounded-full w-10 h-10 flex items-center justify-center"><RiVoiceprintFill size={28} className="w-[80%]" /></div>}
                                    <p className="flex flex-col"><ReactMarkdown remarkPlugins={[remarkGfm]}>{parseHtml(msg?.content)}</ReactMarkdown></p>
                                    </div>
                            )}
                        </motion.div>
                </AnimatePresence>
            </div>

            
        </div>
    );
};

export default BotChatMessages;
