import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext"; // Import Chat Context
import logoIcon from "../../assets/logo-icon.png";
import { MdDelete } from "react-icons/md";
import useGroups from "../../hooks/useGroup";
import { FaSpinner } from "react-icons/fa";

function SideBarItemTwo({ data, setIsOpen }) {
  const navigate = useNavigate();
  const { setSelectedChatUser, selectedChatUser, typingUsers } =
    useContext(ChatContext); // Use context

  const navigateToChat = () => {
    setSelectedChatUser(data); // Save selected user to context
    setIsOpen(false);
  };
  const { removeContactMutation } = useGroups();
  const [loadingStates, setLoadingStates] = useState({});

  const handleRemoveContact = async (event) => {
    event.stopPropagation();
    setLoadingStates((prev) => ({ ...prev, [data?.id]: "removing" }));
    try {
      const res = await removeContactMutation.mutateAsync(data?.id);
      if (res) {
        if (selectedChatUser?.contact_id === data?.contact_id) {
          setSelectedChatUser(null);
        }
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [data?.id]: null }));
    }
  };

  return (
    <li
      key={data?.id}
      onClick={navigateToChat}
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
        <p>{data?.contact_name}</p>
        <small>{data?.contact_phone}</small>
        {typingUsers[Number(data?.contact_id)] && (
          <div className="text-green-400 text-xs">Typing...</div>
        )}
      </div>
      <button
        onClick={handleRemoveContact}
        className="ml-auto"
        disabled={loadingStates[data?.id] === "removing"}
      >
        {loadingStates[data?.id] === "removing" ? (
          <FaSpinner className="animate-spin text-white" />
        ) : (
          <MdDelete />
        )}
      </button>
    </li>
  );
}

export default React.memo(SideBarItemTwo);
