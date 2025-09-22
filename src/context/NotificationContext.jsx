import React, { createContext, useState, useEffect } from "react";
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = sessionStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleNotificationModal = () => {
    // if (!notificationOpen) markAllAsSeen();
    setNotificationOpen((prev) => !prev);
  };

  useEffect(() => {
    sessionStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif) => {
    const newNotif = { ...notif, seen: false };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);
  };

  const markAsSeen = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n?.data?.id === id ? { ...n, seen: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    sessionStorage.removeItem("notifications");
  };

  const unseenCount = notifications.filter((n) => !n.seen).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsSeen,
        clearNotifications,
        unseenCount,
        notificationOpen,
        setNotificationOpen,
        toggleNotificationModal,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
