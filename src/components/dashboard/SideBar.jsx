import React from "react";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import mainLogo from "../../assets/logo-icon.png";
import { MdKey } from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom'
function SideBar({ children, authDetails, toogleIsOpen, isMenuOpen }) {
  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isMenuOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`${isMenuOpen ? "fixed left-0 top-0 bottom-0 z-[1000]" : "hidden"
          } md:!flex flex-col md:!translate-x-0 md:relative bg-transparent w-72 text-white h-full overflow-y-auto`} // ✅ Ensure sidebar scrolls
      >
        <div className="relative p-4 text-xl font-bold flex flex-col items-center min-h-28 bg-[#2c3b03]">
          <div
            onClick={toogleIsOpen}
            className="absolute top-8 left-8 cursor-pointer text-white block mr-2 md:hidden transition-all ease-in-out duration-300"
          >
            {!isMenuOpen ? <FaBars size={24} /> : <FaTimes size={24} />}
          </div>
          <Link to={"/dashboard/home"}><img src={mainLogo} alt="logo" className="w-14" /></Link>
        </div>

        {/* ✅ Make sure this section also allows scrolling if needed */}
        <nav className="bg-oliveLight flex-1 p-4">
          <div className="min-h-28">
            <h3 className="font-semibold text-xl flex gap-[10px] items-center p-3 capitalize">
              <MdKey size={24} className="text-[#c0c00e] rotate-90" />
              {authDetails?.user?.email
                ? authDetails?.user?.email?.slice(0, 3) + 'xxxxxx'
                : "Anonymous"}
            </h3>
          </div>

          <ul>{children[0]}</ul>
          <ul className="mt-5">{children[1]}</ul>

          <p className="min-h-32 font-medium flex gap-[10px] items-end p-3">
            <AiOutlineQuestionCircle size={20} />
            Supports
          </p>
        </nav>
      </motion.aside>

    </>
  );
}

export default React.memo(SideBar);
