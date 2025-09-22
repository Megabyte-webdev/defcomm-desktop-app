import { useContext, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { GroupContext } from "../context/GroupContext";
import { onNewNotificationToast } from "../utils/notifications/onNewMessageToast";
import { NotificationContext } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../context/ChatContext";

const useGroupChannels = ({ groups, token }) => {
  const pusherRef = useRef(null);
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);
  const { chatVisibility } = useContext(ChatContext);
  const { setGroupUserTyping, setGroupConnections } = useContext(GroupContext);
  const { addNotification, markAsSeen } = useContext(NotificationContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token || !groups?.length) return;

    // Disconnect previous instance
    if (pusherRef.current) {
      pusherRef.current.disconnect();
    }

    // Create Pusher instance
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: "mt1",
      wsHost: import.meta.env.VITE_PUSHER_HOST,
      forceTLS: true,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      authEndpoint: import.meta.env.VITE_PUSHER_AUTH_ENDPOINT,
      auth: { headers: { Authorization: `Bearer ${token}` } },
    });

    // Subscribe to all joined groups
    groups.forEach((group) => {
      const channelName = `private-group.${group.group_id}`;
      const channel = pusher.subscribe(channelName);

      channel.bind("pusher:subscription_succeeded", () => {
        setGroupConnections((prev) => ({
          ...prev,
          [group.group_id]: "connected",
        }));
        //toast.success(`Connected to ${group.group_name}`);
      });

      channel.bind("pusher:subscription_error", () => {
        setGroupConnections((prev) => ({
          ...prev,
          [group.group_id]: "error",
        }));
        //toast.error(`Failed to connect to ${group.group_name}`);
      });

      channel.bind("group.message.sent", ({ data }) => {
        const senderId = data?.data?.user_id;
        console.log("Group message received:", data);

        // Typing indicator
        if (data?.state === "is_typing") {
          setGroupUserTyping?.((prev) => ({
            ...prev,
            [data?.sender_id]: true,
          }));
          return;
        } else if (data?.state === "not_typing") {
          setGroupUserTyping?.((prev) => ({
            ...prev,
            [data?.sender_id]: false,
          }));
          return;
        }

        if (!senderId) return;

        // Show toast if not my message
        if (senderId !== authDetails?.user_enid) {
          addNotification(data);
          onNewNotificationToast({
            senderName: data?.sender?.name,
            message: data?.message,
            type: "group",
            groupName: group.group_name,
            onClick: () => {
              markAsSeen(data?.data?.id);
              navigate(`/dashboard/group/${data?.data?.user_to}/chat`);
            },
            isChatVisible: chatVisibility,
            tagMess: data?.data?.tag_mess,
            tagUser: data?.data?.tag_user,
            myId: authDetails?.user_enid,
          });
        }

        // Cache management for that group's messages
        queryClient.setQueryData(["groupMessages", group.group_id], (old) => {
          if (!old?.data) return old;
          const exists = old.data.some((msg) => msg.id === data.data.id);
          const isMyChat = data.data.user_id === authDetails?.user?.id;
          return exists
            ? old
            : {
                ...old,
                data: [
                  ...old.data,
                  {
                    ...data.data,
                    message: data?.message,
                    is_my_chat: isMyChat ? "yes" : "no",
                  },
                ].sort(
                  (a, b) => new Date(a.created_at) - new Date(b.created_at)
                ),
              };
        });
      });
    });

    pusherRef.current = pusher;

    // Cleanup
    return () => {
      groups.forEach((group) => {
        pusher.unsubscribe(`private-group.${group.group_id}`);
      });
      pusher.disconnect();
    };
  }, [token, groups]);

  return () => {
    try {
      pusherRef.current?.disconnect();
    } catch (e) {
      console.warn("Cleanup error:", e);
    }
  };
};

export default useGroupChannels;
