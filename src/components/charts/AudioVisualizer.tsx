import React from "react";
import { motion } from "framer-motion";

interface AudioVisualizerProps {
  progress?: number;
  fillColor?: string;
  strokeColor?: string;
  width?: number;
  height?: number;
  barCount?: number;
  shouldAnimate?: boolean; // New prop to control animation
}

const AudioVisualizer = ({
  progress = 50,
  fillColor = "#00FF00",
  strokeColor = "transparent",
  width = 150,
  height = 30,
  barCount = 40,
  shouldAnimate = true, // Default value is true, meaning it animates
}: AudioVisualizerProps) => {
  const progressWidth = (progress / 100) * width;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: barCount }).map((_, index) => {
        const barHeight = Math.random() * (height ?? 30) * 0.8 + 5;

        return (
          <motion.rect
            key={index}
            x={(index / barCount) * width}
            y={height - barHeight}
            width={Math.max(1, width / barCount - 1.5)}
            height={barHeight}
            fill="#CCC"
            rx="1"
            animate={shouldAnimate ? {
              height: [barHeight * 0.5, barHeight, barHeight * 0.7, barHeight * 1.1, barHeight * 0.9],
              y: [
                height - barHeight * 0.5,
                height - barHeight,
                height - barHeight * 0.7,
                height - barHeight * 1.1,
                height - barHeight * 0.9,
              ],
            } : {}}
            transition={{
              duration: 1,
              repeat: shouldAnimate ? Infinity : 0, // Only repeat if animating
              ease: "easeInOut",
              repeatType: "mirror",
              delay: index * 0.02,
            }}
          />
        );
      })}

      <clipPath id="waveClip">
        <rect width={progressWidth} height={height ?? 30} />
      </clipPath>

      {Array.from({ length: barCount }).map((_, index) => {
        const barHeight = Math.random() * height * 0.8 + 5;

        return (
          <motion.rect
            key={`progress-${index}`}
            x={(index / barCount) * width}
            y={height - barHeight}
            width={Math.max(1, width / barCount - 1.5)}
            height={barHeight}
            fill={!fillColor ? "#00FF00" : fillColor}
            stroke={!strokeColor ? "transparent" : strokeColor}
            strokeWidth="0.3"
            rx="1"
            clipPath="url(#waveClip)"
            animate={shouldAnimate ? {
              height: [barHeight * 0.5, barHeight, barHeight * 0.7, barHeight * 1.1, barHeight * 0.9],
              y: [
                height - barHeight * 0.5,
                height - barHeight,
                height - barHeight * 0.7,
                height - barHeight * 1.1,
                height - barHeight * 0.9,
              ],
            } : {}}
            transition={{
              duration: 1,
              repeat: shouldAnimate ? Infinity : 0,
              ease: "easeInOut",
              repeatType: "mirror",
              delay: index * 0.02,
            }}
          />
        );
      })}
    </svg>
  );
};

export default AudioVisualizer;
