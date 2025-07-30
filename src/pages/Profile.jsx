import { motion, AnimatePresence } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  MdAccountCircle,
  MdCameraAlt,
  MdClose,
  MdEdit,
  MdSave,
  MdSecurity,
  MdVisibility,
  MdVisibilityOff
} from "react-icons/md";
import { LuNotebookText } from "react-icons/lu";
import useAuth from "../hooks/useAuth";
import { FaLock, FaSpinner } from "react-icons/fa";
import { onFailure } from "../utils/notifications/OnFailure";
import SEOHelmet from "../engine/SEOHelmet";
import ToggleSwitch from "../components/ToggleSwitch";
import {maskPhone, maskEmail} from '../utils/formmaters'
const Profile = () => {
  const { profile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Details");
  const { authDetails } = useContext(AuthContext);
  const user = authDetails?.user;
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [enable2FA, setEnable2FA] = useState(false);

  const [errors, setErrors] = useState({});
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFullNameChange = (value) => {
    const trimmedValue = value.trim().replace(/\s+/g, " ");
    setFullName(value);
    const words = trimmedValue.split(" ");
    if (words.length !== 2) {
      setErrors((prev) => ({ ...prev, name: "Enter only first and last name" }));
      return;
    }
    if (!/^[A-Za-z]+$/.test(words[0]) || !/^[A-Za-z]+$/.test(words[1])) {
      setErrors((prev) => ({ ...prev, name: "Only alphabets are allowed" }));
      return;
    }
    setErrors((prev) => ({ ...prev, name: "" }));
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErrors((prev) => ({
      ...prev,
      email: emailRegex.test(value) ? "" : "Enter a valid email address"
    }));
  };

  const handlePhoneChange = (value) => {
    const numericValue = value.replace(/\D/g, "");
    setPhone(numericValue);
    if (numericValue.length !== 11) {
      setErrors((prev) => ({ ...prev, phone: "Phone number must be exactly 11 digits" }));
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleSave = async () => {
    const words = fullName.trim().split(" ");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{11}$/;

    let newErrors = {};
    if (words.length !== 2) newErrors.fullName = "Enter only first and last name";
    if (!emailRegex.test(email)) newErrors.email = "Enter a valid email address";
    if (!phoneRegex.test(phone)) newErrors.phone = "Enter a valid phone number (11 digits)";

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      onFailure({ message: "Profile Details Error", error: "please check and correct your profile" });
      return;
    }

    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("enable_2fa", 1);

    if (profileImage) formData.append("avatar", profileImage);

    try {
      await profile(formData);
      setIsEditing(false);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setErrors({});
      const name = user?.name?.includes(",") ? user.name.split(",").reverse().join(" ").trim() : user.name;
      setFullName(name || "");
      setEmail(user?.email || "");
      setPhone(user?.phone || "");
      setAddress(user?.address || "");
      setEnable2FA(true);
      setPreviewImage(user?.avatar ? `${import.meta.env.VITE_BASE_URL}${user?.avatar}` : "");
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setIsEditing(true);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowEmail(true);
    setShowPhone(true);
  };

  useEffect(() => {
    if (isEditing) handleEdit();
  }, [isEditing]);


  return (
    <motion.div className="p-3 md:p-6 w-full rounded-lg mb-5 bg-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <SEOHelmet title="Profile" />
      <div className="flex flex-col items-center relative">
        <motion.figure className="w-24 h-24 rounded-full border-4 border-gray-300 flex items-center justify-center relative cursor-pointer" whileHover={{ scale: 1.05 }} onClick={() => previewImage && setIsProfileOpen(true)}>
          {previewImage ? <img src={previewImage} alt="Profile" className="w-full h-full object-cover rounded-full" /> : <MdAccountCircle className="size-[80%]" />}
          <label onClick={(e) => e.stopPropagation()} className="absolute bottom-[-10px] right-[-10px] bg-gray-800 border-[4px] border-gray-300 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700">
            <MdCameraAlt size={18} />
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </motion.figure>

        <h2 className="mt-4 text-2xl font-bold">{fullName}</h2>
        <p className="text-gray-500 font-medium">{showEmail ? email : maskEmail(email)}</p>

        <AnimatePresence>
          {isProfileOpen && (
            <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="relative w-[90%] max-w-[500px] max-h-[500px] bg-white p-4 rounded-full m-auto" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
                <button className="absolute top-1 right-2 text-red-500 hover:text-red-600" onClick={() => setIsProfileOpen(false)}>
                  <MdClose strokeWidth={2} size={24} />
                </button>
                <img src={previewImage || "default-placeholder.png"} alt="Profile" className="w-full h-full rounded-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 space-y-4 border-2 border-gray-300 p-3 md:p-5 rounded-lg bg-gray-50">
        {[
          {
            label: "Full Name",
            value: fullName,
            sample: "(e.g John Doe)",
            type: "text",
            name: "name",
            onChange: handleFullNameChange
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
            warning: "For security reasons, your email cannot be changed."
          },
          {
            label: "Phone Number",
            value: showPhone ? phone : maskPhone(phone),
            sample: "(e.g 08106244890)",
            name: "phone",
            type: "phone",
            toggle: setShowPhone,
            state: showPhone,
            onChange: handlePhoneChange
          }
        ].map((field, index) => (
          <div key={index}>
            <motion.div className="relative border-b border-gray-300 py-4 text-black md:py-8 group flex justify-between items-center">
              <section className="flex-1">
                <label className="text-gray-600 text-sm px-3 flex items-center gap-3">
                  <LuNotebookText size={18} /> {field.label} {field?.sample}
                </label>
                <motion.div className={`relative ${field.name === "email" ? "pl-5" : ""}`}>
                  <motion.input
                    type={field.type}
                    className={`w-full p-3 rounded-lg bg-transparent text-xl md:text-2xl font-bold focus:outline-none ${field.readOnly ? "cursor-not-allowed opacity-70" : isEditing ? "cursor-text" : "cursor-default"}`}
                    value={field.value}
                    onChange={(e) => field.onChange?.(e.target.value)}
                    readOnly={field.name === "email" ? true : !isEditing}
                  />
                  {field.name === "email" && <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />}
                </motion.div>
                {field.name === "email" && (
                  <p style={{ color: "rgb(202, 138, 4)" }} className="!text-yellow-600 text-sm mt-1 flex items-center gap-2">
                    <MdSecurity size={16} className="flex-shrink-0" /> {field.warning}
                  </p>
                )}
              </section>

              <AnimatePresence>
                {!isEditing && field.name !== "email" && (
                  <motion.button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity bg-olive text-white flex items-center gap-2 mx-3 rounded-lg px-3 py-2" whileHover={{ scale: 1.1 }} onClick={handleEdit}>
                    <MdEdit size={20} /> <span className="hidden md:block">Edit</span>
                  </motion.button>
                )}
              </AnimatePresence>
              {field.toggle && (
                <button className="mr-2 md:mr-4 text-gray-500 hover:text-gray-700 transition" onClick={() => field.toggle?.(!field.state)}>
                  {!field.state ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              )}
            </motion.div>
            {errors[field?.name] && <p className="text-red-500">{errors[field?.name]}</p>}
          </div>
        ))}

        {/* Address Field with Hoverable Edit */}
        <div>
          <motion.div className="relative border-b border-gray-300 py-4 md:py-8 group flex justify-between items-center">
            <section className="flex-1">
              <label className="text-gray-600 text-sm px-3 flex items-center gap-3">
                <LuNotebookText size={18} /> Address
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-transparent text-xl md:text-2xl font-bold focus:outline-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                readOnly={!isEditing}
              />
            </section>

            <AnimatePresence>
              {!isEditing && (
                <motion.button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white flex items-center gap-2 mx-3 rounded-lg px-3 py-2" whileHover={{ scale: 1.1 }} onClick={handleEdit}>
                  <MdEdit size={20} /> <span className="hidden md:block">Edit</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* 2FA Toggle */}
        <div className="relative group">
          <div className="flex items-center justify-between px-3 opacity-80">
            <label className="text-gray-600 text-sm flex items-center gap-3">
              <MdSecurity size={18} />Two-Factor Authentication (2FA)
            </label>
            <ToggleSwitch isChecked={enable2FA} onToggle={() => { }} />

          </div>

          {/* Tooltip */}
          <div className="font-bold text-[#ddc20f] bg-[#ceb51128] absolute -bottom-10 right-8 text-yellow-700 text-xs p-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 w-[200px]">
            2FA must always be enabled for your security.
          </div>
        </div>

        {/* Save / Cancel Buttons */}
        {isEditing && (
          <div className="flex items-center gap-2">
            <motion.button disabled={isLoading.profile} className="w-full bg-gray-400/70 text-gray-700 px-6 py-3 rounded-lg mt-4 hover:bg-gray-500 transition-all" onClick={() => setIsEditing(false)} whileHover={{ scale: 1.01 }}>
              Cancel
            </motion.button>
            <motion.button disabled={isLoading.profile} className="w-full bg-oliveLight text-white px-6 py-3 rounded-lg mt-4 flex items-center justify-center gap-3 hover:bg-oliveDark transition-all" onClick={handleSave} whileHover={{ scale: 1.01 }}>
              {isLoading.profile ? <FaSpinner className="mr-2 animate-spin" size={20} /> : <MdSave className="mr-2" size={20} />} Save
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
