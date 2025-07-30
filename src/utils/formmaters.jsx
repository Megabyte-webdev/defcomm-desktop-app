import { toast } from "react-toastify";

import DOMPurify from "dompurify";

export const parseHtml = (inputString) => {
  if (typeof inputString !== "string") return "";

  // Sanitize input to prevent XSS attacks
  const sanitizedString = DOMPurify.sanitize(inputString, { ALLOWED_TAGS: [] });

  // Preserve line breaks (`\n`) by replacing them with `<br />`
  return sanitizedString.replace(/\n/g, "  \n"); // Markdown uses "  \n" for new line
};
export const getTimeAgo = (timestamp) => {
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000); // in seconds

  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins}min${mins !== 1 ? "s" : ""} ago`;
  }
  if (diff < 86400) {
    const hrs = Math.floor(diff / 3600);
    return `${hrs}hr${hrs !== 1 ? "s" : ""} ago`;
  }
  const days = Math.floor(diff / 86400);
  return `${days}d ago`;
};

export const formatCallDuration = (totalSeconds) => {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}.${minutes}.${seconds}`;
};

// Format the date for messages
export const getFormattedDate = (dateString) => {
  const messageDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

export const extractErrorMessage = (error) => {
  const getString = (data) => {
    return typeof data === "string" ? data : JSON.stringify(data);
  };

  if (error?.response?.data?.message) {
    return getString(error.response.data.message);
  }

  if (error?.response?.data?.error) {
    return getString(error.response.data.error);
  }

  if (error?.response?.error) {
    return getString(error.response.error);
  }

  return getString(error?.message || "An unknown error occurred");
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const maskEmail = (email) => {
  if (!email) return "";
  const [name, domain] = email.split("@");
  return `${name.slice(0, 3)}****@${domain}`;
};

export const maskPhone = (phone) => `${phone.substring(0, 5)}******`;
