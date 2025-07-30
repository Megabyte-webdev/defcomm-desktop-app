import { useContext, useState } from "react";
import logoIcon from "../../../assets/logo-icon.png";
import { ChatContext } from "../../../context/ChatContext"; // Import Chat Context
import useChat from "../../../hooks/useChat";
import { useQuery } from "@tanstack/react-query";
import { maskPhone } from "../../../utils/formmaters";
export default function ChatList() {
  const { setSelectedChatUser, selectedChatUser, typingUsers } =
    useContext(ChatContext); // Use context
  const { fetchContacts } = useChat();
  const [search, setSearch] = useState("");
  const navigateToChat = (data) => {
    setSelectedChatUser(data); // Save selected user to context
  };
  // Fetch chat contacts (only if type is CHAT)
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    staleTime: 0,
  });
  const filteredContact = contacts?.filter((item) =>
    item?.contact_name?.toLowerCase().includes(search?.toLowerCase())
  );

  return (
    <div className="w-72 p-4 bg-transparent space-y-4">
      <h2 className="text-2xl font-semibold">Chat</h2>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg px-4 py-2 font-medium text-sm bg-gray-300 text-black placeholder:text-gray-700"
        placeholder="Search people or message..."
      />
      <div>
        <h3 className="text-sm text-green-400 mb-2">Online</h3>
        <div className="flex space-x-2 overflow-x-auto">
          {filteredContact?.map((contact, i) => (
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

      <div className="space-y-4 overflow-y-auto h-[calc(100vh-200px)]">
        {filteredContact?.map((data) => (
          <div
            key={data?.id}
            onClick={() => navigateToChat(data)}
            className={`cursor-pointer flex gap-[10px] hover:bg-gray-800 ${
              selectedChatUser?.contact_id === data?.contact_id && "bg-gray-800"
            } group items-center p-3 font-medium`}
          >
            <figure className="relative w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-black font-bold">
              <img
                src={
                  data?.image
                    ? `${import.meta.env.VITE_BASE_URL}${data?.image}`
                    : logoIcon
                }
                alt={data?.contact_name?.split("")[0]}
                className="rounded-full"
              />
              <span
                className={`${
                  data?.contact_status === "active"
                    ? "bg-green-500"
                    : data?.contact_status === "pending"
                    ? "bg-red-500"
                    : data?.contact_status === "busy"
                    ? "bg-yellow"
                    : "bg-gray-400"
                } w-3 h-3 absolute bottom-[-2%] right-[5%] rounded-full border-[2px] border-white`}
              ></span>
            </figure>
            <div>
              <p className="text-sm capitalize">{data?.contact_name}</p>
              <small className="text-sm">
                {maskPhone(data?.contact_phone)}
              </small>
              {typingUsers?.[Number(data?.contact_id)] && (
                <div className="text-green-400 text-xs">Typing...</div>
              )}
            </div>
            <div className="flex-shrink-0 ml-auto flex flex-col text-[10px]">
              <span className="text-gray-200">10:42 AM</span>
              <span className="w-max font-medium px-2 py-1 bg-red-500 rounded-lg tet-center">
                12
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
