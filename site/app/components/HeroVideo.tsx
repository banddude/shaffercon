"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  src: string;
  poster: string;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  brightness?: number;
}

/**
 * Hero video that gracefully falls back to a poster <img> if autoplay
 * is blocked. iOS Safari shows a "tap to play" overlay button when
 * autoplay fails (Low Power Mode, low battery, certain cellular conditions).
 * That button is decorative noise on a hero, nothing to play. To kill
 * it for good, when autoplay fails we replace the entire <video> element
 * with an <img> of the poster. iOS has no video element to attach UI to.
 *
 * On platforms where autoplay works, the video plays normally with the
 * poster invisible behind it.
 */
export function HeroVideo({
  src,
  poster,
  ariaLabel = "Background video",
  className = "w-full h-full object-cover",
  style = { filter: "brightness(0.4)", objectPosition: "center" },
  brightness,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayFailed, setAutoplayFailed] = useState(false);

  // Allow `brightness` shorthand to override style filter
  const effectiveStyle: React.CSSProperties = {
    ...style,
    ...(brightness !== undefined ? { filter: `brightness(${brightness})` } : {}),
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Belt and suspenders: explicitly set the attributes that iOS needs
    // (sometimes attributes set via React don't reach iOS Safari in time)
    v.muted = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");

    const tryPlay = () => {
      const p = v.play();
      if (p !== undefined) {
        p.catch(() => {
          // Autoplay blocked. Swap to poster <img> permanently.
          setAutoplayFailed(true);
        });
      }
    };

    // Attempt play immediately
    tryPlay();

    // If the video later transitions to "paused" (some iOS versions pause
    // mid-play in Low Power Mode), swap to poster.
    const handlePause = () => {
      // Only fail-out if we're paused before the user interacted
      if (!v.ended && v.currentTime === 0) {
        setAutoplayFailed(true);
      }
    };
    v.addEventListener("pause", handlePause);

    return () => {
      v.removeEventListener("pause", handlePause);
    };
  }, []);

  if (autoplayFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt={ariaLabel}
        className={className}
        style={effectiveStyle}
        aria-hidden="true"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      className={className}
      aria-label={ariaLabel}
      style={effectiveStyle}
      // disablePictureInPicture is iOS+desktop-friendly
      disablePictureInPicture
      // disableremoteplayback prevents AirPlay overlay
      // @ts-ignore, valid HTML attribute, TypeScript types lag
      disableRemotePlayback
      controls={false}
    >
      <source src={src} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
      Your browser does not support the video tag.
    </video>
  );
}
