import mainLogo from "../../../assets/logo-icon.png";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { RiGroup3Line } from "react-icons/ri";
import { AiOutlineVideoCamera } from "react-icons/ai";
import {
  IoCalendarClearOutline,
  IoCallOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { useContext, useState } from "react";
import { ChatContext } from "../../../context/ChatContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const [active, setActive] = useState("msg");
  const { setShowSettings, setShowCall, setCallType, setShowContactModal } =
    useContext(ChatContext);

  const handleClick = (id) => {
    setActive(id);

    switch (id) {
      case "msg":
        console.log("Messages clicked");
        // your logic for messages
        break;
      case "group":
        setShowContactModal(true);
        break;
      case "video":
        setShowCall(true);
        setCallType("video");
        break;
      case "call":
        setShowCall(true);
        break;
      case "calendar":
        navigate("/dashboard/file-sharing");
        break;
      case "settings":
        setShowSettings(true);
        break;
      default:
        break;
    }
  };

  const icons = [
    { id: "msg", icon: <BiSolidMessageSquareDetail size={20} /> },
    { id: "group", icon: <RiGroup3Line size={20} /> },
    { id: "video", icon: <AiOutlineVideoCamera size={20} /> },
    { id: "call", icon: <IoCallOutline size={20} /> },
    { id: "calendar", icon: <IoCalendarClearOutline size={20} /> },
    { id: "settings", icon: <IoSettingsOutline size={20} /> },
  ];

  return (
    <div className="w-20 bg-transparent flex flex-col items-center py-4 space-y-6">
      <Link to="/dashboard/home">
        <img src={mainLogo} alt="logo" className="w-14" />
      </Link>
      <div className="flex-1 flex flex-col justify-center items-center py-4 space-y-6">
        {icons.map(({ id, icon }) => (
          <p
            key={id}
            onClick={() => handleClick(id)}
            className={`p-2 rounded-lg cursor-pointer ${
              active === id
                ? "bg-white text-olive"
                : "hover:bg-white hover:text-olive"
            }`}
          >
            {icon}
          </p>
        ))}
      </div>
    </div>
  );
}
