import React from "react";
import { motion } from "framer-motion";
import { COLORS } from "../../utils/chat/messageUtils";

type ToggleSwitchProps = {
  isChecked: boolean;
  onToggle?: (isChecked?: boolean) => void;
  /** Visible label prop (optional) */
  infoLabel?: string;
};

export default function ToggleSwitch({
  isChecked,
  onToggle = () => {},
  infoLabel,
}: ToggleSwitchProps) {
  const aria = infoLabel ?? "toggle";

  return (
    <label
      className="relative inline-flex items-center cursor-pointer"
      aria-label={aria}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isChecked}
        onChange={(e) => onToggle(e.target.checked)}
        aria-checked={isChecked}
        aria-label={aria}
      />
      <div
        className="w-10 h-5 rounded-full relative transition-all"
        style={{ backgroundColor: isChecked ? COLORS.brass : COLORS.muted }}
      >
        <motion.span
          className="absolute top-0 bottom-0 left-[2px] my-auto w-4 h-4 bg-white rounded-full shadow"
          layout
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          animate={{ x: isChecked ? 20 : 0 }}
        />
      </div>
    </label>
  );
}
