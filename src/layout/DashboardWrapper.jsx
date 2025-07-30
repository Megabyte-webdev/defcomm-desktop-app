import { useContext, useMemo, useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { DashboardContext } from "../context/DashboardContext";
import { ChatContext } from "../context/ChatContext";
import { MeetingContext } from "../context/MeetingContext";
import useChat from "../hooks/useChat";
import Modal from "../components/modal/Modal";
import CallComponent from "../components/video-sdk/CallComponent";
import Settings from "../pages/Settings";
import usePusherChannel from "../hooks/usePusherChannel";
import { FaPhone } from "react-icons/fa6";
import IncomingCallWidget from "../utils/IncomingCallWidget";
import audioController from "../utils/audioController";
import AddContactInterface from "../components/dashboard/AddContactInterface";

const DashboardWrapper = () => {
  const queryClient = useQueryClient();
  const { authDetails } = useContext(AuthContext);
  const userId = authDetails?.user?.id; // ✅ ADD THIS

  const {
    conference,
    showConference,
    setShowConference,
    setProviderMeetingId,
  } = useContext(MeetingContext);

  const {
    setSelectedChatUser,
    setTypingUsers,
    showCall,
    setShowCall,
    showSettings,
    setShowSettings,
    showContactModal,
    setShowContactModal,
    setCallMessage,
    setMeetingId,
    meetingId,
    setCallDuration,
  } = useContext(ChatContext);

  const { state, dispatch } = useContext(DashboardContext);
  const { fetchContacts } = useChat();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    enabled: state?.type === "CHAT",
    staleTime: 0,
  });

  // ✅ PUSHER LISTENER
  usePusherChannel({
    userId: authDetails?.user?.id,
    token: authDetails?.access_token,
    onNewMessage: (newMessage) => {
      const senderId = newMessage?.data?.user_id;

      if (newMessage?.state === "is_typing") {
        setTypingUsers((prev) => {
          if (prev[newMessage?.sender_id]) return prev;
          return { ...prev, [newMessage?.sender_id]: true };
        });
        return;
      } else if (newMessage?.state === "not_typing") {
        setTypingUsers((prev) => {
          if (!prev[newMessage?.sender_id]) return prev;
          return { ...prev, [newMessage?.sender_id]: false };
        });
        return;
      }

      if (!senderId) return;

      const existingData = queryClient.getQueryData(["chatMessages", senderId]);

      if (newMessage?.state === "callUpdate") {
        if (newMessage?.mss?.id === callMessage?.msg_id) {
          setCallMessage((prev) => ({
            ...prev,
            ...newMessage?.mss,
            call_state: newMessage?.call?.call_state,
          }));

          setCallDuration(newMessage?.call?.call_duration || 0);
        }

        queryClient.setQueryData(
          ["chatMessages", newMessage?.sender?.id],
          (old) => {
            if (!old || !Array.isArray(old.data)) return old;
            return {
              ...old,
              data: old.data.map((msg) =>
                msg.id === newMessage?.mss?.id
                  ? {
                      ...msg,
                      call_state: newMessage?.call?.call_state,
                      call_duration: newMessage?.call?.call_duration,
                    }
                  : msg
              ),
            };
          }
        );

        // ✅ Handle missed call for receiver
        if (
          newMessage?.call?.call_state === "miss" &&
          newMessage?.call?.receiver_id === userId
        ) {
          setShowCall(false);
          setCallMessage(null);
          setProviderMeetingId(null);
          audioController.stopRingtone();
        }

        return;
      }

      if (!existingData) {
        queryClient.invalidateQueries(["chatMessages", senderId]);
        return;
      }

      queryClient.setQueryData(["chatMessages", senderId], (old) => {
        if (!old || !Array.isArray(old.data)) return old;
        const exists = old.data.some((msg) => msg.id === newMessage.data.id);
        const isMyChat = newMessage.data.user_id === authDetails?.user?.id;
        return exists
          ? old
          : {
              ...old,
              data: [
                ...old.data,
                {
                  ...newMessage.data,
                  message: newMessage?.message,
                  is_my_chat: isMyChat ? "yes" : "no",
                },
              ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
            };
      });
    },
  });

  return (
    <main
      className="h-screen w-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, #36460A 10%, #000000 40%)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Outlet />

      {showCall && (
        <Modal
          isOpen={showCall}
          closeModal={() => {
            setShowCall(false);
            setCallMessage(null);
            setProviderMeetingId(null);
            setMeetingId(null);
            setCallDuration(0);
            audioController.stopRingtone();
          }}
          canMinimize={true}
          minimizedContent={
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-sm font-semibold flex items-center gap-2">
                <FaPhone /> Secure Call
              </span>
            </div>
          }
        >
          <CallComponent
            initialMeetingId={meetingId}
            setInitialMeetingId={setMeetingId}
          />
        </Modal>
      )}
      {showSettings && (
        <Modal
          isOpen={showSettings}
          closeModal={() => setShowSettings(false)}
          minimizedContent="Settings"
        >
          <Settings />
        </Modal>
      )}
      {showContactModal && (
        <Modal
          isOpen={showContactModal}
          closeModal={() => setShowContactModal(false)}
        >
          <AddContactInterface />
        </Modal>
      )}
      <IncomingCallWidget />
    </main>
  );
};

export default DashboardWrapper;
