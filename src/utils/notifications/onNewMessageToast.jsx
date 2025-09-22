import { toast } from "react-toastify";
import {
  FaCommentDots,
  FaPhoneAlt,
  FaUsers,
  FaReply,
  FaAt,
} from "react-icons/fa";
import audioController from "../audioController";
import notificationSound from "../../assets/audio/bell.mp3";

// 👇 import Tauri notification plugin
import {
  requestPermission,
  isPermissionGranted,
  sendNotification,
} from "@tauri-apps/plugin-notification";

export const onNewNotificationToast = async ({
  groupName,
  senderName,
  message,
  type = "message", // "message" | "call"
  onClick = () => {},
  isChatVisible = false,
  tagUser = null,
  tagMess = null,
  myId = null,
}) => {
  const isCall = type === "call";
  const isGroup = Boolean(groupName);
  const isReply = Boolean(tagMess);

  // handle mention: if group & tagUser contains me
  const isMention = isGroup && tagUser && tagUser.includes(myId);

  audioController.playRingtone(notificationSound);

  const safeMessage =
    isChatVisible && !isCall
      ? "**********"
      : isCall
      ? "📞 Incoming Secure Call"
      : message || "New encrypted message";

  // 🔔 Tauri System Notification
  try {
    let permission = await isPermissionGranted();
    if (!permission) {
      const req = await requestPermission();
      permission = req === "granted";
    }

    if (permission) {
      await sendNotification({
        title: isCall ? "Incoming Call" : groupName || "New Message",
        body: `${senderName}: ${safeMessage}`,
      });
    }
  } catch (err) {
    console.warn("Notification error:", err);
  }

  // 🔔 In-App Toast
  const toastComponent = (
    <div
      className={`flex items-start gap-3 cursor-pointer w-[380px] max-w-full p-4 rounded-lg shadow-lg 
        ${
          isMention
            ? "bg-[#2d1f1f] border-red-600"
            : "bg-[#1b1f1b] border-[#3a4a3a]"
        } 
        hover:bg-[#232823] transition`}
      onClick={onClick}
    >
      {/* Avatar / Icon */}
      <div className="flex-shrink-0">
        {isCall ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-900 border border-green-600">
            <FaPhoneAlt className="text-green-400 text-lg" />
          </div>
        ) : isMention ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-900 border border-red-600">
            <FaAt className="text-red-400 text-lg" />
          </div>
        ) : isGroup ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-900 border border-green-600">
            <FaUsers className="text-green-400 text-lg" />
          </div>
        ) : isReply ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-olive-900 border border-olive-600">
            <FaReply className="text-olive-300 text-lg" />
          </div>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-olive-900 border border-olive-600">
            <FaCommentDots className="text-olive-300 text-lg" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col leading-snug overflow-hidden">
        {isGroup && (
          <p className="text-[12px] uppercase tracking-wide font-bold text-gray-400 mb-1">
            {groupName}
          </p>
        )}

        <div className="flex flex-col">
          <span
            className={`font-semibold text-sm line-clamp-2 ${
              isMention ? "text-red-400" : "text-green-300"
            }`}
          >
            {senderName} {isMention && "(mentioned you)"}
          </span>

          {isReply && (
            <span className="text-xs italic text-gray-400 truncate">
              Replying {tagUser ? `to ${tagUser}` : "to a message"}
            </span>
          )}

          <span className="text-sm text-gray-200 break-words line-clamp-2">
            {safeMessage}
          </span>
        </div>
      </div>
    </div>
  );

  toast(toastComponent, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    className: "bg-transparent shadow-none m-2",
  });
};
