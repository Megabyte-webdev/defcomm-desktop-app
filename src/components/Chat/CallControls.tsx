import { PiSpeakerHighFill, PiSpeakerSlashFill } from "react-icons/pi";
import { AiOutlineAudioMuted, AiOutlineAudio } from "react-icons/ai";
import { MdPersonAddAlt, MdPhoneInTalk } from "react-icons/md";

interface CallControlsProps {
  isMuted: boolean;
  isSpeakerOn: boolean;
  toggleMute: () => void;
  toggleSpeaker: () => void;
}

function CallControls({
  isMuted,
  isSpeakerOn,
  toggleMute,
  toggleSpeaker,
}: CallControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4 text-white py-5">
      <div className="bg-green-600 hover:bg-green-600/60 cursor-pointer px-4 py-2 flex flex-col items-center justify-center gap-2 text-center">
        <MdPhoneInTalk className="text-xl" />
        <p className="text-sm">Receiver</p>
      </div>

      <div
        onClick={toggleSpeaker}
        className={`${
          isSpeakerOn ? "bg-[#1a2b12]" : "bg-gray-400"
        } cursor-pointer px-4 py-2 flex flex-col items-center justify-center gap-2 text-center`}
      >
        {isSpeakerOn ? (
          <PiSpeakerHighFill className="text-xl" />
        ) : (
          <PiSpeakerSlashFill className="text-xl" />
        )}
        <p className="text-sm">{isSpeakerOn ? "Speaker On" : "Speaker Off"}</p>
      </div>

      <div
        onClick={toggleMute}
        className={`${
          isMuted ? "bg-red-500" : "bg-[#4b8032]"
        } cursor-pointer px-4 py-2 flex flex-col items-center justify-center gap-2 text-center`}
      >
        {isMuted ? (
          <AiOutlineAudio className="text-xl" />
        ) : (
          <AiOutlineAudioMuted className="text-xl" />
        )}
        <p className="text-sm">{isMuted ? "Unmute" : "Mute"}</p>
      </div>

      <div className="bg-[#1a2b12] cursor-pointer px-4 py-2 flex flex-col items-center justify-center gap-2 text-center">
        <MdPersonAddAlt className="text-xl" />
        <p className="text-sm">New Call</p>
      </div>
    </div>
  );
}

export default CallControls;
