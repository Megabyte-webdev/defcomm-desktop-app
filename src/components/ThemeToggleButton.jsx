import React, { useContext } from "react";
import { BiMoon, BiSun, BiLaptop } from "react-icons/bi";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const getIcon = () => {
    if (theme === "light") return <BiMoon />;
    if (theme === "dark") return <BiSun />;
    return <BiLaptop />;
  };

  const getLabel = () => {
    if (theme === "light") return "Dark Mode";
    if (theme === "dark") return "Light Mode";
    return "System Mode";
  };

  return (
    <button
      onClick={toggleTheme}
      className="bg-oliveGreen text-black rounded-lg flex items-center gap-2 px-3 py-2 border border-olive transition-all hover:scale-105"
    >
      {getIcon()}
      <span className="hidden md:block">{getLabel()}</span>
    </button>
  );
};

export default ThemeToggleButton;
