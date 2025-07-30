import React, { useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { MdCall, MdMessage } from "react-icons/md";
import { HiOutlineExclamation } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";
import { motion, AnimatePresence } from "framer-motion";

const getIcon = (type) => {
  switch (type) {
    case "call":
      return <MdCall className="text-green-500 text-lg" />;
    case "message":
      return <MdMessage className="text-blue-500 text-lg" />;
    default:
      return <HiOutlineExclamation className="text-yellow-500 text-lg" />;
  }
};

const NotificationList = () => {
  const { notifications, markAsSeen, clearNotifications, setNotificationOpen } =
    useContext(NotificationContext);
  const { setSelectedChatUser } = useContext(ChatContext);
  const navigate = useNavigate();

  const handleNotificationClick = (n) => {
    markAsSeen(n.id);

    if (n.type === "message") {
      setSelectedChatUser({
        contact_id: n?.user_id,
        contact_name: n?.senderName || `User ${n?.user_id}`,
        contact_phone: n?.phone || `User ${n.user_id}`,
      });
      navigate("/dashboard/chat");
      setNotificationOpen(false);
    }

    // You can handle "call" or other types here too
  };

  return (
    <div className="p-4 w-80 md:w-[500px] bg-white rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-sm text-red-500 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-gray-400">You're all caught up! 🚀</p>
      ) : (
        <ul className="space-y-3 max-h-96 overflow-y-auto px-2">
          <AnimatePresence initial={false}>
            {notifications.map((n) => (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                onClick={() => handleNotificationClick(n)}
                className={`cursor-pointer px-4 py-3 rounded-xl shadow-sm border ${
                  n.seen
                    ? "bg-gray-100 border-gray-200"
                    : "bg-green-50 border-green-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div>{getIcon(n.type)}</div>
                  <p
                    className={`font-medium ${
                      n.seen ? "text-gray-500" : "text-gray-800"
                    }`}
                  >
                    {n.senderName || "System"}
                  </p>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {n.message}
                </p>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
