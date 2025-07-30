import React from "react";
import { motion } from "framer-motion";
import { MdConstruction } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-40 bg-transparent px-6 text-center">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-transparent p-6 rounded-full shadow-lg"
      >
        <MdConstruction className="text-6xl text-yellow-500" />
      </motion.div>

      {/* Title & Description */}
      <h1 className="text-2xl font-semibold text-gray-400 mt-4">
        Page Under Construction 🚧
      </h1>
      <p className="text-gray-300 mt-2 max-w-md">
        We're working hard to bring this page to life. Check back soon!
      </p>

      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-oliveGreen text-white font-medium rounded-lg shadow-md hover:bg-olive transition-all"
      >
        <FaArrowLeft />
        Go Back
      </motion.button>
    </div>
  );
}

export default ComingSoon;
