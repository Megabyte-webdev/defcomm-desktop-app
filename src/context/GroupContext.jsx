import { createContext, useState } from "react";

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [activeGroup, setActiveGroup] = useState(null);
  const [groupUserTyping, setGroupUserTyping] = useState();
  const [groupConnections, setGroupConnections] = useState({});
  // e.g. { groupId: "connected" | "error" }

  return (
    <GroupContext.Provider
      value={{
        activeGroup,
        setActiveGroup,
        groupUserTyping,
        setGroupUserTyping,
        groupConnections,
        setGroupConnections,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
