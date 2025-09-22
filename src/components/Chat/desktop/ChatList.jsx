import { useContext, useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import logoIcon from "../../../assets/logo-icon.png";
import { ChatContext } from "../../../context/ChatContext";
import useChat from "../../../hooks/useChat";
import { useQuery } from "@tanstack/react-query";
import { maskPhone } from "../../../utils/formmaters";
import useGroups from "../../../hooks/useGroup";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChatList() {
  const { setSelectedChatUser, selectedChatUser, typingUsers } =
    useContext(ChatContext);
  const navigate = useNavigate();

  const { useFetchContacts, fetchChatHistory } = useChat();
  const { useFetchGroups } = useGroups();
  const [search, setSearch] = useState("");
  const [showUsers, setShowUsers] = useState(true);
  const [showGroups, setShowGroups] = useState(true);

  const location = useLocation();
  const chatUserData = location?.state;

  const navigateToChat = (data, type = "user") => {
    navigate(
      `/dashboard/${type}/${
        type === "user" ? data?.contact_id_encrypt : data?.group_id
      }/chat`,
      { state: data }
    );
  };

  const { data: contacts } = useFetchContacts;

  const { data: groups } = useFetchGroups();

  const {
    data: chatHistory,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useQuery({
    queryKey: ["chat-history"],
    queryFn: fetchChatHistory,
  });

  const orderedContacts = useMemo(() => {
    if (!contacts) return [];
    if (!chatHistory) return contacts;

    const reversedIds = chatHistory
      .slice()
      .reverse()
      .map((c) => c.chat_user_to_id);

    const uniqueHistoryIds = [...new Set(reversedIds)];

    const inHistory = uniqueHistoryIds
      .map((id) => contacts.find((c) => c.contact_id === id))
      .filter(Boolean);

    const inHistoryIds = new Set(inHistory.map((c) => c.contact_id));
    const others = contacts.filter((c) => !inHistoryIds.has(c.contact_id));

    return [...inHistory, ...others];
  }, [contacts, chatHistory]);

  const filteredContacts = orderedContacts?.filter((item) =>
    item?.contact_name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGroups = groups?.filter((item) =>
    item?.group_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Auto-expand on search
  useEffect(() => {
    if (search.trim()) {
      if (filteredContacts?.length > 0) setShowUsers(true);
      if (filteredGroups?.length > 0) setShowGroups(true);
    }
  }, [search, filteredContacts, filteredGroups]);

  return (
    <div className="w-72 h-screen flex flex-col bg-transparent">
      {/* Header */}
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-semibold">Chat</h2>

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg px-4 py-2 font-medium text-sm bg-gray-300 text-black placeholder:text-gray-700"
          placeholder="Search people or groups..."
        />

        {/* Online avatars */}
        <div>
          <h3 className="text-sm text-green-400 mb-2">Online</h3>
          <div className="flex space-x-2 overflow-x-auto">
            {filteredContacts?.map((contact) => (
              <div
                key={contact?.id}
                className="relative cursor-pointer group"
                onClick={() => navigateToChat(contact)}
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full text-gray-700 font-medium uppercase flex items-center justify-center text-lg">
                  {contact?.contact_name?.slice(0, 2)}
                </div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-black" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable container for Users + Groups */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {/* USERS */}
        <div className="sticky top-0 bg-transparent z-10">
          <button
            onClick={() => setShowUsers((prev) => !prev)}
            className="flex items-center justify-between w-full text-sm text-oliveHover mb-2 bg-gray-900/50 backdrop-blur-sm p-2"
          >
            <span>Users</span>
            {showUsers ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
        {showUsers && (
          <div className="space-y-4">
            {filteredContacts?.map((user) => (
              <div
                key={user?.id}
                onClick={() => navigateToChat(user, "user")}
                className={`cursor-pointer flex gap-[10px] hover:bg-gray-800 ${
                  chatUserData?.contact_id === user?.contact_id && "bg-gray-800"
                } group items-center p-3 font-medium rounded-md`}
              >
                <figure className="relative w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-black font-bold">
                  <img
                    src={
                      user?.image
                        ? `${import.meta.env.VITE_BASE_URL}${user?.image}`
                        : logoIcon
                    }
                    alt={user?.contact_name?.split("")[0]}
                    className="rounded-full"
                  />
                  <span
                    className={`${
                      user?.contact_status === "active"
                        ? "bg-green-500"
                        : user?.contact_status === "pending"
                        ? "bg-red-500"
                        : user?.contact_status === "busy"
                        ? "bg-yellow"
                        : "bg-gray-400"
                    } w-3 h-3 absolute bottom-[-2%] right-[5%] rounded-full border-[2px] border-white`}
                  ></span>
                </figure>
                <div>
                  <p className="text-sm capitalize">{user?.contact_name}</p>
                  <small className="text-sm">
                    {maskPhone(user?.contact_phone)}
                  </small>
                  {typingUsers[Number(user?.contact_id)] && (
                    <div className="text-green-400 text-xs">Typing...</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GROUPS */}
        <div className="sticky top-0 bg-transparent z-10">
          <button
            onClick={() => setShowGroups((prev) => !prev)}
            className="flex items-center justify-between w-full text-sm text-oliveHover mb-2 bg-gray-900/50 backdrop-blur-sm p-2"
          >
            <span>Groups</span>
            {showGroups ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        </div>
        {showGroups && (
          <div className="space-y-4">
            {filteredGroups?.map((group) => (
              <div
                key={group?.id}
                onClick={() => navigateToChat(group, "group")}
                className={`cursor-pointer flex gap-[10px] hover:bg-gray-800 ${
                  chatUserData?.id === group?.id &&
                  chatUserData?.type === "group" &&
                  "bg-gray-800"
                } group items-center p-3 font-medium rounded-md`}
              >
                <figure className="relative w-12 h-12 bg-[#B49E69] rounded-full flex items-center justify-center text-white font-bold">
                  {group?.group_name?.slice(0, 2).toUpperCase()}
                </figure>
                <div>
                  <p className="text-sm capitalize">{group?.group_name}</p>
                  <small className="text-xs text-gray-400">
                    {group?.members?.length} members
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
