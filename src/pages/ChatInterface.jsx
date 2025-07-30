import React, { useState, useRef, useEffect, useContext } from "react";
import { MdCall } from "react-icons/md";
import { FaSpinner } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import SEOHelmet from "../engine/SEOHelmet";
import { ChatContext } from "../context/ChatContext";
import useChat from "../hooks/useChat";
import SendMessage from "../components/Chat/SendMessage";
import CallInterface from "../components/Chat/CallInterface";
import ChatMessage from "../components/Chat/ChatMessage"; // Import the new Message component
import { FaCog } from "react-icons/fa";

const ChatInterface = () => {
    const { 
        selectedChatUser, setSelectedChatUser, 
        setShowCall,
        setShowSettings,
        meetingId, setMeetingId } = useContext(ChatContext);
    const { fetchChatMessages } = useChat();
    const messageRef = useRef(null);

    // Fetch messages
    const { data: messages, isLoading, error } = useQuery({
        queryKey: ["chatMessages", selectedChatUser?.contact_id],
        queryFn: () => fetchChatMessages(selectedChatUser?.contact_id),
        refetchOnWindowFocus: true,
        refetchInterval: 5000,
        enabled: !!selectedChatUser?.contact_id,
    });

    useEffect(() => {
        if (messages?.chat_meta && selectedChatUser) {
            setSelectedChatUser((prev) => {
                if (!prev) return prev; // 🔴 Prevents overwriting null
                return { ...prev, chat_meta: messages.chat_meta };
            });
        }
        if (messages?.data && messageRef.current) {
            messageRef.current?.lastElementChild?.scrollIntoView();
        }
    }, [messages]);

    const handleAcceptCall = (msg) => {
        setMeetingId(msg?.message?.slice("CALL_INVITE:".length));
        setShowCall(true);
    };

    return (
        <div className="relative flex flex-col lg:flex-row gap-4 h-full">
            <SEOHelmet title="Secure Chat" />

            {selectedChatUser && (
                <div className="lg:hidden sticky top-0 z-50 flex justify-between items-center bg-oliveDark text-white p-4">
                    <h2 className="text-lg font-semibold capitalize">{selectedChatUser ? selectedChatUser?.contact_name: "Chat"}</h2>
                    <div className="flex gap-4">
                        <button onClick={() => setShowCall(true)}>
                            <MdCall size={24} />
                        </button>
                        <button onClick={() => setShowSettings(true)}>
                            <FaCog size={24} />
                        </button>
                    </div>
                </div>
            )}

            <div className="relative w-full lg:w-2/3 flex-1 h-96 md:h-[70vh] bg-[#d0eb8e] pt-4 transition-all duration-300">
                <div ref={messageRef} className="flex-1 overflow-y-auto w-full h-full flex flex-col space-y-4 p-4 pb-10">
                    {selectedChatUser ? (
                        isLoading ? (
                            <div className="h-20 flex justify-center items-center text-oliveDark gap-2">
                                <FaSpinner className="animate-spin text-2xl" /> Loading Messages
                            </div>
                        ) : error ? (
                            <p className="text-red-500 text-center">Failed to load messages. Please try again.</p>
                        ) : messages?.data?.length > 0 ? (
                            messages?.data.map((msg) => (
                                <ChatMessage key={msg?.id} msg={msg} selectedChatUser={selectedChatUser} handleAcceptCall={handleAcceptCall} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No messages yet.</p>
                        )
                    ) : (
                        <p className="text-oliveDark text-center text-lg font-bold mt-10">
                            Select a chat to start messaging.
                        </p>
                    )}
                </div>

                {selectedChatUser && <SendMessage messageData={messages?.chat_meta} />}
            </div>

            {selectedChatUser && <div className="w-max hidden lg:block"><CallInterface setShowCall={setShowCall} setShowSettings={setShowSettings} /></div>}

        </div>
    ); 
};

export default ChatInterface;
