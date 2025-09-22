import {
  COLORS,
  getPreviewText,
  isRecent,
  MAX_LENGTH,
  renderMessageContent,
  safeString,
} from "../../utils/chat/messageUtils";
import CustomAudioMessage from "../Chat/CustomAudioMessage";
import ChatFilePreview from "../Chat/ChatFilePreview";
import ChatCallInvite from "../Chat/ChatCallInvite";
import PropTypes from "prop-types";

function MessageContent({
  msg,
  isVisible,
  isExpanded,
  setIsExpanded,
  participants,
  onAcceptCall,
  isMine,
}) {
  const messageText = safeString(msg?.message);

  if (!isVisible) {
    return (
      <div
        className="break-all"
        style={{ color: COLORS.muted, userSelect: "none" }}
      >
        {"*".repeat(Math.min(messageText.length || 4, 200))}
      </div>
    );
  }

  // Audio
  if (msg?.type === "audio") return <CustomAudioMessage />;

  // File preview
  if (msg?.is_file === "yes" && messageText.length > 0) {
    const parts = messageText.split(".");
    const fileType = parts.length > 1 ? parts[parts.length - 1] : "file";
    return (
      <ChatFilePreview
        isMyChat={msg?.is_my_chat}
        fileType={fileType}
        fileUrl={`${import.meta.env.VITE_BASE_URL}secure/${messageText}`}
        fileName={msg?.file_name}
      />
    );
  }

  // Call invite
  if (messageText.startsWith("CALL_INVITE")) {
    return (
      <ChatCallInvite
        msg={msg}
        isMyChat={isMine}
        onAcceptCall={onAcceptCall}
        status={isRecent(msg?.updated_at, 30) ? "Ringing..." : "Call Ended"}
        caller={msg?.sender?.member_name || "Unknown"}
      />
    );
  }

  // Rendered preview (use this length to decide "Read More")
  const rendered = renderMessageContent(msg, participants);
  const previewText = getPreviewText(rendered) ?? "";

  // Long text preview + read more — use previewText length (not raw message string)
  if (previewText.length > MAX_LENGTH && !isExpanded) {
    const short = previewText.slice(0, MAX_LENGTH);
    return (
      <>
        {short}...
        <button
          className="text-xs ml-1 font-medium"
          style={{ color: COLORS.brass }}
          onClick={() => setIsExpanded(true)}
          aria-label="Read full message"
        >
          Read More
        </button>
      </>
    );
  }

  // Default: render actual content (full)
  return <div className="whitespace-pre-wrap break-words">{rendered}</div>;
}

MessageContent.propTypes = {
  msg: PropTypes.object.isRequired,
  isVisible: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  setIsExpanded: PropTypes.func.isRequired,
  participants: PropTypes.array,
  onAcceptCall: PropTypes.func,
  isMine: PropTypes.bool,
};

export default MessageContent;
