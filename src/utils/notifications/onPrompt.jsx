import { toast } from "react-toastify";
import { IoInformationCircle } from "react-icons/io5";

export const onPrompt = ({ title, message }) => {
  const promptComponent = (
    <div className="flex items-center gap-[10px] z-[99999999] text-gray-500">
      <IoInformationCircle className="text-[25px] " />
      <div className="flex flex-col">
        <strong className="text-sm">{title || "Prompt"}</strong>
        <p className="text-[12px] ">{message}</p>
      </div>
    </div>
  );

  toast(promptComponent);
};
