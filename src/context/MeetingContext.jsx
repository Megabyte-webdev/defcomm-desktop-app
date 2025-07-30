import React, { createContext, useState, useContext } from "react";
import { MeetingProvider as SDKMeetingProvide } from "@videosdk.live/react-sdk";
import { AuthContext } from "./AuthContext";
import { ChatContext } from "./ChatContext";
import { getAuthToken } from "../components/video-sdk/Api";

export const MeetingContext = createContext();

export const MeetingProvider = ({ children }) => {
  const { authDetails } = useContext(AuthContext);

  const [conference, setConference] = useState(null);
  const [me, setMe] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [providerMeetingId, setProviderMeetingId] = useState(null);
  const [showConference, setShowConference] = useState(false);
  return (
    <MeetingContext.Provider
      value={{
        conference,
        setConference,
        me,
        setMe,
        isScreenSharing,
        setIsScreenSharing,
        providerMeetingId,
        setProviderMeetingId,
        showConference,
        setShowConference,
      }}
    >
      <SDKMeetingProvide
        config={{
          meetingId: providerMeetingId,
          name: authDetails?.user?.name || "You",
          participantId: authDetails?.user?.id,
          micEnabled: true,
          webcamEnabled: false,
          mode: "SEND_AND_RECV",
          chatEnabled: true,
          raiseHandEnabled: true,
          debugMode: true,
        }}
        token={getAuthToken()}
      >
        {children}
      </SDKMeetingProvide>
    </MeetingContext.Provider>
  );
};
