import React, { useContext } from "react";
import { motion } from "framer-motion";
import mainLogo from "../../assets/logo-icon.png";
import { FaBars, FaTimes, FaUserPlus } from "react-icons/fa";
import { dashboardTabs } from "../../utils/constants";
import useChat from "../../hooks/useChat";
import { useQuery } from "@tanstack/react-query";
import useGroups from "../../hooks/useGroup";
import { Link, useLocation } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";

function SideBarTwo({ children, state, toogleIsOpen, isMenuOpen, contacts }) {
  const { pathname } = useLocation();

  const { setShowContactModal } = useContext(ChatContext);
  const isChatPage = pathname.includes("/dashboard/chat");
  const { fetchChatHistory } = useChat();

  // Fetch Chat History using React Query
  const { data: chatHistory, isLoading } = useQuery({
    queryKey: ["chat-history"],
    queryFn: fetchChatHistory,
    //  refetchInterval: 5000,
    staleTime: 0,
  });
  const { useFetchGroups, useFetchGroupMembers, addContactMutation } =
    useGroups();

  return (
    <>
      {/* SidebarTwo */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isMenuOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
                ${
                  isMenuOpen
                    ? "!bg-[#2c3b03] fixed left-0 top-0 bottom-0 z-[100000]"
                    : "hidden"
                }
                ${isChatPage ? "lg:!hidden" : "lg:flex"} 
                md:!flex flex-col md:!translate-x-0 md:relative 
                bg-transparent w-72 text-white h-full overflow-y-auto
                `}
      >
        <div className="relative p-4 text-xl font-bold flex flex-col items-center min-h-28 bg-transparent">
          <div
            onClick={toogleIsOpen}
            className="absolute top-8 left-8 cursor-pointer text-white block mr-2 md:hidden transition-all ease-in-out duration-300"
          >
            {!isMenuOpen ? <FaBars size={24} /> : <FaTimes size={24} />}
          </div>
          <Link to={"/dashboard/home"}>
            <img src={mainLogo} alt="logo" className="w-14" />
          </Link>
        </div>

        {/* ✅ Make sure this section also allows scrolling if needed */}
        <nav className="bg-transparent flex-1 p-4">
          <div className="min-h-28 flex items-center">
            {state?.type && (
              <motion.section
                className="flex gap-2 item-center bg-gray-400/50 p-2 border-l-[5px] border-l-olive overflow-x-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.figure
                  className="bg-oliveDark/70 cursor-pointer p-3 rounded-xl shadow-md flex items-center justify-center !text-black font-bold transition-all"
                  whileHover={{ scale: 1.1 }}
                >
                  <img
                    src={
                      dashboardTabs.find((tab) => tab.type === state.type)?.img
                    }
                    alt="Dashboard Item"
                    className="w-8 h-8 object-contain"
                  />
                </motion.figure>
              </motion.section>
            )}
          </div>
          <p className="mt-4 mb-2 font-medium text-xl text-center">
            Secure Contact
          </p>
          {children?.length && (
            <div className="relative">
              {/* Add Contact Button */}
              <button
                onClick={() => setShowContactModal(true)}
                className="font-medium ml-auto mb-2 flex items-center gap-2 px-4 py-2 bg-oliveHover text-black rounded-lg hover:bg-oliveGreen transition"
              >
                <FaUserPlus />
                <span className="hidden md:block">Add Contact</span>
              </button>
              <ul className="overflow-y-auto h-80">
                {children[0] ? (
                  children[0]
                ) : (
                  <div className="flex flex-col items-center justify-center h-60 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-16 h-16 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5V8.25a6.75 6.75 0 10-13.5 0V10.5M12 15v2.25m-3.75-3h7.5"
                      />
                    </svg>
                    <p className="text-lg mt-2">No contacts available</p>
                    <p className="text-sm text-gray-400 text-center">
                      Start a conversation by adding new contacts.
                    </p>
                  </div>
                )}
              </ul>
              <ul className="flex flex-col gap-[10px] mt-20">
                {chatHistory
                  ?.slice(-2)
                  ?.reverse()
                  ?.map((chat) => (
                    <li
                      key={chat?.id}
                      className={`cursor-pointer flex gap-[10px] hover:bg-gray-800 group items-center p-3 font-medium bg-none`}
                    >
                      <section className="flex items-center gap-3">
                        <figure className="flex-shrink-0 relative w-12 h-12 bg-gray-300 rounded-full">
                          <img
                            src={chat?.image}
                            alt={chat?.chat_user_to_name?.split("")[0]}
                            className="rounded-full"
                          />
                        </figure>
                        <div className="mr-auto">
                          <p className="font-bold text-sm">
                            {chat?.chat_user_to_name}
                          </p>
                          <span className="text-oliveGreen text-xs ">
                            {chat?.last_message?.length > 15
                              ? `${chat?.last_message?.slice(0, 15)}...`
                              : chat?.last_message}
                          </span>
                        </div>
                        <div className="ml-auto flex flex-col items-end text-[10px]">
                          <span className="text-gray-200">Yesterday</span>
                          <span className="w-max font-medium px-2 py-1 bg-red-700 rounded-lg tet-center">
                            12
                          </span>
                        </div>
                      </section>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </nav>
      </motion.aside>
    </>
  );
}

export default SideBarTwo;
