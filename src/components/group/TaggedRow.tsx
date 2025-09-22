import PropTypes from "prop-types";
import { COLORS } from "../../utils/chat/messageUtils";
function TaggedRow({ taggedUsers, isMine }) {
  if (!taggedUsers || taggedUsers.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2 items-center">
      <span
        className="text-xs opacity-80 mr-2"
        style={{ color: isMine ? COLORS.muted : COLORS.brass }}
      >
        Tagged:
      </span>
      {taggedUsers.map((u) => (
        <button
          key={u.id}
          className={`px-2 py-0.5 rounded-md ${
            isMine
              ? "text-[#cbd081] bg-oliveHover/10"
              : "text-oliveHover bg-oliveGreen/10"
          } text-[11px] hover:bg-oliveGreen/20`}
          title={u.name}
        >
          @{u.name}
        </button>
      ))}
    </div>
  );
}

TaggedRow.propTypes = {
  taggedUsers: PropTypes.array,
  isMine: PropTypes.bool,
};

export default TaggedRow;
