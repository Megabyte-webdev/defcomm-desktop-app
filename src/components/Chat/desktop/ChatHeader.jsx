import { useContext } from "react";
import { ChatContext } from "../../../context/ChatContext";
import logoIcon from "../../../assets/logo-icon.png";
import { FiPhone, FiVideo } from "react-icons/fi";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
export default function ChatHeader() {
  const { setShowCall, setCallType, typingUsers, setModalTitle } =
    useContext(ChatContext);
  const location = useLocation();
  const chatUserData = location?.state;
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      {chatUserData ? (
        <div className="flex items-center space-x-4">
          <figure className="relative w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-black font-bold">
            <img
              src={
                chatUserData?.image
                  ? `${import.meta.env.VITE_BASE_URL}${chatUserData?.image}`
                  : logoIcon
              }
              alt={chatUserData?.contact_name?.split("")[0]}
              className="rounded-full"
            />
            <span
              className={`${
                chatUserData?.contact_status === "active"
                  ? "bg-green-500"
                  : chatUserData?.contact_status === "pending"
                  ? "bg-red-500"
                  : chatUserData?.contact_status === "busy"
                  ? "bg-yellow"
                  : "bg-gray-400"
              } w-3 h-3 absolute bottom-[-2%] right-[5%] rounded-full border-[2px] border-white`}
            ></span>
          </figure>
          <div>
            <div className="font-semibold capitalize">
              {chatUserData?.contact_name}
            </div>
            {typingUsers?.[Number(chatUserData?.contact_id)] && (
              <div className="text-green-400 text-sm">Typing...</div>
            )}
          </div>
        </div>
      ) : (
        <p className="font-bold text-lg">Chat</p>
      )}
      {chatUserData && (
        <div className="flex gap-5 text-white *:cursor-pointer">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Call"
            className="p-2 rounded-full hover:bg-oliveGreen/80 transition"
            onClick={() => {
              setModalTitle("Place a Call");
              setShowCall(true);
            }}
          >
            <FiPhone />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Video Call"
            className="p-2 rounded-full hover:bg-oliveGreen/80 transition"
            onClick={() => {
              setModalTitle("Place a Call");
              setShowCall(true);
              setCallType("video");
            }}
          >
            <FiVideo />
          </motion.button>
        </div>
      )}
    </div>
  );
}
