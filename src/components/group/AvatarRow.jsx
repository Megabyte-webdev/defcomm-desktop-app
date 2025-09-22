import PropTypes from "prop-types";
import { COLORS, getInitials } from "../../utils/chat/messageUtils";
const AvatarRow = ({ isMine, showAvatar, senderName, authName, senderId }) => {
  if (!showAvatar) return null;
  const nameToShow = isMine
    ? authName || "You"
    : senderName || `Anonymous ${getInitials(senderId)}`;

  return (
    <div
      className={`flex items-center gap-2 mb-2 ${
        !isMine ? "pl-1" : "pr-1 flex-row-reverse"
      }`}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm"
        style={{
          backgroundColor: isMine ? COLORS.mine : COLORS.theirs,
          color: COLORS.text,
          border: `1px solid ${COLORS.brass}`,
        }}
      >
        {getInitials(isMine ? authName : senderName ?? senderId)}
      </div>
      <span className="text-xs font-semibold" style={{ color: COLORS.muted }}>
        {isMine ? "You" : nameToShow}
      </span>
    </div>
  );
};

AvatarRow.propTypes = {
  isMine: PropTypes.bool,
  showAvatar: PropTypes.bool,
  senderName: PropTypes.string,
  authName: PropTypes.string,
};
export default AvatarRow;
