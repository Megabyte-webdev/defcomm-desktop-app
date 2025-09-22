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
import useGroups from "../hooks/useGroup";
import useGroupChannels from "../hooks/useGroupChannel";

const DashboardWrapper = () => {
  const { authDetails } = useContext(AuthContext);
  const { setProviderMeetingId } = useContext(MeetingContext);

  const { useFetchGroups } = useGroups();
  const { data: groups } = useFetchGroups();

  const {
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

  // Group Channel
  useGroupChannels({
    token: authDetails?.access_token,
    groups,
  });

  // PUSHER LISTENER
  usePusherChannel({
    userId: authDetails?.user_enid,
    token: authDetails?.access_token,
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
