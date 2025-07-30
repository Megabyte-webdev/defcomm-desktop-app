import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import logo from "../assets/logo.png";
import logoIcon from "../assets/logo-icon.png";
import intro1 from "../assets/intro4.png";
import intro2 from "../assets/intro6.png";
import intro3 from "../assets/intro5.png";
import grid from "../assets/bg-grid.png";
import call from "../assets/call.png";
import scroll from "../assets/scroll.png";
import connect from "../assets/connect.png";
import mail from "../assets/mail-secure.png";
import secure from "../assets/secure.png";
import talkie from "../assets/walkie-talkie.png";
import LoginForm from "../components/LoginForm";
import LoginTwo from "../components/LoginTwo";
import BackToTopButton from "../components/BackToTopButton";
import { FaSearch } from "react-icons/fa";
import { MdOutlineMoreVert } from "react-icons/md";

import SEOHelmet from "../engine/SEOHelmet";

const DefcommLogin = () => {
  const { scrollYProgress } = useScroll();
  const [view, setView] = useState("call");
  const moveDown = useTransform(scrollYProgress, [0, 1], [0, 150]); // Moves intro1 up and down
  const moveUp = useTransform(scrollYProgress, [0, 1], [0, -40]); // Moves intro1 up and down
  const rotateScroll = useTransform(scrollYProgress, [0, 1], [0, 360]); // Rotates scroll image
  return (
    <>
      {/* SEO Content */}
      <SEOHelmet title="Login" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full min-h-screen flex flex-col items-center justify-center text-white p-6"
        style={{
          background: `linear-gradient(to bottom, #101500 10%, #000000 15%, #000000 65%, #36460A 90%)`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full sticky top-0 z-50 flex justify-between items-center mb-auto bg-transparent backdrop-blur-lg px-4 py-2"
        >
          <img src={logoIcon} alt="Defcomm Icon" className="w-20" />
          {/* <div className="flex gap-2">
          <p className="w-10 h-10 rounded-full bg-white/30 text-gray-200/50 flex items-center justify-center"><FaSearch /></p>
          <button className="bg-white text-gray-700 px-6 py-2 rounded-full shadow-md font-medium">Login</button>
        </div> */}
          <MdOutlineMoreVert size={24} className="mx-2 cursor-pointer" />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            background: `url(${grid})`,
            backgroundPosition: "center left",
            backgroundRepeat: "no-repeat",
          }}
          className="relative w-full flex flex-col items-center"
        >
          <motion.img
            src={scroll}
            alt=""
            className="w-16 absolute right-[8%] top-[1%]"
            style={{ rotate: rotateScroll }}
          />
          <motion.img
            src={intro1}
            alt=""
            className="hidden lg:block w-48 min-[1200px]:w-60 absolute translate-y-[0%] translate-x-[10%]"
            style={{ y: moveDown, x: "-40%" }}
          />
          <motion.img
            src={intro2}
            alt=""
            className="hidden lg:block w-48 min-[1200px]:w-60 absolute bottom-[0%] translate-y-[20%] translate-x-[10%]"
            style={{ y: moveUp, x: "-100%" }}
          />
          <motion.img
            src={intro3}
            alt=""
            className="hidden min-[1200px]:block min-[1200px]:w-48 w-60 absolute right-0 bottom-0 translate-y-[-60%] translate-x-[-5%]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ y: moveUp }}
          />

          <LoginForm />
        </motion.section>

        {/* Footer Section */}
        <motion.div
          className="my-6 md:mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            3<span className="text-oliveGreen">6</span>0 Degree Protection
          </h3>
          <p className="text-sm mt-2 max-w-[370px] text-gray-200 font-medium">
            Defcomm Technology Solution is producing secure and Encrypted
            Embedded Technology with the secure chips.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.ul
          className="flex gap-2 item-center w-full mt-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {[
            { img: mail, view: "email" },
            { img: call, view: "call" },
            { img: connect, view: "connect" },
            { img: secure, view: "secure" },
            { img: talkie, view: "comm" },
          ]?.map((item, idx) => (
            <motion.li
              key={idx}
              className={`${
                view !== item?.view ? "bg-oliveDark/70" : "bg-white"
              } cursor-pointer p-3 rounded-xl`}
              whileHover={{ scale: 1.1 }}
            >
              <img
                src={item?.img}
                alt="img"
                className={`${
                  view === item?.view && idx !== 1 && "filter invert"
                } w-5 h-5`}
              />
            </motion.li>
          ))}
        </motion.ul>

        {/* Footer Links */}
        <motion.section
          className="mt-3 border-t border-gray-400 pt-4 flex flex-wrap items-center justify-center lg:justify-between gqp-y-2 gap-x-6 w-[95%] md:max-w-[1400px] mx-auto text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            borderImageSource:
              "linear-gradient(to left, rgba(60, 60, 60, 0.05), #dddddd, rgba(60, 60, 60, 0.05))",
            borderImageSlice: "1 0 1 0",
            borderImageRepeat: "stretch",
            borderTop: "2px solid",
          }}
        >
          <img src={logo} alt="Defcomm Logo" className="w-40" />
          <div className="flex gap-2 md:gap-6 text-sm">
            <a href="#" className="underline">
              PRODUCT
            </a>
            <a href="#" className="underline">
              SUPPORT
            </a>
            <a href="#" className="underline">
              COOPERATION
            </a>
          </div>
          <div className="text-xs opacity-8">
            © Copyright Defcomm, All Rights Reserved.
          </div>
        </motion.section>
        <BackToTopButton />
      </motion.div>
    </>
  );
};

export default DefcommLogin;
