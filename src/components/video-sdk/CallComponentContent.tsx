import React, { useState, useContext, useEffect, useRef } from "react";
import logo from "../../assets/logo.png";
import CallSummary from "../Chat/CallSummary";

import { sendMessageUtil } from "../../utils/chat/sendMessageUtil";
import { onFailure } from "../../utils/notifications/OnFailure";
import { onSuccess } from "../../utils/notifications/OnSuccess";
import { createMeeting } from "./Api";
import { FaSpinner } from "react-icons/fa";
import { useMeeting } from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useSendMessageMutation } from "../../hooks/useSendMessageMutation";
import { axiosClient } from "../../services/axios-client";
import ParticipantMedia from "./ParticipantMedia";
import audioController from "../../utils/audioController";
const CallComponentContent = ({ meetingId, setMeetingId }: any) => {
    const [isMeetingActive, setIsMeetingActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
    const [isRinging, setIsRinging] = useState(true);
    const [callDuration, setCallDuration] = useState(0);
    const [isInitiator, setIsInitiator] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [other, setOther] = useState(null);
    const [me, setMe] = useState(null);
    const { authDetails } = useContext(AuthContext);
    const { selectedChatUser } = useContext(ChatContext);
    const messageData = selectedChatUser?.chat_meta;
    const client = axiosClient(authDetails?.access_token);
    const sendMessageMutation = useSendMessageMutation(client);

    const callTimer = useRef<NodeJS.Timeout | null>(null);

    const { join, participants, localMicOn, toggleMic, leave } = useMeeting({
        onMeetingJoined: () => {
            setIsLoading(false);
            setIsMeetingActive(true);
            setShowSummary(false);
            onSuccess({ message: "Call Started", success: "You have successfully joined the call" });

            if (!localMicOn) toggleMic();
        },
        onMeetingLeft: () => {
            setIsMeetingActive(false);
            setShowSummary(true);
            if (callTimer.current) {
                clearInterval(callTimer.current);
                callTimer.current = null;
            }
        },
        onParticipantJoined: (participant) => {
            setIsRinging(false);
            if (!callTimer.current) {
                callTimer.current = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
            }
        },
        onParticipantLeft: () => {
            const participantCount = participants ? [...participants.values()].length : 0;
            console.log("Participant Left, Current Count:", participantCount);
            if (participantCount <= 1) {
                handleLeave();
            }
        },
        onError: (error) => {
            onFailure({ message: "Technical Error", error: error?.message || "An error occurred" });
        },
    });

    const getMe = () => {
        const speakerParticipants = [...participants.values()].find(
            (current) => Number(current.id) === Number(authDetails?.user?.id)
        );
        setMe(speakerParticipants);
    };

    const getOther = () => {
        const speakerParticipants = [...participants.values()].find(
            (current) => Number(current.id) !== Number(authDetails?.user?.id)
        );

        setOther(speakerParticipants)
    };

    const handleLeave = async () => {
        if (callTimer.current) {
            clearInterval(callTimer.current);
            callTimer.current = null;
        }
        leave();
        setIsMeetingActive(false);
        setMeetingId(null);
        audioController.stopRingtone();
        setShowSummary(true);
    };

    useEffect(() => {

        if (participants && isMeetingActive) {
            getMe();
            getOther();
            const participantCount = participants ? [...participants.values()].length : 0;

            if (participantCount > 1) {
                audioController.stopRingtone();
            }
        }

    }, [participants, isMeetingActive]);



    // Create Meeting
    const handleCreateMeeting = async () => {
        setIsCreatingMeeting(true);
        try {
            const newMeetingId = await createMeeting();
            if (!newMeetingId) throw new Error("No meeting ID returned.");
            setMeetingId(newMeetingId);
            setIsInitiator(true);
        } catch (error) {
            onFailure({ message: "Meeting Creation Failed", error: error.message });
        } finally {
            setIsCreatingMeeting(false);
        }
    };

    // Start Call (for initiator)
    const handleStartCall = async () => {
        if (!meetingId) {
            onFailure({ message: "Meeting ID Error", error: "Meeting ID is missing." });
            return;
        }

        setIsLoading(true);
        try {
            await sendMessageUtil({
                client,
                message: `CALL_INVITE:${meetingId}`,
                file: null,
                chat_user_type: messageData.chat_user_type,
                chat_user_id: messageData.chat_user_id,
                chat_id: messageData.chat_id,
                sendMessageMutation,
            });

            await join();

        } catch (error: any) {
            setIsLoading(false);
            onFailure({
                message: "Meeting Join Failed",
                error: error.message || "Something went wrong while joining the meeting.",
            });
        }
    };

    // Join Meeting (for invited participant)
    const handleJoinMeeting = () => {
        if (!meetingId) {
            onFailure({ message: "Meeting ID Error", error: "Meeting ID is missing." });
            return;
        }
        setIsLoading(true);
        join();
    };

    useEffect(() => {
        const participantCount = [...participants.values()].length;
        console.log("Participants Count:", participantCount);
        setIsRinging(participantCount < 2);
    }, [participants]);

    useEffect(() => {
        if (isMeetingActive && !localMicOn) {
            toggleMic();
        }
    }, [isMeetingActive, localMicOn]);

    return (
        <div className="flex flex-col items-center bg-olive p-5">

            {!isMeetingActive ? (
                <div className="py-10 w-80 md:w-96 rounded-lg flex flex-col items-center">
                    {showSummary && (
                        <CallSummary callSummary={{
                            duration: callDuration,
                            caller: isInitiator ? "You" : selectedChatUser?.contact_name,
                            receiver: !isInitiator ? "You" : selectedChatUser?.contact_name || "Unknown"
                        }} />
                    )}
                    {!meetingId ? (
                        <button onClick={handleCreateMeeting} className="bg-oliveLight hover:oliveDark text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                            Initiate Call {isCreatingMeeting && <FaSpinner className="animate-spin" />}
                        </button>
                    ) : isInitiator ? (
                        <button onClick={handleStartCall} className="bg-green-600 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                            Start Call {isLoading && <FaSpinner className="animate-spin" />}
                        </button>
                    ) : (
                        <button onClick={handleJoinMeeting} className="bg-green-600 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2">
                            Join Call {isLoading && <FaSpinner className="animate-spin" />}
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-2 items-center">

                        {me && <ParticipantMedia participantId={me?.id} auth={authDetails} isRinging={isRinging} callDuration={callDuration} handleLeave={handleLeave} participant={other} isInitiator={isInitiator} />}


                    </div>

                </>
            )}

            <img src={logo} alt="Defcomm Icon" className="w-40 mt-8 filter invert" />
        </div>
    );
};

export default CallComponentContent;
