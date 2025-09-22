import { useRef } from "react";
import radioSound from "../../assets/audio/radio.mp3"; // background hiss
export const useRadioHiss = (volume = 0.15) => {
  const radioBgRef = useRef(null);

  const startRadioHiss = () => {
    if (!radioBgRef.current) {
      const hiss = new Audio(radioSound);
      hiss.loop = true;
      hiss.volume = volume; // subtle background
      radioBgRef.current = hiss;
    }
    radioBgRef.current.play().catch(() => {});
  };

  const stopRadioHiss = () => {
    if (radioBgRef.current) {
      radioBgRef.current.pause();
      radioBgRef.current.currentTime = 0;
    }
  };

  return { startRadioHiss, stopRadioHiss };
};
