import { FaUserGroup } from "react-icons/fa6";
import { motion } from "framer-motion";
import mainLogo from "../../assets/logo-icon.png";
import { useNavigate } from "react-router-dom";


const SecureGroup = ({ groups, isLoading, error }) => {
  const navigate=useNavigate()
  return (
    <div className="p-4 mt-4 flex flex-col space-y-4 justify-center">
      {/* Group Title */}
      <h2 className="text-lg font-semibold flex items-center space-x-2">
        <FaUserGroup size={20} className="text-green-400" />
        <span>Secure Group</span>
      </h2>

      {/* Handling Loading & Error States */}
      {isLoading && <p className="text-gray-500">Loading groups...</p>}
      {error && <p className="text-red-500">Error: {error?.message || "An Error Occured"}</p>}

      {/* Member List */}
      {!isLoading && !error && groups?.length > 0 ? (
        <div className="flex overflow-x-auto gap-3 md:gap-6">
          {groups.map((group, index) => (
            <motion.div
            onClick={()=>navigate('/dashboard/groups', {state:{group:group}})}
              key={group?.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <figure className="w-12 h-12 bg-white rounded-full overflow-hidden">
                <img
                  src={group?.image || mainLogo}
                  alt="G"
                  className="w-full h-full object-cover"
                />
              </figure>
              <p className="text-xs text-center mt-1">{group?.group_name.split(" ")[0]}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        !isLoading && !error && <p className="text-gray-500">No groups found.</p>
      )}
    </div>
  );
};

export default SecureGroup;
