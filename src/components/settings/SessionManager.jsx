import React, { useState } from "react";
import { Monitor, Smartphone, Tablet, XCircle } from "lucide-react";
import {
  FaChrome,
  FaFirefoxBrowser,
  FaEdge,
  FaSafari,
  FaApple,
  FaAndroid,
  FaWindows,
  FaLinux,
  FaLaptop,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useDeviceSettings from "../../hooks/useDeviceSettings";
import SelectionTab from "./SelectionTab";

const browserIconMap = {
  chrome: <FaChrome size={18} className="text-[#16a34a]" />,
  firefox: <FaFirefoxBrowser size={18} className="text-[#16a34a]" />,
  edge: <FaEdge size={18} className="text-[#16a34a]" />,
  safari: <FaSafari size={18} className="text-[#16a34a]" />,
};

const osIconMap = {
  "os x": <FaApple size={16} className="text-gray-700" />,
  ios: <FaApple size={16} className="text-gray-700" />,
  macos: <FaApple size={16} className="text-gray-700" />,
  androidos: <FaAndroid size={16} className="text-gray-700" />,
  windows: <FaWindows size={16} className="text-gray-700" />,
  linux: <FaLinux size={16} className="text-gray-700" />,
};

const SessionManager = () => {
  const { getDeviceLogsQuery, getDevicesQuery, updateDeviceStatusMutation } =
    useDeviceSettings();
  const {
    data: allDevices = [],
    isLoading: logsLoading,
    isError: logsError,
  } = getDeviceLogsQuery;

  const [filter, setFilter] = useState("active");
  const [updatingDevices, setUpdatingDevices] = useState({});

  // Single query for all devices (active, blocked, removed)
  const {
    data: filteredDevices = [],
    isLoading: devicesLoading,
    isError: devicesError,
  } = getDevicesQuery(filter === "all" ? null : filter);

  // Determine which devices to show
  const devicesToShow = (() => {
    switch (filter) {
      case "all":
        return allDevices;
      case "block":
        return filteredDevices.filter((d) => d.status === "block");
      case "remove":
        return filteredDevices.filter((d) => d.status === "remove");
      default:
        return filteredDevices;
    }
  })();

  const isLoading = logsLoading || devicesLoading;
  const isError = logsError || devicesError;

  const getDeviceIcon = (device) => {
    const os = device.os?.toLowerCase() || "";
    if (os.includes("android") || os.includes("ios"))
      return <Smartphone size={28} className="text-[#16a34a]" />;
    if (os.includes("tablet"))
      return <Tablet size={28} className="text-[#16a34a]" />;
    return <FaLaptop size={28} className="text-[#16a34a]" />;
  };

  const getStatusClass = (device) => {
    if (device.status === "active") return "bg-[#86efac]/30 text-[#166534]";
    if (device.status === "block") return "bg-[#fca5a5]/30 text-[#991b1b]";
    if (device.status === "remove") return "bg-[#d1d5db]/30 text-[#374151]";
    return "bg-[#fcd34d]/30 text-[#92400e]";
  };

  const handleUpdate = (id, status) => {
    setUpdatingDevices((prev) => ({ ...prev, [id]: status }));
    updateDeviceStatusMutation.mutate(
      { id, status },
      {
        onSettled: () =>
          setUpdatingDevices((prev) => ({ ...prev, [id]: null })),
      }
    );
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#16a34a]">
            Device Command Center
          </h1>
          <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
            Monitor and manage devices accessing your network. Secure your
            operations.
          </p>
        </div>

        {/* Tabs */}
        <SelectionTab setFilter={setFilter} filter={filter} />

        {/* Error Handling */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-red-600 gap-2">
            <FaExclamationTriangle size={36} />
            <p className="text-lg">Failed to load device sessions.</p>
            <p className="text-sm text-red-400">
              Please check your connection or try again later.
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && !isError && (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-[#16a34a] text-4xl" />
          </div>
        )}

        {/* Device List */}
        {!isLoading && !isError && devicesToShow.length === 0 && (
          <p className="text-center text-gray-500 py-20">
            No sessions found for this filter.
          </p>
        )}

        {!isLoading && !isError && devicesToShow.length > 0 && (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {devicesToShow.map((device) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 rounded-2xl shadow p-6 flex flex-col justify-between items-start gap-4 hover:scale-[1.01] hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gray-100 rounded-full flex-shrink-0">
                      {getDeviceIcon(device)}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {device.device} ({device.os}
                        {osIconMap[device.os?.toLowerCase()] || (
                          <FaLaptop size={16} className="text-gray-400" />
                        )}
                        )
                      </p>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-2 flex-wrap">
                        {browserIconMap[device.browser?.toLowerCase()] || null}
                        {device.browser} on {device.city}, {device.country}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        IP: {device.ip_address} | Last Active:{" "}
                        {new Date(device.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        device
                      )}`}
                    >
                      {device.is_current_session
                        ? "Active"
                        : device.status === "block"
                        ? "Blocked"
                        : device.status
                        ? device.status.charAt(0).toUpperCase() +
                          device.status.slice(1)
                        : "Inactive"}
                    </span>

                    {(device.is_current_session ||
                      device.status === "active") && (
                      <motion.button
                        onClick={() => handleUpdate(device.id, "remove")}
                        className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 flex items-center gap-1 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={updatingDevices[device.id] === "remove"}
                      >
                        <XCircle size={16} />
                        Logout
                        {updatingDevices[device.id] === "remove" && (
                          <FaSpinner className="animate-spin ml-2" />
                        )}
                      </motion.button>
                    )}

                    {device.status !== "" &&
                      device.status !== "block" &&
                      !device.is_current_session && (
                        <motion.button
                          onClick={() => handleUpdate(device.id, "block")}
                          className="px-4 py-2 bg-[#d97706] text-white rounded-full text-sm font-medium hover:bg-[#b45309] flex items-center gap-1 transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={updatingDevices[device.id] === "block"}
                        >
                          <XCircle size={16} />
                          Block
                          {updatingDevices[device.id] === "block" && (
                            <FaSpinner className="animate-spin ml-2" />
                          )}
                        </motion.button>
                      )}
                    {device.status === "block" && (
                      <motion.button
                        onClick={() => handleUpdate(device.id, "active")}
                        className="px-4 py-2 bg-[#d97706] text-white rounded-full text-sm font-medium hover:bg-[#b45309] flex items-center gap-1 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={updatingDevices[device.id] === "active"}
                      >
                        <XCircle size={16} />
                        Unblock
                        {updatingDevices[device.id] === "active" && (
                          <FaSpinner className="animate-spin ml-2" />
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionManager;
