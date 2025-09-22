import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Modal from "../modal/Modal";
import { ChatContext } from "../../context/ChatContext";

const GroupChatDetails = ({ groupInfo, showGroupInfo, setShowGroupInfo }) => {
  const { authDetails } = useContext(AuthContext);
  const { setModalTitle } = useContext(ChatContext);
  const userId = authDetails?.user?.id;
  useEffect(() => {
    setModalTitle(groupInfo?.group_meta[0]?.name);
  }, [showGroupInfo]);
  return (
    <AnimatePresence>
      {showGroupInfo && (
        <Modal
          isOpen={showGroupInfo}
          closeModal={() => setShowGroupInfo(false)}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-3xl p-8 w-[90vw] md:w-[500px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-600 mb-6">
              {groupInfo?.group_meta[0]?.decription}
            </p>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800">Members</h3>
              {groupInfo?.data?.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full capitalize bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                    {member?.member_name?.charAt(0)}
                  </div>
                  <p className="text-gray-800 font-medium">
                    {member.member_name}
                    {member.member_id === userId && (
                      <span className="text-xs text-gray-500 ml-2">(You)</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default GroupChatDetails;
