import { MdMoreVert, MdMarkChatUnread } from "react-icons/md";
import { IoShieldCheckmark } from "react-icons/io5";
import AudioVisualizer from "../charts/AudioVisualizer";
import {
  FaDesktop,
  FaWaveSquare,
  FaWifi,
  FaVolumeUp,
  FaSignal,
} from "react-icons/fa";
import { RiBatteryChargeFill } from "react-icons/ri";
import { PiChatCircleTextBold } from "react-icons/pi";
import { IoMdFlame } from "react-icons/io";

const broadcasts = [
  {
    title: "Intel Ops",
    color: "bg-green-500",
    progress: 70,
    profileColor: "#759719",
  },
  {
    title: "Weapon Tracking",
    color: "bg-red-500",
    progress: 50,
    profileColor: "#8B0A1A",
  },
  {
    title: "Special Operations",
    color: "bg-yellow-500",
    progress: 50,
    profileColor: "#CDB30A",
  },
];

function Broadcast() {
  return (
    <div className="p-2">
      {/* Broadcast Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <IoMdFlame size={20} className="text-oliveGreen" />
          <h1 className="text-lg font-semibold">
            Secure Walkie Talkie Broadcast
          </h1>
        </div>
        <MdMoreVert
          size={20}
          className="text-gray-400 cursor-pointer ml-auto"
        />
      </div>

      {/* Broadcast List */}
      {broadcasts.map((item, index) => (
        <div
          key={index}
          className="mb-4 bg-gray-200 text-gray-800 font-medium flex min-h-24"
        >
          <div
            className="bg-blue-600 w-12 min-h-full flex flex-col justify-between items-center p-2 text-white"
            style={{ backgroundColor: item?.profileColor || "#666" }}
          >
            <span></span>
            <IoShieldCheckmark size={18} />
          </div>
          <section className="gap-2 p-3 w-full">
            <div className="w-full flex flex-col md:flex-row md:flex-wrap justify-between gap-2">
              <span>{item.title}</span>
              <div className="flex items-center space-x-3 w-max cursor-pointer overflow-x-auto">
                <MdMarkChatUnread className="size-3 md:size-4 text-black hover:text-green-600" />
                <FaDesktop className="size-3 md:size-4 text-black hover:text-green-600" />
                <FaWaveSquare className="size-3 md:size-4 text-black hover:text-green-600" />
                <PiChatCircleTextBold className="size-3 md:size-4 text-black hover:text-green-600" />
                <FaWifi className="size-3 md:size-4 text-black hover:text-green-600" />
                <FaVolumeUp className="size-3 md:size-4 text-black hover:text-green-600" />
                <RiBatteryChargeFill className="size-3 md:size-4 text-black hover:text-green-600" />
                <FaSignal className="size-3 md:size-4 text-red-600" />
              </div>
            </div>
            <div className="mt-2">
              <AudioVisualizer
                progress={item?.progress || 50}
                fillColor={index > 0 ? "#FF0000" : null}
                width={200}
              />
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}

export default Broadcast;
