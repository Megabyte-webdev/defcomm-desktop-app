import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef, useContext } from "react";
import ReactPlayer from "react-player";
import mainLogoTwo from "../../assets/logo-icon.png";
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { ChatContext } from "../../context/ChatContext";

const Receiver = ({ participant }) => {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn } = useParticipant(participant?.id);
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
        micRef.current.muted = false; // Unmute to allow hearing the sender
        micRef.current.play().catch((error) => console.error("Audio play error:", error));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <figure className="w-full h-full relative bg-black/80 rounded-[10px] flex justify-center items-center">
      <audio ref={micRef} autoPlay playsInline />
      {callType == "video" && webcamOn ? (
        <ReactPlayer
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted
          playing
          url={videoStream}
          height="100%"
          width="100%"
          className="rounded-md"
        />
      ) : (
        <img className="rounded-md" src={mainLogoTwo} alt="User Avatar" />
      )}
      <div className={`absolute cursor-pointer hover:scale-105 duration-100 flex items-center justify-center left-2 bottom-2 ${
          micOn ? "bg-green" : "bg-red-700"
        } rounded-full h-[20px] w-[20px]`}
      >
        {micOn ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />}
      </div>
      {callType == "video" && <div className={`absolute cursor-pointer hover:scale-105 duration-100 flex items-center justify-center right-2 bottom-2 ${
          webcamOn ? "bg-green" : "bg-red-700"
        } rounded-full h-[20px] w-[20px]`}
      >
        {webcamOn ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
      </div>}
    </figure>
  );
};

export default Receiver;
