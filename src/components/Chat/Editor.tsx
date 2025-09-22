// Editor.tsx
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import type { GroupMember } from "../../utils/types/chat";

export type EditorHandle = {
  getHtml: () => string;
  clear: () => void;
  insertMention: (member: GroupMember) => void;
};

interface EditorProps {
  placeholder?: string;
  onInput?: (html: string) => void;
  onTagUsersChange?: (ids: string[]) => void;
  chatUserType?: "direct" | "group";
}

const Editor = forwardRef<EditorHandle, EditorProps>(
  (
    {
      placeholder = "Write a message...",
      onInput,
      onTagUsersChange,
      chatUserType,
    },
    ref
  ) => {
    const rootRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
      getHtml: () => rootRef.current?.innerHTML || "",
      clear: () => {
        if (rootRef.current) rootRef.current.innerHTML = "";
        onTagUsersChange?.([]);
      },
      insertMention: (member: GroupMember) => {
        /* ...existing code... */
      },

      // NEW: return the plain text from start of editor up to current caret position
      getTextBeforeCaret: () => {
        const el = rootRef.current;
        if (!el) return "";
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) {
          // fallback: whole text
          return el.innerText || "";
        }
        const range = sel.getRangeAt(0).cloneRange();
        // Create a new range anchored to the document so setStart works reliably
        const pre = document.createRange();
        pre.setStart(el, 0);
        // Set end to current caret position by comparing boundary points
        try {
          pre.setEnd(range.endContainer, range.endOffset);
          return pre.toString();
        } catch {
          // if setEnd fails (rare), fallback to whole editor text
          return el.innerText || "";
        }
      },
    }));

    useEffect(() => {
      // allow styling via CSS classes for mention-chip elsewhere
      // ensure placeholder behavior
      const el = rootRef.current;
      if (!el) return;
      const observer = new MutationObserver(() => dispatchInput());
      observer.observe(el, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      return () => observer.disconnect();
    }, []);

    const dispatchInput = () => {
      const html = rootRef.current?.innerHTML || "";
      onInput?.(html);
      // compute tag user ids
      const ids = Array.from(
        rootRef.current?.querySelectorAll("span[data-mention='true']") || []
      )
        .map((s) => s.getAttribute("data-user-id") || "")
        .filter(Boolean);
      onTagUsersChange?.(Array.from(new Set(ids)));
    };

    // handle keyboard: Enter sends (handled by parent if needed)
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Backspace removal of whole chip
      if (e.key === "Backspace") {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const r = sel.getRangeAt(0);
        const node = r.startContainer;
        const prev =
          (node as any).previousSibling ||
          (node.parentElement && node.parentElement.previousSibling);
        const chip =
          prev instanceof HTMLElement && prev.dataset?.mention === "true"
            ? prev
            : null;
        if (chip) {
          e.preventDefault();
          const id = chip.getAttribute("data-user-id") || "";
          chip.remove();
          dispatchInput();
        }
      }
    };

    return (
      <div
        ref={rootRef}
        contentEditable
        role="textbox"
        spellCheck
        onInput={() => dispatchInput()}
        onKeyDown={onKeyDown}
        data-placeholder={placeholder}
        className="editor-root flex-1 p-2 bg-transparent outline-none min-h-[24px] max-h-40 overflow-auto"
        style={{ whiteSpace: "pre-wrap" }}
      />
    );
  }
);

export default Editor;
