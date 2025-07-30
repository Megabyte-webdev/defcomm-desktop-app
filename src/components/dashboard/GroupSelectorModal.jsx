import React, {useEffect} from "react";
import Modal from "../modal/Modal";
import GroupSlide from "../GroupSlide";
import { FaSpinner } from "react-icons/fa6";
import useGroups from "../../hooks/useGroup";

const GroupSelectorModal = ({ isOpen, onSelectGroup, onClose, selectedGroup }) => {
  const { useFetchGroups } = useGroups();
  const { data: groups, isLoading } = useFetchGroups();

  return (
    <Modal isOpen={isOpen} closeModal={onClose}>
      <div className="p-5 w-[80vw] md:w-[600px] bg-oliveDark text-white min-h-40 max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Select a Group</h2>
        {isLoading ? (
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-white text-2xl" />
          </div>
        ) : groups?.length > 0 ? (
          <GroupSlide
            groups={groups}
            setSelectedGroup={(group) => {
              onSelectGroup(group);
              onClose();
            }}
            selectedGroup={selectedGroup}
            forceSingleView={true}
          />
        ) : (
          <p>No groups available</p>
        )}
      </div>
    </Modal>
  );
};

export default GroupSelectorModal;
