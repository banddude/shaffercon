"use client";

import { useEffect, useRef, useState } from "react";

interface SlowMotionVideoProps {
  src: string;
  ariaLabel?: string;
  playbackRate?: number;
  brightness?: number;
  saturation?: number;
  className?: string;
}

/**
 * SlowMotionVideo, lazy-loads via IntersectionObserver so below-the-fold
 * background videos don't pay the cost of preloading full MP4 bytes on
 * initial page render. Big SEO win for Core Web Vitals (LCP, TBT).
 *
 * Behavior:
 *  - Initial render: <video> tag with NO <source> → 0 bytes downloaded.
 *  - When the element comes within 200px of the viewport, the <source> is
 *    mounted and `load()` + `play()` are called.
 *  - One-shot: stops observing after first activation.
 */
export function SlowMotionVideo({
  src,
  ariaLabel,
  playbackRate = 0.8,
  brightness = 0.4,
  saturation = 1,
  className = "w-full h-full object-cover",
}: SlowMotionVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Older browsers without IntersectionObserver: just load immediately
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !shouldLoad) return;
    v.playbackRate = playbackRate;
    // After src is mounted, force a load + play
    v.load();
    const playPromise = v.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay blocked (rare on muted videos): silently ignore
      });
    }
  }, [shouldLoad, playbackRate]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      className={className}
      aria-label={ariaLabel || "Background video"}
      style={{
        filter: `brightness(${brightness}) saturate(${saturation})`,
        objectPosition: "top",
      }}
    >
      {shouldLoad && (
        <source src={src} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
      )}
      Your browser does not support the video tag.
    </video>
  );
}
