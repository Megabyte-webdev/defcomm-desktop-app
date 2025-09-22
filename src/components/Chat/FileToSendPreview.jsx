import React, { useContext } from "react";
import { FaFileAlt, FaTimes } from "react-icons/fa";
import { ChatContext } from "../../context/ChatContext";

const FileToSendPreview = ({ desktop }) => {
  const { file, setFile } = useContext(ChatContext);
  return (
    <div
      className={`${
        desktop ? "bg-oliveGreen" : "bg-oliveDark"
      } flex items-center gap-3 p-3 mb-2 rounded-lg shadow-md`}
    >
      <FaFileAlt
        className={`${desktop ? "text-oliveDark" : "text-oliveGreen"}`}
        size={20}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium w-[90%] truncate">{file.name}</p>
        <p className={`${desktop ? "text-gray-700" : "text-gray-400"} text-xs`}>
          {(file.size / 1024).toFixed(2)} KB
        </p>
      </div>
      <button
        onClick={() => setFile(null)}
        className="text-red-400 hover:text-red-500 transition"
      >
        <FaTimes size={18} />
      </button>
    </div>
  );
};

export default FileToSendPreview;
