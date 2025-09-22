import React, { useContext, useEffect } from "react";
import MentionDropdown from "./MentionDropdown";
import { MdAttachFile, MdOutlineEmojiEmotions } from "react-icons/md";
import { ChatContext } from "../../context/ChatContext";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

const InputBox = ({
  insertMentionChip,
  mentionIndex,
  sendMessageMutation,
  editorRef,
  onInput,
  onKeyDown,
  onFocus,
  onBlur,
  handleSendMessage,
  messageData,
  showMentionMenu,
  mentionSuggestions,
  replyTo,
}) => {
  const { file, setFile } = useContext(ChatContext) as any;

  /* ---------- Helpers ---------- */

  // Ensure editor contains at least one text node (prevents caret-placement failures)
  function ensureFocusableTextNode(el) {
    if (!el) return;
    // If element is empty or only contains <br>, normalize to a text node with NBSP
    const textContent = el.textContent || "";
    if (textContent.trim() === "") {
      // Clear children and add a non-breaking-space text node if it's effectively empty:
      // preserving <br> behavior is optional — we replace with a NBSP to make caret placement reliable.
      el.innerHTML = "";
      const tn = document.createTextNode("\u00A0");
      el.appendChild(tn);
    }
  }

  // Find the deepest last text node inside el
  function getLastTextNode(el) {
    if (!el) return null;
    let node = el;
    while (node && node.lastChild) {
      node = node.lastChild;
    }
    return node && node.nodeType === Node.TEXT_NODE ? node : null;
  }

  // Move caret to the end of the contentEditable
  function focusEditor() {
    const el = editorRef.current;
    if (!el) return false;

    try {
      el.focus();
    } catch (err) {
      // focus may throw on very old browsers or if element lost — just ignore
    }

    const sel = window.getSelection();
    if (!sel) return false;

    sel.removeAllRanges();
    const range = document.createRange();

    // Prefer the last text node; fallback to setting start at element end
    const lastText = getLastTextNode(el);
    if (lastText) {
      // Move caret to the length of that text node (if NBSP only, caret will be after it)
      range.setStart(lastText, (lastText.textContent || "").length);
    } else {
      // If no text node, try to set after lastChild or at end of element
      try {
        const lastNode = el.lastChild ?? el;
        range.setStartAfter(lastNode);
      } catch {
        // ultimate fallback
        range.setStart(el, el.childNodes.length);
      }
    }

    range.collapse(true);
    sel.addRange(range);

    // Return true if selection is now at the end (best-effort)
    const isCollapsed =
      sel.rangeCount > 0 ? sel.getRangeAt(0).collapsed : false;
    return isCollapsed;
  }

  /* Insert an explicit <br> newline + caret after it (your original behavior) */
  function insertBreakAtCaret() {
    const el = editorRef.current;
    if (!el) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      // if there's no selection, force focus & return
      ensureFocusableTextNode(el);
      focusEditor();
      return;
    }
    const range = sel.getRangeAt(0);
    const br = document.createElement("br");
    const after = document.createTextNode("\u00A0"); // NBSP

    range.collapse(false);
    range.insertNode(br);
    br.after(after);

    sel.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(after);
    newRange.collapse(true);
    sel.addRange(newRange);

    el.scrollTop = el.scrollHeight;
  }

  useEffect(() => {
    if (!replyTo) return;
    const el = editorRef?.current;
    if (!el) return;

    // Prepare element so caret operations don't fail
    ensureFocusableTextNode(el);
    // Try focusing immediately, then via RAF; retry up to N times using setTimeout
    let attempts = 0;
    const maxAttempts = 5;

    const tryFocus = () => {
      attempts += 1;
      const ok = focusEditor();
      if (ok) {
        // success — scroll and stop retrying
        try {
          el.scrollTop = el.scrollHeight;
        } catch {}
        return;
      }
      if (attempts >= maxAttempts) return;

      // Schedule another attempt: RAF first, then setTimeout fallback
      requestAnimationFrame(() => {
        const ok2 = focusEditor();
        if (ok2) {
          try {
            el.scrollTop = el.scrollHeight;
          } catch {}
          return;
        }
        // if still not ok, fallback to timeout retry (gives more time for DOM updates)
        setTimeout(tryFocus, 20 * attempts); // increasing backoff
      });
    };

    tryFocus();
  }, [replyTo?.id]);
  return (
    <div className="relative flex items-center gap-2">
      <label htmlFor="fileUpload" className="cursor-pointer">
        <MdAttachFile size={24} className="flex-shrink-0" />
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>

      <MdOutlineEmojiEmotions size={24} className="flex-shrink-0" />

      {/* contentEditable input */}
      <div
        ref={editorRef}
        role="textbox"
        aria-label="Write a message"
        contentEditable
        spellCheck
        onInput={onInput}
        onKeyDown={onKeyDown}
        onPaste={(e) => {
          // paste plain text to avoid unexpected HTML
          e.preventDefault();
          const text = (e.clipboardData || window.clipboardData).getData(
            "text"
          );
          document.execCommand("insertText", false, text);
        }}
        tabIndex={0}
        onFocus={onFocus}
        onBlur={onBlur}
        className="flex-1 p-2 bg-transparent border-none outline-none leading-snug min-h-[24px] max-h-40 overflow-auto"
        style={{ whiteSpace: "pre-wrap" }}
        data-placeholder="Write a message..."
      />
      <button
        onClick={() => {
          insertBreakAtCaret();
          // keep focus after inserting break
          setTimeout(() => {
            focusEditor();
          }, 0);
        }}
        className="hidden md:block px-2 py-1 rounded-md border"
        title="Insert newline (Ctrl/Cmd+Enter)"
      >
        ↵
      </button>

      <button
        className="bg-oliveDark text-gray-200 px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
        onClick={handleSendMessage}
        disabled={sendMessageMutation.isPending}
      >
        {sendMessageMutation.isPending ? (
          <FaSpinner size={20} className="animate-spin" />
        ) : (
          <FaPaperPlane size={20} />
        )}
      </button>

      {/* Mention dropdown */}
      {messageData?.chat_user_type === "group" &&
        showMentionMenu &&
        mentionSuggestions.length > 0 && (
          <MentionDropdown
            insertMentionChip={insertMentionChip}
            mentionSuggestions={mentionSuggestions}
            mentionIndex={mentionIndex}
          />
        )}
    </div>
  );
};

export default InputBox;
