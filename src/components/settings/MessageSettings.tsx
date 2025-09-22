import React, { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import ToggleSwitch from "../ToggleSwitch";
import useDeviceSettings from "../../hooks/useDeviceSettings";

function MessageSettings() {
  const { showToggleSwitch, setShowToggleSwitch, settings, setSettings } =
    useContext(ChatContext);

  const { updateUserSettingsMutation, getLanguagesQuery, getSettingsQuery } =
    useDeviceSettings();

  const { data: languages, isLoading: isLanguagesLoading } = getLanguagesQuery;
  const { data: userSettings, isLoading: isSettingsLoading } = getSettingsQuery;

  // Update settings when API data is ready
  useEffect(() => {
    if (userSettings) {
      setSettings((prev) => ({
        ...prev,
        ...userSettings,
      }));
    }
  }, [userSettings]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]:
        typeof prev[key] === "boolean" ? !prev[key] : prev[key] === 1 ? 0 : 1,
    }));

    if (key === "toggleSwitch") setShowToggleSwitch(!showToggleSwitch);
  };

  const handleChange = (key: keyof typeof settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const formData = new FormData();
    [
      "hide_message",
      "hide_message_style",
      "chat_language",
      "walkie_language",
      "app_language",
    ].forEach((key) => {
      formData.append(key, String(settings[key as keyof typeof settings]));
    });
    updateUserSettingsMutation.mutate(formData as any);
  };

  // 🔹 Global loading state
  if (isLanguagesLoading || isSettingsLoading) {
    return (
      <div className="w-full p-6 flex justify-center items-center">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-3 md:p-6 space-y-6">
      <h3 className="text-gray-700 font-bold mb-4">Message Settings</h3>

      {/* Toggle Settings */}
      <div className="space-y-4">
        {[
          {
            label: "Drag to read",
            key: "dragToRead",
            content: "Reveal content by dragging a handle.",
          },
          {
            label: "Double Click to Read",
            key: "doubleClickToRead",
            content: "Access full content with double click.",
          },
          {
            label: "Press and Hold to Read",
            key: "pressAndHoldToRead",
            content: "Long press to reveal additional content.",
          },
          {
            label: "Chat Visibility",
            key: "hide_message",
            content: "Control who can see your chat conversations.",
          },
          {
            label: "Show Toggle Switch on Messages",
            key: "toggleSwitch",
            content: "Toggle visibility of messages manually.",
          },
        ].map(({ label, key, content }) => (
          <div key={key} className="flex items-center gap-3 justify-between">
            <div>
              <h4 className="text-sm text-gray-800 font-medium">{label}</h4>
              <p className="text-gray-500 text-sm mt-2">{content}</p>
            </div>
            <ToggleSwitch
              isChecked={Boolean(settings[key as keyof typeof settings])}
              onToggle={() => toggleSetting(key as keyof typeof settings)}
            />
          </div>
        ))}
      </div>

      {/* Hide Message Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hide Message Style
        </label>
        <select
          value={settings.hide_message_style}
          onChange={(e) => handleChange("hide_message_style", e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm bg-white focus:border-oliveLight focus:ring-1 focus:ring-oliveLight text-gray-800 px-3 py-2 transition duration-150"
        >
          <option value="open_once">Open Once</option>
          <option value="hold_open">Hold Open</option>
        </select>
      </div>

      {/* Languages */}
      {["chat_language", "walkie_language", "app_language"].map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {key.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </label>
          <select
            value={settings[key as keyof typeof settings]}
            onChange={(e) =>
              handleChange(key as keyof typeof settings, e.target.value)
            }
            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm bg-white focus:border-oliveLight focus:ring-1 focus:ring-oliveLight text-gray-800 px-3 py-2 transition duration-150 hover:border-olive"
          >
            {languages?.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.language}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={updateUserSettingsMutation.isPending}
          className="px-4 py-2 rounded-md bg-oliveLight text-white hover:bg-olive disabled:opacity-50"
        >
          {updateUserSettingsMutation.isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

export default MessageSettings;
