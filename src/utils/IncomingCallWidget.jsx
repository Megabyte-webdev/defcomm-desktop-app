import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { MeetingContext } from "../context/MeetingContext";
import { MdCall, MdCallEnd, MdVolumeOff, MdVolumeUp } from "react-icons/md";
import audioController from "../utils/audioController";
import { formatCallDuration } from "../utils/formmaters";
import useChat from "../hooks/useChat";

const IncomingCallWidget = () => {
  const { callMessage, setCallMessage, setShowCall, setMeetingId } =
    useContext(ChatContext);
  const { setProviderMeetingId } = useContext(MeetingContext);
  const { updateCallLog } = useChat();

  const [show, setShow] = useState(false);
  const [muted, setMuted] = useState(false);
  const timeoutRef = useRef(null);
  const callHandledRef = useRef(false); // Prevent multiple triggers

  useEffect(() => {
    if (callMessage?.status === "ringing") {
      setShow(true);
      callHandledRef.current = false;
      audioController.playRingtone();

      // Auto-miss after 10s
      timeoutRef.current = setTimeout(() => {
        if (!callHandledRef.current) {
          handleReject(true); // autoMiss = true
        }
      }, 10000);
    } else {
      setShow(false);
      audioController.stopRingtone();
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [callMessage]);

  const handleAccept = () => {
    if (callHandledRef.current) return;
    callHandledRef.current = true;

    clearTimeout(timeoutRef.current);
    audioController.stopRingtone();
    setMeetingId(callMessage?.meetingId);
    setProviderMeetingId(callMessage?.meetingId);
    setShowCall(true);
    setShow(false);
  };

  const handleReject = async (autoMiss = false) => {
    if (callHandledRef.current) return;
    callHandledRef.current = true;

    clearTimeout(timeoutRef.current);
    audioController.stopRingtone();

    try {
      await updateCallLog.mutateAsync({
        mss_id: callMessage?.id || callMessage?.msg_id,
        call_duration: formatCallDuration(0),
        call_state: "miss",
        recieve_user_id: callMessage?.user_id,
        auto_miss: autoMiss,
      });
    } catch (error) {
      console.warn("Call rejection log failed:", error);
    }

    setCallMessage(null);
    setShow(false);
  };

  const handleToggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      audioController.setMuted(next);
      return next;
    });
  };

  if (!show || !callMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[320px] bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 animate-slideInUp">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
          {callMessage?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold text-gray-900">Incoming Call</p>
          <p className="text-sm text-gray-600 truncate">{callMessage?.name}</p>
        </div>
        <button
          onClick={handleToggleMute}
          title={muted ? "Unmute Ringtone" : "Mute Ringtone"}
          className="text-gray-500 hover:text-gray-700"
        >
          {muted ? <MdVolumeOff size={22} /> : <MdVolumeUp size={22} />}
        </button>
      </div>

      <div className="mt-4 flex justify-around">
        <button
          onClick={handleAccept}
          className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center"
        >
          <MdCall size={24} />
        </button>
        <button
          onClick={() => handleReject(false)}
          className="bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center"
        >
          <MdCallEnd size={24} />
        </button>
      </div>
    </div>
  );
};

export default IncomingCallWidget;
