// utils/chat/messageUtils.tsx
import React from "react";
import { parseHtml } from "../formmaters";
import { ChatMessage, Participant } from "../types/chat";
import { JSX } from "react/jsx-runtime";
export const MENTION_TOKEN_REGEX = /@\[(.+?)\]\(user:([^)]+)\)/g;

export const resolveTaggedUsers = (
  msg: ChatMessage,
  participants: Participant[] = []
): { id: string; name: string }[] => {
  const users: { id: string; name: string }[] = [];

  if (Array.isArray(msg?.mentions) && msg.mentions.length) {
    msg.mentions.forEach((m) => users.push({ id: m.user_id, name: m.display }));
    return users;
  }

  if (Array.isArray(msg?.tag_user) && msg.tag_user.length) {
    msg.tag_user.forEach((tid) => {
      const found =
        participants.find(
          (p) => p?.member_id_encrpt === tid || p?.member_id === tid
        ) || null;
      if (found) {
        users.push({ id: tid, name: found.member_name || "Unknown" });
      } else {
        const text = String(msg?.message || "");
        const match = text.match(/^@([A-Za-z0-9 _.-]{1,50})$/);
        const fallbackName = match ? match[1] : "Unknown";
        users.push({ id: tid, name: fallbackName });
      }
    });
    return users;
  }

  return [];
};

const allIdsFor = (p: Participant): string[] =>
  [p?.member_id_encrpt, p?.member_id].filter(Boolean).map((x) => String(x));

/** escape a string for RegExp */
const escapeForRegex = (s: string = "") =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const renderMessageContent = (
  msg: ChatMessage,
  participants: Participant[] = []
) => {
  const rawText = String(msg?.raw_message ?? msg?.message ?? "");

  const tagUsers: string[] = Array.isArray(msg?.tag_user)
    ? msg.tag_user.map((t) => String(t))
    : [];

  const participantsById = new Map<string, Participant>();
  const participantsByName = new Map<string, Participant>();

  participants.forEach((p) => {
    if (!p) return;
    const id = p?.member_id_encrpt ?? p?.member_id;
    if (id) participantsById.set(String(id), p);
    if (p?.member_name) {
      participantsByName.set(String(p.member_name).trim().toLowerCase(), p);
    }
  });

  const taggedNames = tagUsers
    .map((tid) => {
      const p = participantsById.get(String(tid));
      return p ? String(p.member_name || "").trim() : null;
    })
    .filter(Boolean);

  const taggedNamesLower = Array.from(
    new Set(taggedNames.map((n) => n?.toLowerCase()))
  );
  const taggedNamesForRegex = taggedNamesLower.map(escapeForRegex);

  // remove tokenized mentions
  let cleaned = rawText.replace(MENTION_TOKEN_REGEX, (full, display, id) => {
    if (tagUsers.some((t) => String(t) === String(id))) {
      return "";
    }
    return `@${display}`;
  });

  if (taggedNamesForRegex.length > 0) {
    const namesGroup = taggedNamesForRegex.join("|");
    const atRegex = new RegExp(
      `(^|\\s)@(${namesGroup})(?=\\s|$|[.,!?;:])`,
      "gi"
    );

    cleaned = cleaned.replace(atRegex, (match, before) => before || "");
  }

  const normalized = cleaned
    .replace(/[^\S\r\n]{2,}/g, " ") // collapse multiple spaces/tabs -> single space
    .replace(/\r\n/g, "\n") // normalize CRLF -> LF
    .replace(/\n{3,}/g, "\n\n") // optional: limit consecutive newlines
    .trim();

  return <div>{parseHtml(normalized)}</div>;
};

export const MAX_LENGTH = 120;

export const COLORS = Object.freeze({
  mine: "#556B2F",
  theirs: "#1E2A1E",
  text: "#E0E0E0",
  muted: "#8A9188",
  brass: "#B49E69",
});

export const getInitials = (name = "") => {
  if (name) {
    const parts = name?.trim().split(/\s+/).filter(Boolean);
    if (parts?.length === 0) return "?";
    if (parts?.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts?.length - 1][0]).toUpperCase();
  } else {
    return "";
  }
};

export const getPreviewText = (renderedElement: JSX.Element) => {
  try {
    const children = renderedElement?.props?.children;
    if (typeof children === "string") return children;
    if (Array.isArray(children)) {
      return children
        .map((c) => (typeof c === "string" ? c : c?.props?.children ?? ""))
        .join("");
    }
    return String(renderedElement);
  } catch {
    return String(renderedElement);
  }
};

export const isRecent = (dateString: string | number | Date, seconds = 30) => {
  try {
    const diff = Date.now() - new Date(dateString).getTime();
    return diff / 1000 <= seconds;
  } catch {
    return false;
  }
};
export const safeString = (value: any) =>
  typeof value === "string" ? value : "";

export function htmlToPlainAndRaw(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;

  const mentions: { user_id: string; display: string }[] = [];
  div.querySelectorAll("span[data-mention='true']").forEach((chip) => {
    const name = chip.textContent?.replace(/^@/, "") || "";
    const id = chip.getAttribute("data-user-id") || "";
    mentions.push({ user_id: id, display: name });
    const token = document.createTextNode(`@[${name}](user:${id})`);
    chip.replaceWith(token);
  });

  const raw_message = div.textContent || "";

  const plainDiv = document.createElement("div");
  plainDiv.innerHTML = html;
  plainDiv.querySelectorAll("span[data-mention='true']").forEach((chip) => {
    const name = chip.textContent || "";
    chip.replaceWith(document.createTextNode(name));
  });
  const message = plainDiv.textContent || "";

  return {
    message: message.trim(),
    raw_message: raw_message.trim(),
    mentions,
  };
}

type ReplyPreviewProps = {
  target: ChatMessage | null | undefined;
  myId: string;
  participants: Participant[];
  onPreviewClick?: (target: ChatMessage) => void;
  type?: string;
};

export const ReplyPreview = ({
  target,
  myId,
  participants,
  onPreviewClick,
  type,
}: ReplyPreviewProps) => {
  if (!target) {
    return (
      <div
        className="mb-1 px-3 py-1 rounded-md text-xs"
        style={{
          borderLeft: "3px solid rgba(255,255,255,0.06)",
          background: type === "user" ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.06)",
        }}
      >
        <div className="text-[11px] italic" style={{ color: COLORS.muted }}>
          Replied to
        </div>
        <div className="text-[12px]" style={{ color: COLORS.text }}>
          Message not available
        </div>
      </div>
    );
  }

  const senderName =
    String(target.user_id) === String(myId)
      ? "You"
      : participants?.find(
          (p) =>
            String(p.member_id) === String(target.user_id) ||
            String(p.member_id_encrpt) === String(target.user_id)
        )?.member_name ?? "Anonymous";

  let preview = "";
  if (target.mss_type === "text")
    preview = (target.message || "").slice(0, 120);
  else if (target.is_file === "yes")
    preview = `[${target.file_type || "file"}]`;
  else preview = (target.message || "").slice(0, 120);

  return (
    <button
      type="button"
      onClick={() => {
        // only set reply in composer — do NOT scroll here
        if (typeof onPreviewClick === "function") onPreviewClick(target);
      }}
      className="w-full mb-1 text-left px-3 py-1 rounded-md hover:opacity-90 transition-all"
      style={{
        borderLeft: `3px solid ${COLORS.muted}`,
        background: type === "user" ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.5)",
      }}
    >
      <div className="text-[11px] font-medium" style={{ color: COLORS.text }}>
        {senderName}
      </div>
      <div
        className="text-[12px] truncate"
        style={{ color: COLORS.muted, maxWidth: 280 }}
        title={typeof preview === "string" ? preview : ""}
      >
        {preview}
      </div>
    </button>
  );
};

export const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

// Gesture tuning
export const SWIPE_TRIGGER_PX = 72; // distance to trigger reply
export const SWIPE_MAX_VISUAL = 120; // cap visual offset
export const DIRECTION_LOCK_RATIO = 0.3; // horizontal must dominate vertical

export default {
  MENTION_TOKEN_REGEX,
  resolveTaggedUsers,
  renderMessageContent,
  getInitials,
  getPreviewText,
  safeString,
  isRecent,
  htmlToPlainAndRaw,
  ReplyPreview,
  timeFormatter,
  SWIPE_TRIGGER_PX,
  SWIPE_MAX_VISUAL,
  DIRECTION_LOCK_RATIO,
  COLORS,
  MAX_LENGTH,
};
