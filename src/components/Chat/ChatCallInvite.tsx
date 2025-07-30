import React, { useContext, useEffect } from "react";
import { MdCall, MdCallEnd, MdCallMissed } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import audioController from "../../utils/audioController";

// You may need to update these paths
import callerTone from "../../assets/audio/caller.mp3";
import receiverTone from "../../assets/audio/receiver.mp3";

interface ChatCallInviteProps {
  msg: any;
  isMyChat: boolean;
  onAcceptCall: () => void;
  status: string;
  caller: string;
}

function ChatCallInvite({
  msg,
  isMyChat,
  onAcceptCall,
  status,
  caller,
}: ChatCallInviteProps) {
  const { authDetails } = useContext(AuthContext);
  const { callMessage } = useContext(ChatContext);

  const isCallActive =
    Number(callMessage?.msg_id) === Number(msg?.id) &&
    callMessage?.status === "on";

  const callState = msg?.call_state || "ringing";

  // 🔊 Play ringtone when ringing
  useEffect(() => {
    if (status === "Ringing...") {
      const ringtone = isMyChat ? callerTone : receiverTone;
      audioController.playRingtone(ringtone, true);
    } else {
      audioController.stopRingtone();
    }

    return () => {
      audioController.stopRingtone();
    };
  }, [callState, status]);

  // 📝 Main call message text
  const getMessageText = () => {
    if (isCallActive)
      return isMyChat ? "You are in the call" : `${caller} is in the call`;

    if (callState === "miss") {
      return isMyChat
        ? `${msg.user_to_name || "They"} missed your call`
        : "You missed the call";
    }

    if (callState === "pick") {
      return isMyChat
        ? `${msg.user_to_name || "They"} picked the call`
        : "You picked the call";
    }

    if (status === "Ringing...") {
      return isMyChat ? "You are calling..." : `${caller} is calling...`;
    }

    return isMyChat ? "You called" : `${caller} called`;
  };

  // 📡 Call status indicator
  const getStatusText = () => {
    if (isCallActive) return "Call Ongoing";
    if (callState === "pick") return "Call Ended";
    if (callState === "miss") return "Missed Call";
    return status;
  };

  // 📞 Call icon
  const getIcon = () => {
    if (isCallActive)
      return <MdCall size={24} className="text-green-500 animate-pulse" />;
    if (callState === "miss")
      return <MdCallMissed size={24} className="text-red-500" />;
    if (callState === "pick")
      return <MdCallEnd size={24} className="text-green-500" />;
    return (
      <MdCall
        size={24}
        className={`text-${status === "Ringing..." ? "green" : "gray"}-500`}
      />
    );
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-3 p-3 rounded-lg w-full shadow-md font-medium text-sm ${
        isMyChat
          ? "bg-oliveLight text-white self-end"
          : "bg-gray-100 text-black self-start"
      }`}
    >
      {getIcon()}
      <div className="flex flex-col">
        <span className="truncate">{getMessageText()}</span>
        <span
          className={`text-xs ${
            callState === "pick"
              ? "text-green-600"
              : callState === "miss"
              ? "text-red-500"
              : isCallActive
              ? "text-green-600"
              : "text-gray-500"
          }`}
        >
          {getStatusText()}
        </span>

        {callState === "pick" && msg.call_duration && (
          <span className="text-xs text-gray-600">
            Duration: {msg.call_duration}
          </span>
        )}
      </div>

      {/* ✅ Accept or Join button (only when ringing and not active) */}
      {callState === "ringing" && status === "Ringing..." && !isCallActive && (
        <button
          onClick={onAcceptCall}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
        >
          {isMyChat ? "Join" : "Accept"}
        </button>
      )}

      {/* 🔁 Return button for ongoing call */}
      {isCallActive && (
        <button className="bg-olive/80 hover:bg-olive text-white px-3 py-1 rounded text-sm">
          Return
        </button>
      )}
    </div>
  );
}

export default ChatCallInvite;
