import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion } from "framer-motion";
import CustomAudioMessage from "./CustomAudioMessage";
import ChatFilePreview from "./ChatFilePreview";
import ChatCallInvite from "./ChatCallInvite";
import { ChatContext } from "../../context/ChatContext";
import { parseHtml } from "../../utils/formmaters";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { ReplyPreview } from "../../utils/chat/messageUtils";
import { AuthContext } from "../../context/AuthContext";
import { MeetingContext } from "../../context/MeetingContext";
import audioController from "../../utils/audioController";

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

const MAX_LENGTH = 200; // adjust based on your previous value

interface ChatMessageProps {
  msg: any;
  selectedChatUser: any;
  messagesById?: Map<any, any>;
  messageRefs: React.RefObject<Map<string, HTMLElement>>;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  msg,
  selectedChatUser,
  messagesById = new Map(),
  messageRefs,
}) => {
  const {
    settings,
    setShowCall,
    setMeetingId,
    showToggleSwitch,
    setReplyTo,
    scrollToMessage,
  } = useContext(ChatContext);
  const { setProviderMeetingId } = useContext(MeetingContext);
  const { authDetails } = useContext(AuthContext) as any;

  const [isVisible, setIsVisible] = useState(
    Boolean(settings?.hide_message === 1)
  );
  const [userToggled, setUserToggled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Swipe/drag state
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const lastDeltaRef = useRef(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Always run effects/hooks
  useEffect(() => {
    if (!userToggled) setIsVisible(Boolean(settings?.hide_message === 1));
  }, [settings.hide_message, userToggled]);

  useEffect(() => {
    setIsExpanded(false);
  }, [msg?.id, msg?.updated_at]);

  const isMine = useMemo(() => msg?.is_my_chat === "yes", [msg]);

  const handleAcceptCall = useCallback(
    (m: { message: string }) => {
      const meetingId = m?.message?.split("CALL_INVITE:")[1];
      audioController.stopRingtone();
      setMeetingId(meetingId);
      setProviderMeetingId(meetingId);
      setShowCall(true);
    },
    [setShowCall, setMeetingId, setProviderMeetingId]
  );

  const doReply = useCallback(() => {
    if (typeof setReplyTo === "function")
      setReplyTo({
        ...msg,
        contact_id: selectedChatUser?.contact_id,
        contact_id_encrypt: selectedChatUser?.contact_id_encrypt,
        contact_name: selectedChatUser?.contact_name,
        user_type: "user",
      });
  }, [msg, selectedChatUser, setReplyTo]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    lastDeltaRef.current = 0;
    setIsDragging(true);
    try {
      if (e.pointerId && (e.target as Element).setPointerCapture)
        (e.target as Element).setPointerCapture(e.pointerId);
    } catch {}
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!startRef.current) return;
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      lastDeltaRef.current = dx;
      // direction lock: horizontal must dominate vertical
      if (Math.abs(dx) < Math.abs(dy) * 1.2) {
        setOffsetX(0);
        return;
      }
      const allowed = isMine ? dx < 0 : dx > 0;
      const visual = allowed ? Math.max(Math.min(dx, 80), -80) : 0;
      setOffsetX(visual);
    },
    [isMine]
  );

  const onPointerUp = useCallback(
    (e?: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(false);
      const dx = lastDeltaRef.current || 0;
      startRef.current = null;
      lastDeltaRef.current = 0;
      if (!isMine && dx >= 50) doReply();
      else if (isMine && dx <= -50) doReply();
      setOffsetX(0);
    },
    [isMine, doReply]
  );

  const repliedMsg = useMemo(() => {
    const tag = {
      id: msg?.tag_mess_id,
      message: msg?.tag_mess,
      user_id: msg?.tag_mess_user,
    };
    return tag; //&& messagesById?.get ? messagesById.get(tag) : null;
  }, [msg, messagesById]);

  const messageKey = useMemo(() => String(msg?.id), [msg]);

  const attachRef = useCallback(
    (el: any) => {
      if (!messageRefs?.current) return;
      if (el) messageRefs.current.set(messageKey, el);
      else messageRefs.current.delete(messageKey);
    },
    [messageKey, messageRefs]
  );

  // Safe render function to avoid conditional hooks
  const renderMessageContent = () => {
    if (msg?.mss_type === "audio")
      return <CustomAudioMessage audioSrc={msg?.audio} />;
    if (msg?.is_file === "yes" && msg?.message)
      return (
        <ChatFilePreview
          isMyChat={isMine}
          fileType={(msg?.message || "").split(".").pop()}
          fileUrl={`${import.meta.env.VITE_BASE_URL}secure/${msg?.message}`}
          fileName={msg?.file_name}
        />
      );
    if (msg?.mss_type === "call")
      return (
        <ChatCallInvite
          msg={msg}
          isMyChat={isMine}
          onAcceptCall={() => handleAcceptCall(msg)}
          caller={selectedChatUser?.contact_name}
        />
      );
    return msg?.message?.length > MAX_LENGTH && !isExpanded ? (
      <>
        {msg?.message.slice(0, MAX_LENGTH)}...
        <button
          className="text-oliveHover ml-1"
          onClick={() => setIsExpanded(true)}
        >
          Read More
        </button>
      </>
    ) : (
      parseHtml(msg?.message)
    );
  };

  return (
    <div
      className={`message flex flex-col ${
        isMine ? "items-end" : "items-start"
      } gap-y-1 text-sm`}
    >
      {/* Toggle */}
      {showToggleSwitch && (
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isVisible}
              onChange={() => {
                setIsVisible(!isVisible);
                setUserToggled(true);
              }}
            />
            <div
              className={`w-10 h-5 rounded-full relative transition-all ${
                isMine
                  ? "bg-oliveDark peer-checked:bg-oliveGreen"
                  : "bg-gray-300 peer-checked:bg-oliveGreen"
              }`}
            >
              <motion.div
                className="absolute top-0 bottom-0 left-[2px] my-auto w-4 h-4 bg-white rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                animate={{ x: isVisible ? 19 : 0 }}
              />
            </div>
          </label>
        </div>
      )}

      {/* Message */}
      <div
        className="relative p-0 max-w-[75%] text-sm leading-relaxed"
        style={{ width: "fit-content" }}
        ref={attachRef}
      >
        <motion.div
          key={msg?.client_id ?? msg?.id ?? `tmp-${Math.random()}`}
          layout
          initial={{ opacity: 0.6, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1, x: offsetX }}
          exit={{ opacity: 0.6, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            touchAction: "pan-y",
            userSelect: isDragging ? "none" : "auto",
            display: "block",
          }}
          className="relative"
        >
          <div
            className={`p-2 pr-3 pb-4 rounded-xl shadow-md ${
              isMine ? "bg-oliveDark text-white" : "bg-white text-black"
            }`}
            style={{
              border: `1px solid rgba(255,255,255,0.04)`,
              borderTopRightRadius: isMine ? "4px" : "12px",
              borderTopLeftRadius: isMine ? "12px" : "4px",
            }}
            onClick={() => !showToggleSwitch && setIsVisible((v) => !v)}
            title={
              !showToggleSwitch && isVisible ? "Click to hide" : "Click to show"
            }
          >
            {/* Reply Preview */}
            {msg?.tag_mess && (
              <ReplyPreview
                target={repliedMsg}
                participants={[
                  {
                    member_id: selectedChatUser?.contact_id,
                    member_id_encrpt: selectedChatUser?.contact_id_encrypt,
                    member_name: selectedChatUser?.contact_name,
                  },
                ]}
                myId={authDetails?.user_enid ?? authDetails?.user?.id ?? null}
                onPreviewClick={() =>
                  repliedMsg?.id && scrollToMessage?.(String(repliedMsg.id))
                }
                type="user"
              />
            )}

            {/* Message content */}
            {isVisible ? (
              <motion.div
                key="content-visible"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
              >
                {renderMessageContent()}
              </motion.div>
            ) : (
              <motion.div
                key="content-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className={`${
                  showToggleSwitch ? "" : "cursor-pointer"
                } w-full max-w-60 md:max-w-80 rounded-md flex items-center relative font-bold tracking-widest break-all`}
                title={!showToggleSwitch ? "click to show" : "toggle to show"}
              >
                {msg?.message
                  ? "*".repeat(Math.min(msg.message.length, 300))
                  : "****"}
              </motion.div>
            )}
            {/* read receipts for mine */}
            {isMine && (
              <span className="ml-1 absolute bottom-1 right-1">
                {msg?.is_read === "yes" ? (
                  <IoCheckmarkDone size={14} className="text-oliveHover" />
                ) : (
                  <IoCheckmark size={14} className="text-gray-400" />
                )}
              </span>
            )}
          </div>
        </motion.div>
        {/* Timestamp */}
        <div
          className={`mt-1 text-xs text-gray-600 lg:text-gray-400 ${
            isMine ? "text-right" : "text-left"
          }`}
        >
          {timeFormatter.format(new Date(msg?.updated_at || Date.now()))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatMessage);
