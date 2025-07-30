import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from './AuthContext'
export const BotContext = createContext();

export const BotProvider = ({ children }) => {
  const { authDetails }= useContext(AuthContext)
  const userId= authDetails?.user?.id
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [selectedBotChat, setSelectedBotChat] = useState(null);

  // Use a key that's specific to the logged-in user
  const localStorageKey = `bot_conversations_${userId}`;

  useEffect(() => {
    if (!userId) return;

    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      setConversations(parsed);
      if (parsed.length > 0) {
        setActiveConversationId(parsed[0].id);
        setSelectedBotChat(parsed[0].id);
      }
    } else {
      // If no data, reset everything
      setConversations([]);
      setActiveConversationId(null);
      setSelectedBotChat(null);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(localStorageKey, JSON.stringify(conversations));
    }
  }, [conversations, userId]);

  const startNewConversation = (title = "New Chat") => {
    const newConv = {
      id: `conv-${Date.now()}`,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setSelectedBotChat(newConv.id);
    return newConv.id;
  };

  const addMessageToConversation = (message, conversationId = activeConversationId) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              title:
                conv.messages.length === 0 && message.sender === "user"
                  ? message.content.slice(0, 30) || "New Chat"
                  : conv.title,
            }
          : conv
      )
    );
  };

  const getActiveConversation = () =>
    conversations.find((c) => c.id === activeConversationId);

  return (
    <BotContext.Provider
      value={{
        conversations,
        activeConversationId,
        setActiveConversationId,
        startNewConversation,
        addMessageToConversation,
        getActiveConversation,
        selectedBotChat,
        setSelectedBotChat,
      }}
    >
      {children}
    </BotContext.Provider>
  );
};
