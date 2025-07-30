//Dashboard icons import
import { FaRegUserCircle, FaCog, FaRobot, FaFileAlt } from "react-icons/fa";
import { MdGroups, MdOutlineCall, MdOutlineFolderShared, MdPhoneMissed } from "react-icons/md";
import { IoIosChatboxes, IoMdWifi } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";

//Dasboard tabs icons
import call from "../assets/call.png";
import connect from "../assets/connect.png";
import mail from "../assets/mail-secure.png";
import secure from "../assets/secure.png";
import contact from "../assets/contact.png";
import sharing from "../assets/device.png";
import drive from "../assets/drive.png";
import military from "../assets/military.png";
import talkie from "../assets/walkie-talkie.png";
import { FaWalkieTalkie } from "react-icons/fa6";

export const dashboardOptions = [
  {
    type: "HOME",
    title: "Home",
    route: "/dashboard/home",
    icon: BiCategoryAlt,
    iconActive: null,
  },
  {
    type: "CHAT",
    title: "Secure Chat",
    route: "/dashboard/chat",
    icon: IoIosChatboxes,
    iconActive: null,
  },
  {
    type: "GROUP",
    title: "Secure Groups",
    route: "/dashboard/groups",
    icon: MdGroups,
    iconActive: null,
  },
  {
    type: "AI",
    title: "iSurvive",
    route: "/dashboard/isurvive",
    icon: FaRobot,
    iconActive: null,
  },
  {
    type: "CALLS",
    title: "Secure Calls",
    route: "/dashboard/contacts",
    icon: MdOutlineCall,
    iconActive: null,
  },
  {
    type: "COMM",
    title: "Walkie talkie",
    route: "/dashboard/comm",
    icon: IoMdWifi,
    iconActive: null,
  },
  {
    type: "FILE-SHARING",
    title: "File Sharing",
    route: "/dashboard/file-sharing",
    icon: MdOutlineFolderShared,
    iconActive: null,
  },
];

export const utilOptions = [
  {
    type: "PROFILE",
    title: "Profile",
    route: "/dashboard/profile",
    icon: FaRegUserCircle,
    iconActive: null,
  },
  {
    type: "SETTINGS",
    title: "Settings",
    route: "/dashboard/settings",
    icon: FaCog,
    iconActive: null,
  }
];

export const dashboardTabs = [
  {
    type: "CALL",
    title: "Call",
    img: call,
    view: "chat",
    type: "CHAT",
    route: "/dashboard/chat"
  },
  {
    type: "CONNECT",
    title: "Discover",
    img: connect,
    view: "connect",
    type: "CONNECT",
    route: "/dashboard/home"
  },
  {
    type: "CONFERENCE",
    title: "Conference",
    img: secure,
    view: "conference",
    route: "/dashboard/conference"
  },
  {
    type: "COMM",
    title: "Walkie talkie",
    img: talkie,
    view: "comm",
    route: "/dashboard/comm",
  },
  {
    type: "DRIVE",
    title: "Drive",
    img: drive,
    view: "drive",
    route: "/dashboard/drive",
  },
  {
    type: "MAIL",
    title: "Mail",
    img: mail,
    view: "email",
    route: "/dashboard/mail",
  },
  {
    type: "CONTACT",
    title: "Contact",
    img: contact,
    view: "contact",
    route: "/dashboard/contacts",
  },
  {
    type: "FILE-SHARING",
    title: "File Sharing",
    img: sharing,
    view: "sharing",
    route: "/dashboard/file-sharing",
  },
  {
    type: "MILITARY",
    title: "Military",
    img: military,
    view: "military",
    route: "/dashboard/isurvive",
  }
]

export const contactList = [
  {
    "id": 1,
    "name": "Michael Johnson",
    "image": "/images/users/michael-johnson.png",
    "status": "Online",
  },
  {
    "id": 2,
    "name": "Emma Williams",
    "image": "/images/users/emma-williams.png",
    "status": "Offline",
  },
  {
    "id": 3,
    "name": "James Anderson",
    "image": "/images/users/james-anderson.png",
    "status": "Active Now",
  },
  {
    "id": 4,
    "name": "Olivia Brown",
    "image": "/images/users/olivia-brown.png",
    "status": "Busy",
  },
  {
    "id": 5,
    "name": "William Martinez",
    "image": "/images/users/william-martinez.png",
    "status": "Away",
  }
]

export const chatUtilOptions = [
  {
    "id": 6,
    "name": "William Martinez",
    "message": "GG Bro, 2nd place is great thanks",
    "image": "/images/users/william-martinez.png",
    "status": "Away",
  },
  {
    "id": 7,
    "name": "William Martinez",
    "message": "Well played, bro!",
    "image": "/images/users/william-martinez.png",
    "status": "Away",
  }
]

export const categories = [
  { title: "Miss Calls", key:"missedCalls", count: 2, icon: MdPhoneMissed, bg: "bg-green-600", ref: "contacts" },
  { title: "Messages", key:"messages", count: 5, icon: IoIosChatboxes, bg: "bg-gray-700", ref: "chat" },
  { title: "Signal Comms", key:"signalComms", count: 8, icon: FaWalkieTalkie, bg: "bg-gray-700", ref: "comm" },
  { title: "File Sharing", key:"fileSharing", count: 6, icon: FaFileAlt, bg: "bg-gray-700", ref: "file-sharing" },
];


const pastelColors = [
  "bg-pink-200", "bg-green-200", "bg-blue-200", "bg-yellow/20",
  "bg-purple-200", "bg-red-200", "bg-indigo-200", "bg-teal-200"
];
const textColors = [
  "text-pink-500", "text-green-500", "text-blue-500", "text-yellow",
  "text-purple-500", "text-red-500", "text-indigo-500", "text-teal-500"
];

export function getColorByIndex(index) {
  return {
    bg: pastelColors[index % pastelColors.length],
    text: textColors[index % textColors.length]
  };
}