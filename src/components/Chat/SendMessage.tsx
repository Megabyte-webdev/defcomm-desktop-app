import React, { useState, useContext, useRef, useMemo } from "react";
import { axiosClient } from "../../services/axios-client";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { sendMessageUtil } from "../../utils/chat/sendMessageUtil";
import {
  useSendMessageMutation,
  useTypingStatus,
} from "../../hooks/useSendMessageMutation";
import { GroupMember, SendMessageProps } from "../../utils/types/chat";
import FileToSendPreview from "./FileToSendPreview";
import InputBox from "./InputBox";
import { onPrompt } from "../../utils/notifications/onPrompt";
import { FaTimes } from "react-icons/fa";
import { htmlToPlainAndRaw } from "../../utils/chat/messageUtils";
import ScrollToBottomButton from "./ScrollToBottom";

function SendMessage({
  messageData,
  desktop = false,
  scrollRef,
  messagesEndRef,
}: SendMessageProps) {
  const { authDetails } = useContext(AuthContext) as any;
  const {
    file,
    setFile,
    replyTo,
    setReplyTo,
    members: ctxMembers,
  } = useContext(ChatContext) as any;

  const groupMembers: GroupMember[] = useMemo(
    () =>
      (ctxMembers &&
        Array.isArray(ctxMembers) &&
        ctxMembers.filter((m) => m?.member_id !== authDetails?.user?.id)) ||
      [],
    [ctxMembers]
  );

  // contentEditable state
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(0);
  const [tagUsers, setTagUsers] = useState<string[]>([]);

  // typing indicators
  const client = axiosClient(authDetails?.access_token);
  const typingMutation = useTypingStatus(client);
  const sendMessageMutation = useSendMessageMutation(client, clearMessageInput);
  const typingSent = useRef(false);
  const notTypingTimeout = useRef<NodeJS.Timeout | null>(null);

  function clearMessageInput() {
    if (editorRef.current) editorRef.current.innerHTML = "";
    setFile(null);
    setShowMentionMenu(false);
    setMentionQuery("");
    setMentionIndex(0);
    setTagUsers([]);
    clearReply();
    typingSent.current = false;
  }

  const clearReply = () => setReplyTo?.(null);

  function insertMentionChip(member: GroupMember) {
    const el = editorRef.current;
    if (!el) return;

    // Prevent duplicate tagging
    if (tagUsers.includes(member.member_id_encrpt)) {
      // Notify user
      onPrompt({
        title: "Info",
        message: `${member.member_name} is already tagged!`,
      });
      return;
    }

    el.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    let range = sel.getRangeAt(0);

    const preRange = range.cloneRange();
    preRange.setStart(el, 0);
    const uptoCaret = preRange.toString();
    const match = uptoCaret.match(/(?:^|\s)@([A-Za-z0-9._-]*)$/);
    if (!match) return;

    const queryLen = match[1].length + 1;
    for (let i = 0; i < queryLen; i++) {
      range.setStart(range.startContainer, range.startOffset - 1);
    }

    const chip = document.createElement("span");
    chip.setAttribute("data-mention", "true");
    chip.setAttribute("data-user-id", member.member_id_encrpt);
    chip.className = "mention-chip inline-flex items-center px-1.5 rounded-md";
    chip.contentEditable = "false";
    chip.textContent = `@${member.member_name}`;

    range.deleteContents();
    range.insertNode(document.createTextNode(" "));
    range.collapse(false);
    range.setStart(range.startContainer, range.startOffset - 1);
    range.insertNode(chip);

    const after = document.createTextNode(" ");
    chip.after(after);
    sel.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(after);
    newRange.collapse(true);
    sel.addRange(newRange);

    // Update tag users
    setTagUsers((prev) => [...prev, member.member_id_encrpt]);

    setShowMentionMenu(false);
    setMentionQuery("");
    setMentionIndex(0);

    pingTyping();
  }

  function pingTyping() {
    if (!typingSent.current) {
      typingMutation.mutate({
        current_chat_user: messageData.chat_user_id_en,
        typing: "is_typing",
      });
      typingSent.current = true;
    }
    if (notTypingTimeout.current) clearTimeout(notTypingTimeout.current);
    notTypingTimeout.current = setTimeout(() => {
      typingMutation.mutate({
        current_chat_user: messageData.chat_user_id_en,
        typing: "not_typing",
      });
      typingSent.current = false;
    }, 3000);
  }

  const mentionSuggestions = useMemo(() => {
    if (!mentionQuery) return groupMembers.slice(0, 6);
    const q = mentionQuery.toLowerCase();
    return groupMembers
      .filter((m) => m.member_name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [mentionQuery, groupMembers]);

  const onInput = () => {
    const el = editorRef.current;
    if (!el) return;

    const sel = window.getSelection();
    const caretText = (() => {
      if (!sel || sel.rangeCount === 0) return el.innerText;
      const r = sel.getRangeAt(0).cloneRange();
      r.setStart(el, 0);
      return r.toString();
    })();

    const groupMatch = caretText.match(/(?:^|\s)@([A-Za-z0-9._-]*)$/);

    if (messageData.chat_user_type === "group" && groupMatch) {
      const query = groupMatch[1] || "";

      if (query.toLowerCase() === "all") {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        let range = sel.getRangeAt(0);

        // Remove @all from input
        const preRange = range.cloneRange();
        preRange.setStart(el, 0);
        const uptoCaret = preRange.toString();
        const match = uptoCaret.match(/@all$/i);
        if (match) {
          range.setStart(
            range.startContainer,
            range.startOffset - match[0].length
          );
          range.deleteContents();
        }

        // Insert all members
        let taggedAny = false;
        groupMembers.forEach((member) => {
          if (!tagUsers.includes(member.member_id_encrpt)) {
            const chip = document.createElement("span");
            chip.setAttribute("data-mention", "true");
            chip.setAttribute("data-user-id", member.member_id_encrpt);
            chip.className =
              "mention-chip inline-flex items-center px-1.5 rounded-md";
            chip.contentEditable = "false";
            chip.textContent = `@${member.member_name}`;

            range.insertNode(chip);
            const after = document.createTextNode(" ");
            chip.after(after);

            range.setStartAfter(after);
            range.collapse(true);

            taggedAny = true;
          }
        });

        if (!taggedAny) {
          onPrompt({
            title: "Info",
            message: "All members are already tagged!",
          });
        } else {
          const ids = Array.from(
            el.querySelectorAll("span[data-mention='true']")
          )
            .map((chip) => chip.getAttribute("data-user-id") || "")
            .filter(Boolean);
          setTagUsers(Array.from(new Set(ids)));
        }

        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(el.lastChild!);
        newRange.collapse(true);
        sel.addRange(newRange);

        setShowMentionMenu(false);
        setMentionQuery("");
        return;
      }

      // Regular mention
      setShowMentionMenu(true);
      setMentionQuery(query);
    } else {
      setShowMentionMenu(false);
      setMentionQuery("");
    }

    // Update tagUsers from DOM
    const ids = Array.from(el.querySelectorAll("span[data-mention='true']"))
      .map((chip) => chip.getAttribute("data-user-id") || "")
      .filter(Boolean);
    setTagUsers(Array.from(new Set(ids)));

    pingTyping();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Mention menu navigation
    if (showMentionMenu && mentionSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((i) => (i + 1) % mentionSuggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex(
          (i) => (i - 1 + mentionSuggestions.length) % mentionSuggestions.length
        );
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const pick = mentionSuggestions[mentionIndex] || mentionSuggestions[0];
        if (pick) insertMentionChip(pick);
        return;
      }
      if (e.key === "Escape") {
        setShowMentionMenu(false);
        return;
      }
    }

    // Backspace: remove chip only if caret immediately after
    if (e.key === "Backspace") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const r = sel.getRangeAt(0);
      const { startContainer, startOffset } = r;

      // Only act if caret is at startOffset > 0
      if (startContainer.nodeType === 3) {
        // text node
        // If caret is at position 0, check previous sibling
        if (startOffset === 0) {
          let prev = startContainer.previousSibling;

          // skip empty text nodes
          while (prev && prev.nodeType === 3 && prev.textContent === "") {
            prev = prev.previousSibling;
          }

          // Only remove if it's a mention chip
          if (prev instanceof HTMLElement && prev.dataset?.mention === "true") {
            e.preventDefault();
            const id = prev.getAttribute("data-user-id") || "";
            prev.remove();
            setTagUsers((prev) => prev.filter((x) => x !== id));
            return;
          }
        }
      }

      // If caret is in root or other nodes, do nothing — allow normal text deletion
    }

    // Enter: send message
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onFocus = () => {
    if (!typingSent.current) {
      typingMutation.mutate({
        current_chat_user: messageData.chat_user_id_en,
        typing: "is_typing",
      });
      typingSent.current = true;
    }
  };

  const onBlur = () => {
    if (notTypingTimeout.current) clearTimeout(notTypingTimeout.current);
    typingMutation.mutate({
      current_chat_user: messageData.chat_user_id_en,
      typing: "not_typing",
    });
    typingSent.current = false;
  };

  const handleSendMessage = () => {
    const el = editorRef.current;
    const html = (el?.innerHTML || "").replace(/<br>/g, "\n");
    const { message, mentions } = htmlToPlainAndRaw(html);

    if (message.trim().length === 0 && !file) return;

    sendMessageUtil({
      client,
      message,
      file,
      chat_user_type: messageData.chat_user_type,
      chat_user_id: messageData.chat_user_id_en,
      chat_id: messageData.chat_id,
      tag_mess: replyTo?.id || null,
      mentions,
      tag_users: tagUsers,
      sendMessageMutation,
    } as any);
  };

  return (
    <div
      className={`${
        desktop ? "bg-white text-black" : "bg-oliveLight text-white"
      } sticky bottom-0 w-full flex flex-col p-4`}
    >
      {replyTo && (
        <div
          className={`mb-3 w-full rounded-lg overflow-hidden border-l-4 border-oliveGreen flex items-stretch ${
            desktop
              ? "bg-white/60 text-black shadow-sm"
              : "bg-oliveDark/60 text-white"
          }`}
          role="region"
          aria-label="Reply preview"
        >
          {/* colored accent bar */}
          <div
            className={`w-1 ${
              desktop ? "bg-oliveGreen/70" : "bg-oliveLight/80"
            }`}
          />

          {/* content */}
          <div className="flex-1 px-3 py-2 flex items-start gap-3 min-w-0">
            {/* small avatar / initials */}
            <div className="flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold ${
                  desktop
                    ? "bg-gray-100 text-gray-800"
                    : "bg-oliveDark/80 text-white"
                }`}
                aria-hidden="true"
              >
                {(() => {
                  const id = replyTo?.user_id;
                  const member =
                    ctxMembers?.find((m) => m.member_id_encrpt === id) || null;
                  const name =
                    member?.member_name ||
                    (id === authDetails?.user_enid
                      ? authDetails?.user?.name
                      : replyTo?.user_type === "user"
                      ? replyTo?.contact_name
                      : `User ${id}`);
                  const parts = (name || "U").trim().split(" ");
                  return (
                    parts.length > 1
                      ? parts[0][0] + parts[1][0]
                      : name.slice(0, 2)
                  ).toUpperCase();
                })()}
              </div>
            </div>

            {/* labels & message */}
            <div className="min-w-0">
              <div className="text-xs font-bold leading-4 truncate opacity-90">
                {replyTo?.user_id === authDetails?.user_enid
                  ? "You"
                  : replyTo?.user_type === "user"
                  ? replyTo?.contact_name
                  : ctxMembers?.find(
                      (m) => m.member_id_encrpt === replyTo?.user_id
                    )?.member_name || `User ${replyTo?.user_id}`}
              </div>

              <div
                className="text-sm text-gray-500 dark:text-gray-200 truncate mt-0.5"
                style={{ lineHeight: 1.2 }}
              >
                {/* show single-line truncated preview, preserves simple HTML/strings */}
                {replyTo?.message}
              </div>
            </div>
          </div>

          {/* close button */}
          <div className="flex-shrink-0 pr-2 pl-1 py-2">
            <button
              onClick={clearReply}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-red-900 hover:bg-red-500/10 focus:outline-none"
              aria-label="Cancel reply"
              title="Cancel reply"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>
      )}

      {file && <FileToSendPreview desktop={desktop} />}
      <ScrollToBottomButton
        containerRef={scrollRef}
        messagesEndRef={messagesEndRef}
      />

      <InputBox
        insertMentionChip={insertMentionChip}
        mentionIndex={mentionIndex}
        sendMessageMutation={sendMessageMutation}
        editorRef={editorRef}
        onInput={onInput}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        handleSendMessage={handleSendMessage}
        messageData={messageData}
        showMentionMenu={showMentionMenu}
        mentionSuggestions={mentionSuggestions}
        replyTo={replyTo}
      />
    </div>
  );
}

export default SendMessage;
