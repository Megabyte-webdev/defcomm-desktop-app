import React, { useContext, useEffect, useMemo, useRef } from "react";
import GroupMessage from "./GroupMessage";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const formatDateLabel = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: today.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
  });
};

// Group messages by date
const groupMessagesByDate = (messages = []) => {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  return sorted.reduce((acc, msg) => {
    const dateKey = new Date(msg.created_at).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});
};

const GroupMessageList = ({ messages = [], participants = [] }) => {
  const { registerMessageRefs } = useContext(ChatContext);
  const groupedMessages = groupMessagesByDate(messages);

  // refs map for scroll-to-message: key -> DOM element
  const messageRefs = useRef(new Map());
  useEffect(() => {
    if (typeof registerMessageRefs === "function") {
      registerMessageRefs(messageRefs);
    }
  }, [registerMessageRefs]);

  // build lookup map for quick tag_mess resolution
  const messagesById = useMemo(() => {
    const map = new Map();
    (messages || []).forEach((m) => {
      if (m?.id_en) map.set(String(m.id_en), m);
      if (m?.id) map.set(String(m.id), m);
      if (m?.client_id) map.set(String(m.client_id), m);
    });
    return map;
  }, [messages]);

  return (
    <div className="flex flex-col px-4 py-4 space-y-1 hide-scrollbar relative">
      {Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
        <div key={dateKey} className="relative">
          {/* Sticky date header */}
          <div className="sticky -top-4 z-10 flex justify-center py-1">
            <span
              className="px-3 py-1 text-xs rounded-full shadow-sm"
              style={{
                color: "#C5D6C3",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {formatDateLabel(new Date(dateKey))}
            </span>
          </div>

          {/* Messages of this day */}
          <div className="space-y-1">
            {dayMessages.map((msg, index) => {
              const sender =
                participants.find(
                  (p) =>
                    p.member_id_encrpt === msg.user_id ||
                    p.member_id === msg.user_id
                ) || {};

              const prevMsg = dayMessages[index - 1];
              const nextMsg = dayMessages[index + 1];

              const showAvatar = !prevMsg || prevMsg.user_id !== msg.user_id;
              const isLastInGroup = !nextMsg || nextMsg.user_id !== msg.user_id;

              return (
                <GroupMessage
                  key={msg.client_id ?? msg.id ?? index}
                  msg={msg}
                  sender={sender}
                  showAvatar={showAvatar}
                  isLastInGroup={isLastInGroup}
                  participants={participants}
                  messagesById={messagesById}
                  messageRefs={messageRefs} // pass refs map
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupMessageList;
