import { BiSolidCategory } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import useChat from "../../hooks/useChat";
import { categories } from "../../utils/constants";

function Categories() {
  const navigate = useNavigate();
  const { getCallLogs } = useChat();
  const { data: callLogs } = getCallLogs;

  const missedCallsCount =
    callLogs?.filter((call) => call.call_state === "miss").length || 0;

  // Placeholder counts for other categories (replace with actual data logic)
  const messagesCount = 12; // e.g., from useMessages()
  const signalCommsCount = 5; // e.g., from useSignalComms()
  const fileSharingCount = 3; // e.g., from useSharedFiles()

  // Map counts by key
  const counts = {
    missedCalls: missedCallsCount,
    messages: messagesCount,
    signalComms: signalCommsCount,
    fileSharing: fileSharingCount,
  };

  return (
    <div className="p-4 rounded-lg mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <BiSolidCategory size={20} className="text-green-400" />
          <h1 className="text-lg font-semibold">Categories</h1>
        </div>
        <span className="text-gray-400 cursor-pointer ml-auto underline text-sm">
          Show All
        </span>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
        {categories.map((cat, index) => (
          <div
            key={cat?.key || index}
            onClick={() => navigate(`/dashboard/${cat?.ref}`)}
            className={`${
              index > 0 ? "bg-[#1a2b12]" : "bg-green-600"
            } hover:bg-green-600/60 cursor-pointer px-4 py-2 flex flex-col items-center justify-center gap-2 text-center`}
          >
            <span className="text-white text-xl rounded-full">
              {<cat.icon />}
            </span>
            <div>
              <p className="text-sm">{cat.title}</p>
              <h3 className="text-sm font-semibold">{counts[cat.key] || 0}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
