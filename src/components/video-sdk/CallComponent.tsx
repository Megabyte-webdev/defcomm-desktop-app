import React, { useState, useContext, useEffect } from "react";
import { createMeeting, getAuthToken } from "./Api";
import {
  MeetingProvider
} from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import CallComponentContent from './CallComponentContent'

const CallComponent = ({ initialMeetingId, setInitialMeetingId }: { initialMeetingId?: string, setInitialMeetingId: (id: string | null) => void }) => {
  const [meetingId, setMeetingId] = useState<string | null>(initialMeetingId || null);
  const [providerMeetingId, setProviderMeetingId] = useState<string | null>(null);
  const { authDetails } = useContext(AuthContext);
  const { callType } = useContext(ChatContext);
  useEffect(() => {
    if (meetingId && !providerMeetingId) { // Only set once 
      setInitialMeetingId(null)
      setProviderMeetingId(meetingId);
    }
  }, [meetingId]);
  return (
    <MeetingProvider
      config={{
        meetingId: providerMeetingId, // Use updated meetingId
        name: authDetails?.user?.name || "You",
        participantId: authDetails?.user?.id,
        micEnabled: true,
        webcamEnabled: callType == "video" ? true : false,
        mode: "CONFERENCE",
      }}
      token={getAuthToken()}
    >
      <CallComponentContent meetingId={meetingId} setMeetingId={setMeetingId} />
    </MeetingProvider>
  );

};


export default CallComponent;
