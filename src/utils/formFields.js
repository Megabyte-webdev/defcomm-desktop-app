import { AiOutlineBell, AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { MdDevices, MdMessage, MdVerifiedUser } from "react-icons/md";

export const getProfileFormConfig = ({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  showEmail,
  setShowEmail,
  showPhone,
  setShowPhone,
  errors,
  setErrors,
}) => {
  const handleFullNameChange = (value) => {
    const trimmedValue = value.trim().replace(/\s+/g, " ");
    setFullName(value);

    const words = trimmedValue.split(" ");
    if (words.length !== 2) {
      setErrors((prev) => ({
        ...prev,
        name: "Enter only first and last name",
      }));
      return;
    }
    if (!/^[A-Za-z]+$/.test(words[0]) || !/^[A-Za-z]+$/.test(words[1])) {
      setErrors((prev) => ({
        ...prev,
        name: "Only alphabets are allowed",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, name: "" }));
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErrors((prev) => ({
      ...prev,
      email: emailRegex.test(value) ? "" : "Enter a valid email address",
    }));
  };

  const handlePhoneChange = (value) => {
    const sanitized = value.replace(/[^+\d]/g, ""); // keep digits and +
    setPhone(sanitized);

    const digitsOnly = sanitized.replace(/\D/g, "");
    if (digitsOnly.length < 8 || digitsOnly.length > 14) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be between 8 and 14 digits",
      }));
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return `${name[0]}***@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone || phone.length < 5) return phone;
    return phone.slice(0, 3) + "***" + phone.slice(-2);
  };

  return [
    {
      label: "Full Name",
      value: fullName,
      sample: "(e.g John Doe)",
      type: "text",
      name: "name",
      onChange: handleFullNameChange,
      error: errors.name,
    },
    {
      label: "Email",
      value: showEmail ? email : maskEmail(email),
      sample: "(e.g afowebdev@gmail.com)",
      type: "email",
      name: "email",
      toggle: setShowEmail,
      state: showEmail,
      onChange: handleEmailChange,
      readOnly: true,
      warning: "For security reasons, your email cannot be changed.",
      error: errors.email,
    },
    {
      label: "Phone Number",
      value: showPhone ? phone : maskPhone(phone),
      sample: "(e.g +2348106244890)",
      name: "phone",
      type: "phone",
      toggle: setShowPhone,
      state: showPhone,
      onChange: handlePhoneChange,
      error: errors.phone,
    },
  ];
};

export const settingsManagement = [
  {
    label: "Profile",
    key: "profile",
    icon: AiOutlineUser,
    content:
      "View and edit your profile experience and manage their identity across the platform.",
  },
  {
    label: "Notification",
    key: "notification",
    icon: AiOutlineBell,
    content: "Let users control how and when they receive alerts from the app.",
  },
  {
    label: "Set 2FA",
    key: "2FA",
    icon: AiOutlineLock,
    content:
      "Adds an extra layer of security to user accounts by requiring a second form of verification in addition to a password.",
  },
  {
    label: "Message Reading Pattern",
    key: "message",
    icon: MdMessage,
    content:
      "Allows users to define when and how messages are read and decrypted based on a set pattern or schedule.",
  },
  {
    label: "Device Sessions",
    key: "deviceSessions",
    icon: MdDevices,
    content:
      "Manage all devices logged into your account, view active sessions, and control login history for enhanced security.",
  },
];
