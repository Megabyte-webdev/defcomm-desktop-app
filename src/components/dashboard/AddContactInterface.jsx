import React, { useContext, useState } from "react";
import { FaCheck, FaSpinner } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";

import GroupSlide from "../GroupSlide";
import useGroups from "../../hooks/useGroup";
import useChat from "../../hooks/useChat";
import { ChatContext } from "../../context/ChatContext";

const AddContactInterface = () => {
  const { useFetchGroups, useFetchGroupMembers, addContactMutation } =
    useGroups();
  const { setModalTitle } = useContext(ChatContext);
  setModalTitle("Add Contacts");
  const { fetchContacts } = useChat();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    staleTime: 0,
  });

  const { data: groups, isLoading: groupLoading } = useFetchGroups();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});

  const { data: groupMembers, isLoading: isGroupMembersLoading } =
    useFetchGroupMembers(selectedGroup?.group_id);

  const handleAddContact = async (member) => {
    setLoadingStates((prev) => ({ ...prev, [member?.id]: "adding" }));
    try {
      await addContactMutation.mutateAsync(member?.member_id_encrpt);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [member?.id]: null }));
    }
  };

  return (
    <div className="p-5 w-[80vw] md:w-[600px] min-h-32 py-14 bg-oliveDark text-white">
      {groupLoading ? (
        <div className="flex justify-center">
          <FaSpinner className="animate-spin text-white text-2xl" />
        </div>
      ) : groups?.length > 0 ? (
        <div className="sticky top-0 z-10 bg-oliveDark">
          <GroupSlide
            groups={groups}
            setSelectedGroup={setSelectedGroup}
            forceSingleView={true}
          />
        </div>
      ) : (
        <div>No groups available</div>
      )}

      {selectedGroup && (
        <div className="mt-3">
          {isGroupMembersLoading || isLoading ? (
            <div className="flex justify-center">
              <FaSpinner className="animate-spin text-white text-2xl" />
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold">
                <strong>{selectedGroup?.group_name} -</strong> Members:
              </h3>
              <ul className="mt-2 space-y-2">
                {groupMembers?.map((member) => {
                  if (!member?.member_name) return null;

                  const isAlreadyAdded = contacts?.some(
                    (c) => c.contact_id === member?.member_id
                  );
                  const isLoadingMember =
                    loadingStates[member?.id] === "adding";

                  const handleClick = () => {
                    if (!isAlreadyAdded && !isLoadingMember) {
                      handleAddContact(member);
                    }
                  };

                  return (
                    <li
                      key={member?.id}
                      onClick={handleClick}
                      className={`bg-gray-700 p-3 rounded-md flex items-center justify-between gap-2 ${
                        isAlreadyAdded || isLoadingMember
                          ? "opacity-60 cursor-not-allowed"
                          : "cursor-pointer hover:bg-gray-600"
                      }`}
                    >
                      {member?.member_name || "Anonymous"}
                      {isAlreadyAdded ? (
                        <FaCheck className="text-green-400" />
                      ) : isLoadingMember ? (
                        <FaSpinner className="animate-spin text-white" />
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AddContactInterface;
