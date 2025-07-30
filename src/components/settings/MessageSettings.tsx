import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import ToggleSwitch from "../ToggleSwitch";

function MessageSettings() {
  const {
    chatVisibility,
    setChatVisibility,
    showToggleSwitch,
    setShowToggleSwitch,
  } = useContext(ChatContext);
  const [settings, setSettings] = useState({
    dragToRead: true,
    doubleClickToRead: true,
    pressAndHoldToRead: false,
    visibility: chatVisibility,
    toggleSwitch: showToggleSwitch,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    if (key === "visibility") {
      setChatVisibility(!chatVisibility);
    } else if (key === "toggleSwitch") {
      setShowToggleSwitch(!showToggleSwitch);
    }
  };

  return (
    <div className="w-full p-3 md:p-6 ">
      <h3 className="text-gray-700 font-bold mb-4">Message Setting</h3>

      {/* Setting Items */}
      <div className="space-y-4">
        {[
          {
            label: "Drag to read",
            key: "dragToRead",
            content:
              "A messaging interactive feature that lets users reveal more content by dragging a handle",
          },
          {
            label: "Double Click to Read",
            key: "doubleClickToRead",
            content:
              "Allows users to access full content or detailed information by double-clicking on a preview",
          },
          {
            label: "Press and Hold to Read",
            key: "pressAndHoldToRead",
            content:
              "Lets users access additional content by long-pressing on an item. It's a quick way to reveal more information",
          },
          {
            label: "Chat Visibility",
            key: "visibility",
            content:
              "Controls who can see your chat conversations and when they appear",
          },
          {
            label: "Show Toggle Switch on Messages",
            key: "toggleSwitch",
            content:
              "Allows manual toggling of message visibility. If off, click message to reveal.",
          },
        ].map(({ label, key, content }) => (
          <div key={key} className="flex items-center gap-3 justify-between">
            <div>
              <h4 className="text-sm text-gray-800 font-medium">{label}</h4>
              <p className="text-gray-500 text-sm mt-2">{content}</p>
            </div>
            <ToggleSwitch
              isChecked={settings[key as keyof typeof settings]}
              onToggle={() => toggleSetting(key as keyof typeof settings)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageSettings;
