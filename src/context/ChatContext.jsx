import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [callType, setCallType] = useState("audio"); // Default call type
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [showCall, setShowCall] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [callMessage, setCallMessage] = useState("");
  const [messages, setMessages] = useState(false);
  const [meetingId, setMeetingId] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [typingUsers, setTypingUsers] = useState({}); // key = userId, value = true/false
  const [showContactModal, setShowContactModal] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const [finalCallData, setFinalCallData] = useState(null);

  const [modalTitle, setModalTitle] = useState("Defcomm");
  const [members, setMembers] = useState();
  const initialShowToggleSwitch =
    JSON.parse(sessionStorage.getItem("showToggleSwitch")) ?? true;

  const [showToggleSwitch, setShowToggleSwitch] = useState(
    initialShowToggleSwitch
  );
  // messageRefs container (will be set by GroupMessageList)
  const messageRefsRef = useRef(null);
  const [settings, setSettings] = useState({
    dragToRead: true,
    doubleClickToRead: true,
    pressAndHoldToRead: false,
    toggleSwitch: showToggleSwitch,
    hide_message: 1,
    hide_message_style: "open_once",
    chat_language: "en",
    walkie_language: "en",
    app_language: "en",
  });

  const registerMessageRefs = useCallback((refs) => {
    messageRefsRef.current = refs;
  }, []);

  // scroll helper: accepts the same stable key you use for refs: client_id ?? id_en ?? id_en
  const scrollToMessage = useCallback(async (key, opts = {}) => {
    const {
      waitTimeout = 1200, // wait for element to mount
      waitInterval = 30,
      scrollTimeout = 3000, // max wait for the scroll to bring the element into view
      visibilityThresholdPx = 12, // how many px of margin to consider 'visible'
      nudge = 90,
      linger = 600, // keep highlight visible after element is in view
    } = opts;

    try {
      if (key == null) return false;

      // wait for element in refs map (robust to remounts)
      const waitForElement = (timeout = waitTimeout, interval = waitInterval) =>
        new Promise((resolve) => {
          const start = Date.now();
          const tryFind = () => {
            const map = messageRefsRef.current?.current ?? null;
            const el = map ? map.get(String(key)) : null;
            if (el) return resolve(el);
            if (Date.now() - start > timeout) return resolve(null);
            setTimeout(tryFind, interval);
          };
          tryFind();
        });

      const el = await waitForElement();
      if (!el) {
        console.warn("scrollToMessage: element not found for key", key);
        return false;
      }

      const bubble =
        el.querySelector?.(".message-bubble") ||
        el.querySelector?.(".p-2") ||
        el;

      const container =
        (typeof scrollContainerRef !== "undefined" &&
          scrollContainerRef?.current) ||
        el.closest("[data-scroll-container]") ||
        document.querySelector("[data-scroll-container]") ||
        // fallback to window
        null;

      const targetNode = bubble.closest(".message");

      // compute targetTop only if we have a container with scrollTo
      let targetTop = null;
      if (container && typeof container.scrollTo === "function") {
        let elTop = 0;
        let node = el;
        while (node && node !== container && node !== document.body) {
          elTop += node.offsetTop || 0;
          node = node.offsetParent;
        }
        const elHeight =
          el.offsetHeight || (bubble && bubble.offsetHeight) || 32;
        const center = Math.max(
          elTop - container.clientHeight / 2 + elHeight / 2,
          0
        );
        targetTop = Math.max(center - nudge, 0);
        container.scrollTo({ top: targetTop, behavior: "smooth" });
      } else {
        // fallback: container-less scroll into view (window)
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // show highlight immediately on the parent (so user sees something during scroll)
      const highlightClass = "reply-highlight";
      if (bubble && bubble.classList) {
        targetNode.classList.add("bubble-parent");
        bubble.classList.add(highlightClass);
        bubble.style.zIndex = 9999;
      }

      // Wait until the element is actually visible in the container / viewport
      const isElementVisible = () => {
        // if we have a specific container (scrollable element)
        if (container) {
          const cRect = container.getBoundingClientRect();
          const eRect = el.getBoundingClientRect();
          // eRect must be at least partly inside cRect with threshold
          return (
            eRect.bottom >= cRect.top + visibilityThresholdPx &&
            eRect.top <= cRect.bottom - visibilityThresholdPx
          );
        } else {
          // fallback to viewport
          const eRect = el.getBoundingClientRect();
          return (
            eRect.bottom >= visibilityThresholdPx &&
            eRect.top <=
              (window.innerHeight || document.documentElement.clientHeight) -
                visibilityThresholdPx
          );
        }
      };

      const waitForVisibility = (timeout = scrollTimeout) =>
        new Promise((resolve) => {
          const start = Date.now();
          let stableFrames = 0;
          const tick = () => {
            if (isElementVisible()) return resolve(true);
            // if we are not visible but scroll has basically stopped, we may still resolve to avoid infinite wait
            if (Date.now() - start > timeout) return resolve(true);
            requestAnimationFrame(() => {
              stableFrames++;
              if (stableFrames > 3000) return resolve(true); // safety
              tick();
            });
          };
          requestAnimationFrame(tick);
        });

      await waitForVisibility(scrollTimeout);

      // the element is visible (or timeout), keep highlight for a moment so user notices it
      await new Promise((r) => setTimeout(r, linger));

      // cleanup highlight (remove both classes and inline fallbacks)
      try {
        if (bubble && bubble.classList) {
          bubble.classList.remove(highlightClass);
          targetNode.classList.remove("bubble-parent");
        }
      } catch (err) {
        /* ignore */
      }

      return true;
    } catch (err) {
      console.error("scrollToMessage error:", err);
      return false;
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChatUser,
        setSelectedChatUser,
        showCall,
        setShowCall,
        showSettings,
        setShowSettings,
        showContactModal,
        setShowContactModal,
        callMessage,
        setCallMessage,
        messages,
        setMessages,
        file,
        setFile,
        message,
        setMessage,
        callType,
        setCallType,
        typingUsers,
        setTypingUsers,
        modalTitle,
        setModalTitle,
        meetingId,
        setMeetingId,
        callDuration,
        setCallDuration,
        showToggleSwitch,
        setShowToggleSwitch,
        replyTo,
        setReplyTo,
        members,
        setMembers,
        messageRefsRef,
        registerMessageRefs,
        scrollToMessage,
        settings,
        setSettings,
        finalCallData,
        setFinalCallData,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
