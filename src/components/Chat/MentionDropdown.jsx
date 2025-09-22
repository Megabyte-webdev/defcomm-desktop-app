import React from "react";

const MentionDropdown = ({
  mentionSuggestions,
  mentionIndex,
  insertMentionChip,
}) => {
  return (
    <div className="absolute left-0 bottom-14 min-w-64 w-[80%] max-h-64 overflow-auto rounded-t-xl shadow-xl border-t border-gray-600 bg-oliveDark text-white z-10">
      {mentionSuggestions?.map((m, idx) => (
        <button
          key={m.member_id}
          className={`w-full text-left px-3 py-2 hover:bg-gray-800 ${
            idx === mentionIndex ? "bg-gray-800" : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            insertMentionChip(m);
          }}
        >
          <div className="text-sm font-medium truncate">@{m.member_name}</div>
          <div className="text-xs opacity-70 truncate">{m.member_name}</div>
        </button>
      ))}
    </div>
  );
};

export default MentionDropdown;
