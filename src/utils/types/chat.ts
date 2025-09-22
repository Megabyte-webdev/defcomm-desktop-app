import PropTypes from "prop-types";

export type GroupMember = {
  id: string;
  member_id_encrpt: string;
  member_id: string;
  member_name: string;
  avatar?: string;
};

export interface MessageData {
  chat_user_id: string;
  chat_user_type: "direct" | "group";
  chat_user_id_en: string;
  chat_id: string;
  members?: GroupMember[];
  // NOTE: we won't mutate props; we'll compute tag_users locally and include in payload
}

export interface SendMessageProps {
  messageData: MessageData;
  desktop?: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

// Participant type
export interface Participant {
  id?: string;
  member_id?: number | string;
  member_id_encrpt?: string;
  member_id_encrypted?: string;
  member_name?: string;
  hide_member_detail?: string;
  join_date?: string | null;
}

// Message type
export interface ChatMessage {
  id: string;
  message?: string;
  raw_message?: string;
  tag_user?: string[];
  mentions?: { user_id: string; display: string }[];
  [key: string]: any; // other fields like user_id, user_to, etc.
}

export const groupMessageType = {
  msg: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    message: PropTypes.string,
    type: PropTypes.string,
    is_file: PropTypes.string,
    file_name: PropTypes.string,
    is_my_chat: PropTypes.string,
    updated_at: PropTypes.string,
    is_read: PropTypes.string,
  }).isRequired,
  sender: PropTypes.object,
  showAvatar: PropTypes.bool,
  isLastInGroup: PropTypes.bool,
  participants: PropTypes.array,
};

declare global {
  interface ImportMeta {
    env: {
      VITE_BASE_URL: string;
      [key: string]: any;
    };
  }
}
