import React, { useContext, useState, useMemo } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { MdCall, MdMessage } from "react-icons/md";
import { HiOutlineExclamation } from "react-icons/hi";
import { FaReply, FaAt } from "react-icons/fa"; // icons for reply + mention
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

// Icon mapping for notification type
const getIcon = (type) => {
  switch (type) {
    case "call":
      return <MdCall className="text-[#2E7D32] text-xl" />;
    case "text":
      return <MdMessage className="text-[#1565C0] text-xl" />;
    default:
      return <HiOutlineExclamation className="text-[#FBC02D] text-xl" />;
  }
};

// Badge component (reusable + professional)
const Badge = ({ icon, text, color }) => {
  return (
    <span
      className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide ${color}`}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {text}
    </span>
  );
};

const NotificationList = () => {
  const { notifications, markAsSeen, clearNotifications, setNotificationOpen } =
    useContext(NotificationContext);
  const { authDetails } = useContext(AuthContext);

  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const filteredNotifications = useMemo(() => {
    if (filter === "read") return notifications.filter((n) => n.seen);
    if (filter === "unread") return notifications.filter((n) => !n.seen);
    return notifications;
  }, [filter, notifications]);

  const handleNotificationClick = (n, isGroup) => {
    markAsSeen(n?.data?.id);

    if (n.message && n.user_type) {
      if (isGroup) {
        navigate(`/dashboard/group/${n?.data?.user_to}/chat`);
      } else {
        navigate(`/dashboard/user/${n?.data?.user_id}/chat`, {
          state: {
            contact_id_encrypt: n?.sender?.id_en,
            contact_id: n?.sender?.id,
            contact_name: n?.sender?.name,
          },
        });
      }
      setNotificationOpen(false);
    }
  };

  return (
    <div
      className="p-4 w-80 md:w-[500px] rounded-xl shadow-md border bg-white"
      style={{ borderColor: "#cfd8dc" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-[#556b2f]">
          Notifications
        </h2>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-sm font-medium text-[#d32f2f]"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        {["all", "unread", "read"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              filter === f
                ? "bg-[#556b2f] text-white"
                : "bg-[#eceff1] text-[#455a64]"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filteredNotifications.length === 0 ? (
        <p className="text-sm text-center py-10 text-[#607d8b]">
          No notifications to show.
        </p>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto px-1">
          <AnimatePresence initial={false}>
            {filteredNotifications.map((n) => {
              const isGroup = n.user_type === "group";
              const borderColor = n.seen
                ? "#90a4ae"
                : isGroup
                ? "#1976d2"
                : "#388e3c";

              const bgColor = n.seen ? "#ffffff" : "#f1f8e9";

              return (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleNotificationClick(n, isGroup)}
                  className="cursor-pointer rounded-lg border-l-4 p-3 shadow-sm flex flex-col gap-1 transition-colors duration-200"
                  style={{
                    borderLeftColor: borderColor,
                    backgroundColor: bgColor,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div>{getIcon(n.state)}</div>
                      <span
                        className={`font-semibold ${
                          n.seen ? "text-[#607d8b]" : "text-[#263238]"
                        }`}
                      >
                        {n.sender?.name || "System"}
                      </span>

                      {/* Badges */}
                      {isGroup && (
                        <Badge text="GROUP" color="bg-blue-100 text-blue-700" />
                      )}

                      {n?.data?.tag_mess && (
                        <Badge
                          icon={<FaReply />}
                          text="REPLY"
                          color="bg-green-100 text-green-700"
                        />
                      )}

                      {n?.data?.tag_user?.includes(authDetails?.user_enid) && (
                        <Badge
                          icon={<FaAt />}
                          text="MENTIONED"
                          color="bg-purple-100 text-purple-700"
                        />
                      )}
                    </div>

                    <span className="text-xs font-mono text-[#78909c]">
                      {new Date(n?.data?.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-sm line-clamp-2 text-[#37474f]">
                    {n.message}
                  </p>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
