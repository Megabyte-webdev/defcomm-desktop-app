import React from "react";

interface ToggleSwitchProps {
  isChecked: boolean;
  onToggle: () => void;
  activeBg?: string;
  inactiveBg?: string;
  knobColor?: string;
}

function ToggleSwitch({
  isChecked,
  onToggle,
  activeBg = "bg-oliveGreen",
  inactiveBg = "bg-gray-300",
  knobColor = "bg-white",
}: ToggleSwitchProps) {
  return (
    <label className="relative flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={onToggle}
      />
      <div
        className={`relative w-10 h-6 rounded-full transition-all duration-200 ${isChecked ? activeBg : inactiveBg}`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow-md transition-transform duration-200 ${
            isChecked ? "translate-x-4" : "translate-x-0"
          } ${knobColor}`}
        ></div>
      </div>
    </label>
  );
}

export default ToggleSwitch;
