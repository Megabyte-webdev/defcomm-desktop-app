import {
  createMicrophoneAudioTrack,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef, useState, useContext } from "react";
import ReactPlayer from "react-player";
import mainLogoTwo from "../../assets/logo-icon.png";
import { FaVideo, FaVideoSlash, FaExpand, FaCompress } from "react-icons/fa"; // Added maximize icons
import { MdCallEnd } from "react-icons/md";
import CallInfo from "../Chat/CallInfo";
import CallControls from "../Chat/CallControls";
import Receiver from "./Receiver";
import {
  AiOutlineAudioMuted,
  AiOutlineAudio,
} from "react-icons/ai";
import { ChatContext } from "../../context/ChatContext";

const ParticipantMedia = ({ participantId, auth, callDuration, handleLeave, isInitiator, participant, isRinging }) => {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal } = useParticipant(participantId);
  const { localMicOn, toggleMic, toggleWebcam } = useMeeting();
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false); // State for maximizing video
  const { callType } = useContext(ChatContext);
  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return null;
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current.muted = isLocal;
        micRef.current.play().catch((error) => console.error("Audio play error:", error));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn, isLocal]);

  // Custom mic toggle function
  const handleToggleMic = async () => {
    toggleMic();
  };
  const handleToggleCam = async () => {
    toggleWebcam();
  };

  // Toggle maximize video
  const toggleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };

  return (
    <div className="w-[90vw] flex flex-col md:flex-row justify-center gap-2 h-[80vh]">

      {/* Call Controls */}
      <div className="hidden w-96 md:flex flex-col items-center bg-white rounded-lg py-10">
        {isRinging && <p className="text-green-500 text-lg font-semibold"> Ringing...</p>}
        <CallInfo participant={participant?.displayName || "Unknown"} callDuration={callDuration} isInitiator={isInitiator} />
        <CallControls isMuted={!micOn} toggleMute={handleToggleMic} isSpeakerOn={isSpeakerEnabled} />
        <button
          onClick={handleLeave}
          className="bg-red-500 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2"
        >
          <MdCallEnd /> End Call
        </button>
      </div>

      {/* Video Section */}
      <section className="flex-1 w-full md:w-2/3 h-[80vh] md:min-h-full relative bg-black/80 rounded-[10px] flex justify-center items-center overflow-hidden">

        {/* Receiver Video */}
        <div className={`absolute bottom-0 right-0 z-[100] transition-all duration-300 ${isMaximized ? "w-full h-full" : "w-40 h-40"}`}>
          <Receiver participant={participant} />
          {/* Maximize Button */}
          <button
            onClick={toggleMaximize}
            className="absolute top-1 right-1 bg-gray-700 text-white p-1 rounded-md hover:bg-gray-900 transition"
          >
            {isMaximized ? <FaCompress size={14} /> : <FaExpand size={14} />}
          </button>
        </div>

        {/* Main Video */}
        <figure className={`flex items-center justify-center transition-all duration-300 ${isMaximized ? "w-40 h-40 absolute bottom-0 right-0" : "w-full h-full absolute"}`}>
          <audio ref={micRef} autoPlay playsInline />
          {callType == "video" && webcamOn ? (
            <ReactPlayer
              playsinline
              pip={false}
              light={false}
              controls={false}
              muted={!isSpeakerEnabled}
              playing
              url={videoStream}
              height="100%"
              width="100%"
              className="rounded-md"
            />
          ) : (
            <img className="rounded-md" src={mainLogoTwo} alt="User Avatar" />
          )}
          {/* Toggle Camera Button */}
          {callType == "video" && <div
            onClick={handleToggleCam}
            className={`hidden absolute cursor-pointer hover:scale-105 duration-100 md:flex items-center justify-center left-2 bottom-2 ${webcamOn ? "bg-green" : "bg-red-700"
              } rounded-full h-[24px] w-[24px]`}
          >
            {webcamOn ? <FaVideo size={16} /> : <FaVideoSlash size={16} />}
          </div>}
        </figure>
      </section>
      {/* Mobile Controls */}
      <div className="fixed bottom-0 w-screen left-0 flex md:hidden mx-auto md:mx-0 justify-around items-center bg-black/70 py-3 px-5 z-[1000]">
        {/* Toggle Mic Button */}
        <button
          onClick={handleToggleMic}
          className={`flex flex-col items-center justify-center gap-1 p-3 rounded-full 
      ${micOn ? "bg-green-600 text-white" : "bg-red-600 text-white"} shadow-lg transition-transform active:scale-95`}
        >
          {micOn ? <AiOutlineAudio className="text-2xl" /> : <AiOutlineAudioMuted className="text-2xl" />}

        </button>

        {/* End Call Button */}
        <button
          onClick={handleLeave}
          className="bg-red-500 text-white p-4 rounded-full shadow-lg transition-transform scale-[1.2] active:scale-95 flex items-center justify-center gap-2"
        >
          <MdCallEnd className="text-2xl" />
        </button>

        {/* Toggle Camera Button */}
        <button
          onClick={toggleWebcam}
          className={`flex flex-col items-center justify-center gap-1 p-3 rounded-full 
          ${webcamOn ? "bg-green-600 text-white" : "bg-red-600 text-white"} shadow-lg transition-transform active:scale-95`}
        >
          {webcamOn ? <FaVideo className="text-2xl" /> : <FaVideoSlash className="text-2xl" />}

        </button>
      </div>

    </div>
  );
};

export default ParticipantMedia;
