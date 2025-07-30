import React, { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // Retrieve and parse stored boolean value
  const initialVisibility =
    JSON.parse(sessionStorage.getItem("chatVisibility")) ?? false;
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [callType, setCallType] = useState("audio"); // Default call type
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [chatVisibility, setChatVisibility] = useState(initialVisibility);
  const [showCall, setShowCall] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [callMessage, setCallMessage] = useState("");
  const [messages, setMessages] = useState(false);
  const [meetingId, setMeetingId] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [typingUsers, setTypingUsers] = useState({}); // key = userId, value = true/false
  const [showContactModal, setShowContactModal] = useState(false);

  const [modalTitle, setModalTitle] = useState("Defcomm");
  // Store the boolean value correctly when it changes
  useEffect(() => {
    sessionStorage.setItem("chatVisibility", JSON.stringify(chatVisibility));
  }, [chatVisibility]);

  const initialShowToggleSwitch =
    JSON.parse(sessionStorage.getItem("showToggleSwitch")) ?? true;

  const [showToggleSwitch, setShowToggleSwitch] = useState(
    initialShowToggleSwitch
  );

  return (
    <ChatContext.Provider
      value={{
        selectedChatUser,
        setSelectedChatUser,
        setChatVisibility,
        chatVisibility,
        showCall,
        setShowCall,
        showSettings,
        setShowSettings,
        showContactModal,
        setShowContactModal,
        callMessage,
        setCallMessage,
        messages,
        setMessages,
        file,
        setFile,
        message,
        setMessage,
        callType,
        setCallType,
        typingUsers,
        setTypingUsers,
        modalTitle,
        setModalTitle,
        meetingId,
        setMeetingId,
        callDuration,
        setCallDuration,
        showToggleSwitch,
        setShowToggleSwitch,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
