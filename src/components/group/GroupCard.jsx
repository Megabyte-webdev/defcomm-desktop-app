import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useGroups from "../../hooks/useGroup";
import { AuthContext } from "../../context/AuthContext";
import useChat from "../../hooks/useChat";

export default function GroupCard({ group }) {
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);
  const { useFetchGroupInfo } = useGroups();
  const { fetchGroupChatMessages } = useChat();
  const queryClient = useQueryClient();

  const groupId = group?.group_id;

  // Fetch group members
  const { data: groupInfoData } = useFetchGroupInfo(groupId);

  const groupMembers = useMemo(() => {
    const members = groupInfoData?.data ? [...groupInfoData.data] : [];
    if (authDetails?.user) {
      const exists = members.some(
        (m) => m.member_id_encrpt === authDetails.user_enid
      );
      if (!exists) {
        members.push({
          member_id: authDetails.user.id,
          member_id_encrpt: authDetails.user_enid,
          member_name: authDetails.user.name,
          member_email: authDetails.user.email,
          isSelf: true,
        });
      }
    }
    return members;
  }, [groupInfoData, authDetails]);

  // --- Use useQuery to watch messages cache and re-render on updates ---
  const { data: messagesCache } = useQuery({
    queryKey: ["groupMessages", groupId],
    queryFn: async () => {
      // Fetch from server if cache is empty
      const cached = queryClient.getQueryData(["groupMessages", groupId]);
      if (cached) return cached;

      // Replace this with your actual fetch function
      const data = await fetchGroupChatMessages(groupId);
      return data;
    },
    enabled: !!groupId,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const lastMessageData = messagesCache?.data?.length
    ? messagesCache.data[messagesCache.data.length - 1]
    : group.lastMessage
    ? {
        message: group.lastMessage,
        created_at: group.lastMessageTime,
        user_id: group.lastMessageUserId,
        user_to: group.lastMessageTo,
      }
    : null;

  // Determine sender name
  let senderName = "Admin";
  if (lastMessageData) {
    const match =
      groupMembers.find(
        (member) => member.member_id_encrpt === lastMessageData.user_id
      ) || {};
    senderName = match.member_name || senderName;
  }

  const lastMessageText = lastMessageData?.message || "No messages yet";
  const lastMessageTime = lastMessageData?.created_at
    ? new Date(lastMessageData.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      onClick={() => navigate(`/dashboard/group/${groupId}/chat`)}
      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800 transition"
    >
      {group?.avatar ? (
        <img
          src={group.avatar}
          alt={group.group_name}
          className="flex-shrink-0 w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
          <FaUsers size={20} />
        </div>
      )}
      <div className="flex-1 border-b border-gray-700 pb-3 overflow-hidden whitespace-nowrap">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-white">{group.group_name}</h2>
          <span className="text-xs text-gray-400">{lastMessageTime}</span>
        </div>
        <p className="text-gray-400 text-sm truncate">
          <strong>{senderName}:</strong> {lastMessageText}
        </p>
      </div>
    </div>
  );
}
