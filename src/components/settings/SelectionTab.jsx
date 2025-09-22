import { motion } from "framer-motion";

const tabLabels = {
  active: "Active",
  all: "All",
  block: "Blocked",
  remove: "Removed",
};

const SelectionTab = ({ setFilter, filter }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {Object.keys(tabLabels).map((tab) => (
        <motion.button
          key={tab}
          onClick={() => setFilter(tab)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none ${
            filter === tab
              ? "bg-[#16a34a] text-white shadow-lg"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {tabLabels[tab]}
        </motion.button>
      ))}
    </div>
  );
};

export default SelectionTab;
