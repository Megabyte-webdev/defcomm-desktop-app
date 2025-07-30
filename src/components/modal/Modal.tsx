import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { ChatContext } from "../../context/ChatContext";

interface MinimizableModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  canMinimize?: boolean;
  minimizedContent?: React.ReactNode;
}

const Modal = ({
  isOpen,
  closeModal,
  children,
  canMinimize = false,
  minimizedContent,
}: MinimizableModalProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { setModalTitle, modalTitle } = useContext(ChatContext);

  if (!isOpen && !isMinimized) return null;

  return (
    <>
      {/* Full Modal Overlay */}
      <div className="fixed inset-0 z-[1000000] pointer-events-none">
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
            isOpen && !isMinimized
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative bg-white rounded-lg shadow-lg max-h-[90vh] overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white p-2 border-b flex justify-between items-center gap-2">
              <h1 className="text-oliveDark text-base font-bold mr-auto">
                {modalTitle || ""}
              </h1>
              {canMinimize && (
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 rounded-full bg-gray-300 hover:bg-gray-400"
                  aria-label="Minimize Modal"
                >
                  <MdFullscreenExit size={20} />
                </button>
              )}
              <button
                onClick={() => {
                  closeModal();
                  setModalTitle("Defcomm");
                  setIsMinimized(false);
                }}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                aria-label="Close Modal"
              >
                <MdClose size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-3rem)]">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Draggable Minimized Bar */}
      <AnimatePresence>
        {isMinimized && canMinimize && (
          <motion.div
            drag
            dragConstraints={{
              top: -1000,
              bottom: 1000,
              left: -1000,
              right: 1000,
            }}
            dragElastic={0.2}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 right-4 z-[1000001] flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg cursor-move"
          >
            <div className="truncate flex-1 font-medium cursor-default">
              {minimizedContent || modalTitle || "Minimized"}
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              aria-label="Maximize Modal"
            >
              <MdFullscreen size={20} />
            </button>
            <button
              onClick={() => {
                closeModal();
                setIsMinimized(false);
              }}
              className="p-1 rounded bg-red-600 hover:bg-red-700"
              aria-label="Close Modal"
            >
              <MdClose size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
