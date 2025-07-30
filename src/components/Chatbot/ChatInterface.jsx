import React, { useContext, useEffect, useRef } from 'react';
import { FaSpinner } from 'react-icons/fa';
import BotChatMessages from './BotChatMessages';
import { BotContext } from "../../context/BotContext";

const ChatInterface = () => {
    const { getActiveConversation } = useContext(BotContext);
    const messageRef = useRef(null);
    const activeConversation = getActiveConversation();
    const isLoading = false;
    const error = false;

    useEffect(() => {
        if (activeConversation?.messages && messageRef.current) {
            messageRef.current?.lastElementChild?.scrollIntoView();
        }
        console.log(activeConversation)
    }, [activeConversation]);

    return (
        <div ref={messageRef} className="overflow-y-auto w-full h-full min-h-80 flex flex-col space-y-4 p-4 pb-10">
            {isLoading ? (
                <div className="h-20 flex justify-center items-center text-oliveDark gap-2">
                    <FaSpinner className="animate-spin text-2xl" /> Loading Messages
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">Failed to load messages. Please try again.</p>
            ) : activeConversation?.messages?.length > 0 ? (
                activeConversation.messages.map((msg, index) => (
                    <BotChatMessages key={index} msg={msg} />
                ))
            ) : (
                <p className="text-gray-500 text-center">No messages yet.</p>
            )}
        </div>
    );
};

export default ChatInterface;
