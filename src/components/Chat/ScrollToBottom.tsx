import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAnglesDown } from "react-icons/fa6";

type Props = {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  threshold?: number;
};

export default function ScrollToBottomButton({
  messagesEndRef,
  containerRef,
  threshold = 48,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check if user is at bottom
  const checkIfAtBottom = () => {
    const container = containerRef?.current;
    if (!container) return true;
    const distanceFromBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight);
    return distanceFromBottom <= threshold;
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setVisible(false);
  };

  // Observe scroll
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleScroll = () => {
      if (checkIfAtBottom()) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  // Increment unread count when new messages arrive
  useEffect(() => {
    if (!checkIfAtBottom()) {
      setVisible(true);
    }
  }, [messagesEndRef]); // trigger when new message renders

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.18 }}
          className="absolute right-4 bottom-24 z-50"
        >
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <div
                className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                   bg-[#556B2F] text-[#F5F5F5] text-xs font-bold shadow-md 
                   border border-[#3B4422] tracking-widest"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </div>
            )}
            <button
              onClick={scrollToBottom}
              aria-label="Scroll to latest message"
              className="flex items-center justify-center w-10 h-10 rounded-full 
                 bg-[#2f3719] text-[#F5F5F5] shadow-lg border-2 border-[#556B2F] 
                 hover:bg-[#496021] hover:scale-105 transition-all duration-200"
            >
              <FaAnglesDown className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
