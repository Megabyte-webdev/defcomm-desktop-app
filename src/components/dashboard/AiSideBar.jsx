import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import mainLogo from "../../assets/logo-icon.png";
import { MdKey } from "react-icons/md";
import { BotContext } from "../../context/BotContext";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaBars, FaTimes, FaRegFileAlt, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

function AiSideBar({ children, authDetails, toogleIsOpen, isMenuOpen }) {
  const [openSections, setOpenSections] = useState({});
  const {
    setActiveConversationId,
    setSelectedBotChat,
    selectedBotChat,
    conversations,
    startNewConversation
  } = useContext(BotContext);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const groupConversationsByDate = () => {
    const groups = {};

    conversations.forEach((convo) => {
      const date = new Date(convo.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });

      if (!groups[date]) groups[date] = [];
      groups[date].push({ id: convo.id, title: convo.title || "Untitled Chat" });
    });

    return groups;
  };

  const grouped = groupConversationsByDate();

  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: isMenuOpen ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`${isMenuOpen ? "!bg-[#2c3b03] fixed left-0 top-0 bottom-0 z-[100000]" : "hidden"
        } md:!flex flex-col md:!translate-x-0 md:relative bg-transparent w-72 text-white h-full overflow-y-auto`}
    >
      <div className="relative p-4 text-xl font-bold flex flex-col items-center min-h-28 bg-[#2c3b03]">
        <div
          onClick={toogleIsOpen}
          className="absolute top-8 left-8 cursor-pointer text-white block mr-2 md:hidden transition-all ease-in-out duration-300"
        >
          {!isMenuOpen ? <FaBars size={24} /> : <FaTimes size={24} />}
        </div>
        <Link to="/dashboard/home">
          <img src={mainLogo} alt="logo" className="w-14" />
        </Link>
      </div>

      <nav className="bg-oliveLight flex-1 p-4">
        <div className="min-h-28">
          <h3 className="font-semibold text-xl flex gap-[10px] items-center p-3 capitalize">
            <MdKey size={24} className="text-[#c0c00e] rotate-90" />
            {authDetails?.user?.email
                ? authDetails?.user?.email?.slice(0, 3) + 'xxxxxx'
                : "Anonymous"}
          </h3>
        </div>
        <button
          onClick={() => {
            setSelectedBotChat(null);
            startNewConversation("New Chat");
            toogleIsOpen();
          }}
          className="w-full rounded-md bg-white text-black text-sm my-2 flex items-center justify-between gap-2 px-3 py-2"
        >
          New Chat <span className="text-xl">+</span>
        </button>

        <ul className="mt-4">
          {Object.entries(grouped).map(([date, chats]) => (
            <li key={date} className="mb-2">
              <button
                className="w-full flex justify-between items-center text-left px-3 py-2 font-semibold hover:bg-oliveDark rounded-md"
                onClick={() => toggleSection(date)}
              >
                {date}
                {openSections[date] ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              {openSections[date] && (
                <ul className="ml-2 mt-2 pl-3">
                  {chats.map(({ id, title }) => (
                    <li
                      key={id}
                      onClick={() => {
                        setSelectedBotChat(id);
                        setActiveConversationId(id);
                        toogleIsOpen();
                      }}
                      className={`p-2 rounded-md text-sm hover:underline flex items-center gap-2 cursor-pointer ${selectedBotChat === id ? "bg-white/40" : ""
                        }`}
                    >
                      <FaRegFileAlt className="flex-shrink-0" />
                      <span className="truncate">{title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <p className="min-h-32 font-medium flex gap-[10px] items-end p-3">
          <AiOutlineQuestionCircle size={20} /> Supports
        </p>
      </nav>
    </motion.aside>
  );
}

export default React.memo(AiSideBar);
