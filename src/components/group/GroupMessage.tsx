import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import {
  COLORS,
  ReplyPreview,
  resolveTaggedUsers,
  timeFormatter,
  SWIPE_TRIGGER_PX,
  SWIPE_MAX_VISUAL,
  DIRECTION_LOCK_RATIO,
} from "../../utils/chat/messageUtils";
import AvatarRow from "./AvatarRow";
import { groupMessageType } from "../../utils/types/chat";
import ToggleSwitch from "../ToggleSwitch";
import MessageContent from "./MessageContent";
import TaggedRow from "./TaggedRow";
interface GroupMessageProps {
  msg: any;
  sender?: any;
  showAvatar?: boolean;
  isLastInGroup?: boolean;
  participants?: any[];
  messagesById?: Map<string, any>;
  messageRefs: React.RefObject<Map<string, HTMLElement>>;
}

function GroupMessage({
  msg,
  sender = {} as any,
  showAvatar = true,
  isLastInGroup = false,
  participants = [],
  messagesById = new Map(),
  messageRefs,
}: GroupMessageProps) {
  const { authDetails } = useContext(AuthContext) as any;
  const {
    settings: { hide_message: chatVisibility },
    setShowCall,
    setMeetingId,
    showToggleSwitch,
    setReplyTo,
    scrollToMessage,
  } = useContext(ChatContext) as any;

  const [isVisible, setIsVisible] = useState(Boolean(chatVisibility));
  const [userToggled, setUserToggled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // swipe state
  const startRef = useRef<any>(null);
  const lastDeltaRef = useRef(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!userToggled) setIsVisible(Boolean(chatVisibility));
  }, [chatVisibility, userToggled]);

  useEffect(() => {
    // reset expanded when message changes
    setIsExpanded(false);
  }, [msg?.id, msg?.updated_at]);

  const isMine = useMemo(() => {
    const myId = authDetails?.user_enid ?? authDetails?.user?.id ?? null;
    if (!msg) return false;
    if (msg.user_id) return String(msg.user_id) === String(myId);
    return msg?.is_my_chat === "yes";
  }, [msg, authDetails]);

  const taggedUsers = useMemo(
    () => resolveTaggedUsers(msg, participants),
    [msg, participants]
  );

  const handleAcceptCall = useCallback(() => {
    setShowCall(true);
    // defensive split
    const parts = (msg?.message || "").split("CALL_INVITE:");
    if (parts.length > 1) setMeetingId(parts[1]);
  }, [msg, setMeetingId, setShowCall]);

  const toggleVisibility = useCallback(() => {
    setIsVisible((v) => !v);
    setUserToggled(true);
  }, []);

  const timeLabel = useMemo(
    () => timeFormatter.format(new Date(msg?.updated_at || Date.now())),
    [msg]
  );

  // reply handler (calls context if available)
  const doReply = useCallback(() => {
    setReplyTo(msg);
  }, [setReplyTo, msg]);

  // Pointer handlers for entire bubble
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    lastDeltaRef.current = 0;
    setIsDragging(true);
    try {
      if (e.pointerId && (e.target as Element).setPointerCapture)
        (e.target as Element).setPointerCapture(e.pointerId);
    } catch (err) {
      /* ignore capture errors on some browsers */
    }
  }, []);

  const onPointerMove = useCallback(
    (e: { clientX: number; clientY: number }) => {
      if (!startRef.current) return;
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      lastDeltaRef.current = dx;

      // direction lock: horizontal should dominate vertical
      if (Math.abs(dx) < Math.abs(dy) * (1 + DIRECTION_LOCK_RATIO)) {
        setOffsetX(0);
        return;
      }

      // allow only intended swipe direction: right for others, left for mine
      const allowed = isMine ? dx < 0 : dx > 0;
      const visual = allowed
        ? Math.max(Math.min(dx, SWIPE_MAX_VISUAL), -SWIPE_MAX_VISUAL)
        : 0;
      setOffsetX(visual);
    },
    [isMine]
  );

  const onPointerUp = useCallback(
    (e: any) => {
      setIsDragging(false);
      const dx = lastDeltaRef.current || 0;
      startRef.current = null;
      lastDeltaRef.current = 0;

      // decide whether to trigger reply: require correct direction + threshold
      if (!isMine && dx >= SWIPE_TRIGGER_PX) {
        // others: swipe right => reply
        doReply();
      } else if (isMine && dx <= -SWIPE_TRIGGER_PX) {
        // mine: swipe left => reply
        doReply();
      }

      // reset visual offset
      setOffsetX(0);
    },
    [isMine, doReply]
  );

  // Resolve replied message (if any)
  const repliedMsg = useMemo(() => {
    // const tag = msg?.tag_mess;
    // if (!tag) return null;
    // if (!messagesById || typeof messagesById.get !== "function") return null;
    // // try id_en first, then id, then client_id
    // const found = messagesById.get(String(tag));
    // if (found) return found;
    // // fallback: try numeric id
    // for (const key of [String(tag)]) {
    //   if (messagesById.has(key)) return messagesById.get(key);
    // }
    // return null;
    const tag = {
      id: msg?.tag_mess_id,
      message: msg?.tag_mess,
      user_id:
        msg?.tag_mess_is_my_chat == "yes"
          ? authDetails?.user_enid
          : msg?.tag_mess_user,
    };
    return tag;
  }, [msg, messagesById]);

  // stable key used for this message DOM node
  const messageKey = useMemo(() => {
    return String(msg?.id);
  }, [msg]);

  // attach/unregister DOM node in parent's messageRefs map
  const attachRef = useCallback(
    (el: any) => {
      try {
        const map = messageRefs?.current;
        if (!map) return;
        if (el) map.set(messageKey, el);
        else map.delete(messageKey);
      } catch (err) {
        // ignore
      }
    },
    [messageKey, messageRefs]
  );

  return (
    <div
      className={`message flex flex-col ${
        isMine ? "items-end" : "items-start"
      }`}
      style={{ padding: "4px 0", position: "relative" }}
    >
      <AvatarRow
        isMine={isMine}
        showAvatar={showAvatar}
        senderName={sender?.member_name}
        senderId={sender?.id}
        authName={authDetails?.user?.name}
      />

      {showToggleSwitch && (
        <div
          className={`flex items-center gap-2 mb-1 ${isMine ? "pl-1" : "pr-1"}`}
        >
          <ToggleSwitch isChecked={isVisible} onToggle={toggleVisibility} />
        </div>
      )}

      <div
        className="relative p-0 max-w-[75%] shadow-none text-sm leading-relaxed"
        style={{ width: "fit-content" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={msg?.id}
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
            className={`relative`}
          >
            {/* The actual bubble (kept visually same as before) */}
            <div
              className={`p-2 pr-3 pb-4 rounded-xl shadow-md ${
                !showToggleSwitch ? "cursor-pointer" : ""
              }`}
              ref={attachRef}
              style={{
                backgroundColor: isMine ? COLORS.mine : COLORS.theirs,
                color: COLORS.text,
                border: `1px solid ${COLORS.muted}`,
                borderTopRightRadius: isMine ? "4px" : "12px",
                borderTopLeftRadius: isMine ? "12px" : "4px",
              }}
              onClick={() => {
                if (!showToggleSwitch) toggleVisibility();
              }}
              title={isVisible ? "Click to hide" : "Click to show"}
            >
              {/* Reply preview (if message is replying to another) */}
              {msg?.tag_mess && (
                <ReplyPreview
                  target={repliedMsg}
                  participants={participants}
                  myId={authDetails?.user_enid ?? authDetails?.user?.id ?? null}
                  onPreviewClick={() => {
                    const key = repliedMsg?.id;
                    if (key && typeof scrollToMessage === "function")
                      scrollToMessage(key);
                  }}
                  type="group"
                />
              )}
              <MessageContent
                msg={msg}
                isVisible={isVisible}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                participants={participants}
                onAcceptCall={handleAcceptCall}
                isMine={isMine}
              />
              <TaggedRow taggedUsers={taggedUsers} isMine={isMine} />
            </div>

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
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className={`mt-1 text-[10px] ${
          isMine ? "text-right pr-1" : "text-left pl-1"
        }`}
        style={{ color: COLORS.muted }}
      >
        {timeLabel}
      </div>
      {isLastInGroup && <div className="mb-3" />}
    </div>
  );
}
GroupMessage.propTypes = groupMessageType;
export default React.memo(GroupMessage);
