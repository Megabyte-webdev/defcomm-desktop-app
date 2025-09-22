import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageSettings from "../components/settings/MessageSettings";
import Profile from "./Profile";
import { settingsManagement } from "../utils/formFields";
import SessionManager from "../components/settings/SessionManager";

const Settings = () => {
  const [setting, setSetting] = useState("message");

  return (
    <div className="relative w-full min-[1200px]:max-w-[1000px] h-[80vh] mx-auto bg-white shadow-md p-3 min-[1200px]:p-6 min-[1200px]:flex overflow-y-auto">
      {/* Sidebar */}
      <div className="w-full min-[1200px]:w-1/3 border-b border-r-0 min-[1200px]:border-r min-[1200px]:border-b-0 min-[1200px]:sticky min-[1200px]:top-0 overflow-y-auto">
        <h3 className="text-gray-700 font-semibold mb-4 sticky top-0 bg-white z-10 w-max p-2">
          SETTINGS
        </h3>
        <div className="space-y-4">
          {settingsManagement?.map((feature) => (
            <motion.div
              key={feature.key}
              onClick={() => setSetting(feature.key)}
              className={`cursor-pointer p-2 flex items-center gap-2 transition-all ${
                setting === feature.key
                  ? "border-l-4 border-olive bg-gray-200/30"
                  : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700"
                animate={{ rotate: setting === feature.key ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon && (
                  <feature.icon size={20} className="text-gray-700" />
                )}
              </motion.div>
              <div>
                <h4 className="text-sm text-gray-800 font-medium">
                  {feature.label}
                </h4>
                <p className="text-gray-500 text-sm mt-1">{feature?.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full min-[1200px]:w-2/3 flex-1 p-4 ">
        <AnimatePresence mode="wait">
          {setting === "message" ? (
            <motion.div
              key={setting?.key}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <MessageSettings />
            </motion.div>
          ) : setting === "profile" ? (
            <motion.div
              key={setting?.key}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Profile />
            </motion.div>
          ) : setting === "deviceSessions" ? (
            <motion.div
              key={setting?.key}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <SessionManager />
            </motion.div>
          ) : (
            <motion.div
              key="emptyView"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full h-32 flex items-center justify-center text-gray-500"
            >
              Select a setting to view details
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;
