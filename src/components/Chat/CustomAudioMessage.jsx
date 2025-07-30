import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import {useState, useRef} from 'react'
const CustomAudioMessage = ({ audioSrc="" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center space-x-2 bg-transparent p-2 rounded-lg shadow-md w-56">
      <button onClick={togglePlay}>
        {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
      </button>
      <div className="flex-1 h-2 rounded-full">
        <div className="h-2 bg-gray-300 rounded-full w-1/2"></div>
      </div>
      <span className="text-xs">0:08</span>
      <audio ref={audioRef} src={audioSrc} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};
export default CustomAudioMessage