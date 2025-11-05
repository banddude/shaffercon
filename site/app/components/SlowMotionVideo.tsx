"use client";

import { useEffect, useRef } from "react";

interface SlowMotionVideoProps {
  src: string;
  playbackRate?: number;
  brightness?: number;
  saturation?: number;
  className?: string;
}

export function SlowMotionVideo({
  src,
  playbackRate = 0.8,
  brightness = 0.4,
  saturation = 1,
  className = "w-full h-full object-cover",
}: SlowMotionVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={className}
      style={{
        filter: `brightness(${brightness}) saturate(${saturation})`,
        objectPosition: "top",
      }}
    >
      <source src={src} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
      Your browser does not support the video tag.
    </video>
  );
}
