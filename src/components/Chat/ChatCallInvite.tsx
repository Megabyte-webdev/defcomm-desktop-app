import React, { useContext, useEffect, useMemo } from "react";
import { MdCall, MdCallEnd, MdCallMissed } from "react-icons/md";
import { ChatContext } from "../../context/ChatContext";
import audioController from "../../utils/audioController";
import callerTone from "../../assets/audio/caller.mp3";
import receiverTone from "../../assets/audio/receiver.mp3";

interface ChatCallInviteProps {
  msg: any;
  isMyChat: boolean;
  onAcceptCall: () => void;
  caller?: string;
}

function parseTimestamp(val: any): number | null {
  if (!val && val !== 0) return null;
  const n = Number(val);
  if (!Number.isNaN(n)) {
    if (n < 1e11) return Math.floor(n * 1000);
    return Math.floor(n);
  }
  const parsed = Date.parse(String(val));
  return Number.isNaN(parsed) ? null : parsed;
}

function extractMeetingIdFromMessage(message?: string) {
  if (!message || typeof message !== "string") return null;
  if (!message.startsWith("CALL_INVITE")) return null;
  const parts = message.split(":");
  return parts[1] ?? null;
}

function formatDurationSeconds(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return null;
  const secs = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  const mins = Math.floor((totalSeconds / 60) % 60)
    .toString()
    .padStart(2, "0");
  const hrs = Math.floor(totalSeconds / 3600);
  if (hrs > 0) return `${hrs}:${mins}:${secs}`;
  return `${mins}:${secs}`;
}

function ChatCallInvite({
  msg,
  isMyChat,
  onAcceptCall,
  caller,
}: ChatCallInviteProps) {
  const { callMessage } = useContext(ChatContext);

  const msgIdEn = msg?.id_en ?? null;
  const msgMeetingId = useMemo(
    () => extractMeetingIdFromMessage(msg?.message),
    [msg]
  );

  const callMsgMatches = useMemo(() => {
    if (!callMessage) return false;
    try {
      const cm: any = callMessage;
      return (
        (cm.id && msgIdEn && String(cm.id) === String(msgIdEn)) ||
        (cm.meetingId &&
          msgMeetingId &&
          String(cm.meetingId) === String(msgMeetingId))
      );
    } catch {
      return false;
    }
  }, [callMessage, msgIdEn, msgMeetingId]);

  const inferredState = useMemo(() => {
    if (callMessage && callMsgMatches) {
      return callMessage.status || "ringing";
    }
    if (msg?.call_state === "pick" || msg?.call_state === "miss") {
      return msg.call_state;
    }
    if (
      msg?.mss_type === "call" &&
      typeof msg?.message === "string" &&
      msg.message.startsWith("CALL_INVITE")
    ) {
      const ts = parseTimestamp(msg?.updated_at ?? msg?.created_at ?? null);
      if (ts) {
        const secondsAgo = (Date.now() - ts) / 1000;
        const RINGING_THRESHOLD_SECONDS = 60;
        return secondsAgo <= RINGING_THRESHOLD_SECONDS ? "ringing" : "miss";
      }
      return "ringing";
    }
    return "miss";
  }, [callMessage, callMsgMatches, msg]);

  const callDuration = useMemo(() => {
    if (msg?.call_duration) return msg.call_duration;
    const startTs = parseTimestamp(msg?.call_started_at ?? msg?.call_start);
    const endTs = parseTimestamp(msg?.call_ended_at ?? msg?.call_end);
    if (startTs && endTs && endTs > startTs) {
      const secs = Math.floor((endTs - startTs) / 1000);
      return formatDurationSeconds(secs);
    }
    return null;
  }, [msg]);

  useEffect(() => {
    const isRinging =
      inferredState === "ringing" &&
      !(callMsgMatches && callMessage?.status === "on");
    if (isRinging) {
      const ringtone = isMyChat ? callerTone : receiverTone;
      audioController.playRingtone(ringtone, true);
    } else {
      audioController.stopRingtone();
    }
    return () => {
      audioController.stopRingtone();
    };
  }, [inferredState, callMessage, callMsgMatches, isMyChat]);

  const getMessageText = () => {
    if (
      callMsgMatches &&
      (callMessage?.status === "on" || inferredState === "on")
    )
      return isMyChat
        ? "You are in the call"
        : `${caller || "They"} is in the call`;
    if (inferredState === "miss")
      return isMyChat
        ? `${msg.user_to_name || "They"} missed your call`
        : "You missed the call";
    if (inferredState === "pick")
      return isMyChat
        ? `${msg.user_to_name || "They"} picked the call`
        : "You picked the call";
    if (inferredState === "ringing")
      return isMyChat
        ? "You are calling..."
        : `${caller || "They"} is calling...`;
    return isMyChat ? "You called" : `${caller || "They"} called`;
  };

  const getStatusText = () => {
    if (
      callMsgMatches &&
      (callMessage?.status === "on" || inferredState === "on")
    )
      return "Call Ongoing";
    if (inferredState === "pick") return "Call Ended";
    if (inferredState === "miss") return "Missed Call";
    return inferredState === "ringing" ? "Ringing..." : "Call Ended";
  };

  const getIcon = () => {
    if (
      callMsgMatches &&
      (callMessage?.status === "on" || inferredState === "on")
    )
      return <MdCall size={24} className="text-green-500 animate-pulse" />;
    if (inferredState === "miss")
      return <MdCallMissed size={24} className="text-red-500" />;
    if (inferredState === "pick")
      return <MdCallEnd size={24} className="text-green-500" />;
    const isRinging = inferredState === "ringing";
    const className = isRinging ? "text-green-500" : "text-gray-400";
    return <MdCall size={24} className={className} />;
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
      <div className="flex flex-col flex-1 min-w-0">
        <span className="truncate">{getMessageText()}</span>
        <span
          className={`text-xs ${
            inferredState === "pick"
              ? "text-green-600"
              : inferredState === "miss"
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {getStatusText()}
        </span>
        {inferredState === "pick" && callDuration && (
          <span
            className={`text-xs ${
              isMyChat ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Duration: {callDuration}
          </span>
        )}
      </div>

      {inferredState === "ringing" &&
        !(callMsgMatches && callMessage?.status === "on") && (
          <button
            onClick={onAcceptCall}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            {isMyChat ? "Join" : "Accept"}
          </button>
        )}

      {callMsgMatches &&
        (callMessage?.status === "on" || inferredState === "on") && (
          <button className="bg-olive/80 hover:bg-olive text-white px-3 py-1 rounded text-sm">
            Return
          </button>
        )}
    </div>
  );
}

export default ChatCallInvite;
