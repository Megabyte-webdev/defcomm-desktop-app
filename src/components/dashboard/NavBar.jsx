import { memo, useContext } from "react";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { PiBellLight } from "react-icons/pi";
import ProfileDropdown from "./ProfileDropdown";
import Modal from "../modal/Modal";
import NotificationList from "../../utils/notifications/NotificationList";
import { NotificationContext } from "../../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContext } from "../../context/ChatContext";

function NavBar({ user, title, isMenuOpen, toogleIsOpen }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isChatPage = pathname.includes("/dashboard/chat");
  const { unseenCount, notificationOpen, toggleNotificationModal } =
    useContext(NotificationContext);

  return (
    <>
      <nav
        className={`${
          isChatPage ? "lg:hidden" : "lg:flex"
        } p-2 flex items-center justify-between gap-2 bg-transparent h-20`}
      >
        {/* Sidebar Toggle */}
        <div
          onClick={toogleIsOpen}
          className="cursor-pointer text-white block mr-2 md:hidden"
        >
          {!isMenuOpen ? <FaBars size={24} /> : <FaTimes size={24} />}
        </div>

        {/* Page Title */}
        <h1 className="font-bold text-white text-sm md:text-[18px] lg:text-[25px] truncate mr-auto md:mr-0">
          {title || "Discover"}
        </h1>

        {/* Search Bar */}
        <div className="flex-1 max-w-[400px] min-w-18 mx-1 hidden md:flex h-10 items-center gap-2 bg-gray-500/50 p-2 text-white">
          <FaSearch size={20} />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full h-[80%] placeholder:text-sm placeholder:text-inherit focus:outline-none bg-transparent"
          />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 text-white">
          {/* Notification Bell */}
          <div
            className="relative flex items-center justify-center cursor-pointer gap-2 w-10 h-10 rounded-full bg-gray-500/50"
            onClick={toggleNotificationModal}
          >
            <PiBellLight size={20} />
            <AnimatePresence>
              {unseenCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-[4px] font-bold shadow-sm"
                >
                  {unseenCount > 99 ? "99+" : unseenCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* User Dropdown */}
          <ProfileDropdown user={user} />
        </div>
      </nav>

      {/* Notifications Modal */}
      <Modal isOpen={notificationOpen} closeModal={toggleNotificationModal}>
        <NotificationList />
      </Modal>
    </>
  );
}

export default memo(NavBar);
