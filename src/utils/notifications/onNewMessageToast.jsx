import { toast } from "react-toastify";
import { FaCommentDots, FaPhoneAlt } from "react-icons/fa";

export const onNewNotificationToast = ({
  senderName,
  message,
  type = "message", // "message" | "call"
  onClick = () => {},
}) => {
  const isCall = type === "call";

  const toastComponent = (
    <div className="flex items-start gap-3 cursor-pointer">
      {isCall ? (
        <FaPhoneAlt className="text-2xl text-green-500 mt-1" />
      ) : (
        <FaCommentDots className="text-2xl text-oliveDark mt-1" />
      )}

      <div>
        <p className="font-semibold text-sm text-oliveDark">
          {isCall ? `Incoming call from ${senderName}` : `New message from ${senderName}`}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
          {isCall
            ? "Tap to respond to the call"
            : message || "You received a new message"}
        </p>
      </div>
    </div>
  );

  toast(toastComponent, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    onClick,
  });
};
