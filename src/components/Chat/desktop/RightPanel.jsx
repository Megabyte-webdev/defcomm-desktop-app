import { useContext } from "react";
import { BiChat } from "react-icons/bi";
import { ChatContext } from "../../../context/ChatContext";
import { FaChevronRight, FaFilePdf } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";

export default function RightPanel() {
  const { selectedChatUser, messages } = useContext(ChatContext);

  const files = messages?.data?.filter((msg) => msg?.is_file === "yes");
  const calls = messages?.data?.filter((msg) => msg?.mss_type === "call");

  const media = [...(calls || []), ...(files || [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Helper to get call color based on type
  const getCallIconColor = (state) => {
    switch (state) {
      case "miss":
        return "text-red-500";
      case "pick":
      case "rec":
        return "text-green-500";
      case "out":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="w-72 p-4 space-y-6 overflow-y-auto">
      {/* Media Section */}
      <div>
        <div className="flex justify-between gap-2 items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
            <div className="p-3 bg-black rounded-2xl">
              <BiChat size={24} />
            </div>
            Media <span className="text-sm">{media?.length}</span>
          </h3>
          <button className="underline text-sm">View All</button>
        </div>

        {selectedChatUser && media.length > 0 ? (
          <div className="flex space-x-2 mt-2 overflow-x-auto">
            {media.slice(0, 3).map((item, i) => {
              const isFile = item?.is_file === "yes";
              return (
                <div
                  key={item.id || i}
                  className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center"
                >
                  {isFile ? (
                    <FaFilePdf className="text-oliveLight" size={24} />
                  ) : (
                    <FiPhone className="text-oliveLight" size={24} />
                  )}
                </div>
              );
            })}
            {media.length > 3 && (
              <div className="w-16 h-16 bg-gray-500 rounded-lg flex items-center justify-center text-sm text-white font-bold">
                {media.length - 3}+
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-center font-medium min-h-20 text-gray-300 flex items-center justify-center">
            Nothing for now
          </p>
        )}
      </div>

      {/* Calls Section */}
      <div>
        <div className="flex justify-between gap-2 items-center">
          <h3 className="text-lg font-semibold mb-4">
            Calls{" "}
            <span className="text-sm text-gray-200 ml-1">{calls?.length}</span>
          </h3>
          <button className="underline text-sm">View All</button>
        </div>

        <div className="min-h-32 bg-white rounded-lg">
          <section className="flex flex-col p-3 gap-2 max-h-40 overflow-y-auto">
            {selectedChatUser ? (
              calls?.length > 0 ? (
                calls.map((call, i) => {
                  const isOutgoing = call.is_my_chat === "yes";
                  const name = call.user_to_name || "Unknown";
                  const directionText = isOutgoing
                    ? `You called ${name}`
                    : `${name} called you`;

                  let callStatus = "";
                  switch (call.call_state) {
                    case "miss":
                      callStatus = "Missed Call";
                      break;
                    case "pick":
                      callStatus = "Call Ended";
                      break;
                    case "rec":
                      callStatus = "Received Call";
                      break;
                    case "out":
                      callStatus = "Outgoing Call";
                      break;
                    default:
                      callStatus = "Call";
                  }

                  return (
                    <div
                      key={call.id}
                      className="flex items-center gap-3 bg-gray-100 rounded-lg p-2"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 ${getCallIconColor(
                          call.call_state
                        )}`}
                      >
                        <FiPhone size={18} />
                      </div>
                      <div className="flex flex-col text-xs">
                        <p className="font-bold text-black capitalize">
                          {directionText}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(call.created_at).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-gray-500">{callStatus}</p>
                        {call.call_state === "pick" && call.call_duration && (
                          <p className="text-xs text-gray-400">
                            Duration: {call.call_duration}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-center font-medium min-h-20 text-gray-300 flex items-center justify-center">
                  No Calls
                </p>
              )
            ) : (
              <p className="text-sm text-center font-medium text-gray-700 flex items-center justify-center">
                Nothing for now
              </p>
            )}
          </section>
          {calls?.length > 0 && (
            <button className="w-full text-black font-bold text-xs mt-1 flex justify-between gap-2 p-3 hover:bg-gray-200 rounded-lg">
              View Calls <FaChevronRight />
            </button>
          )}
        </div>
      </div>

      {/* Files Section */}
      <div>
        <div className="flex justify-between gap-2 items-center">
          <h3 className="text-lg font-semibold mb-4">
            Files{" "}
            <span className="text-sm text-gray-200 ml-1">{files?.length}</span>
          </h3>
          <button className="underline text-sm">View All</button>
        </div>

        <section className="flex-1 flex flex-col gap-2 max-h-40 overflow-y-auto">
          {selectedChatUser ? (
            files?.length > 0 ? (
              files.map((file, i) => (
                <a
                  href={`${import.meta.env.BASE_URL}secure/${file?.message}`}
                  target="_blank"
                  key={file?.id}
                  className="bg-gray-900/60 flex gap-4 items-center text-sm p-2 rounded mb-1"
                >
                  <p className="p-2 bg-white text-black rounded-lg">
                    <FaFilePdf size={24} />
                  </p>
                  <div>
                    <p className="font-medium">{file?.message}</p>
                    <div className="text-xs text-gray-300 mt-2 flex gap-2 flex-wrap">
                      <span>
                        {new Date(file?.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-sm text-center font-medium min-h-20 text-gray-300 flex items-center justify-center">
                No File
              </p>
            )
          ) : (
            <p className="text-sm text-center font-medium min-h-20 text-gray-300 flex items-center justify-center">
              Nothing for now
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
