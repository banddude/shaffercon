"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Mode = "wide" | "tall";

const SOURCES: Record<Mode, { src: string; poster: string; ratio: string }> = {
  wide: { src: "/videos/plugmein-wide.mp4", poster: "/videos/plugmein-wide.jpg", ratio: "16 / 9" },
  tall: { src: "/videos/plugmein-vertical.mp4", poster: "/videos/plugmein-vertical.jpg", ratio: "9 / 16" },
};

// One player. Landscape screens get the widescreen cut, portrait screens get the vertical cut.
// Rotating mid-play swaps the source on the same <video> element and resumes at the same time,
// which keeps iOS's "user started playback" permission for that element.
export default function OrientationVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>("wide");
  const pending = useRef<{ t: number; playing: boolean } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const pick = () => {
      const next: Mode = mq.matches ? "tall" : "wide";
      setMode((prev) => {
        if (prev === next) return prev;
        const v = ref.current;
        if (v && v.currentTime > 0) {
          pending.current = { t: v.currentTime, playing: !v.paused && !v.ended };
        }
        return next;
      });
    };
    pick();
    mq.addEventListener("change", pick);
    window.addEventListener("resize", pick);
    return () => {
      mq.removeEventListener("change", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  const resume = () => {
    const v = ref.current;
    const p = pending.current;
    if (!v || !p) return;
    pending.current = null;
    v.currentTime = p.t;
    if (p.playing) v.play().catch(() => {});
  };

  const s = SOURCES[mode];
  const wrap: CSSProperties = {
    maxWidth: mode === "tall" ? "min(100%, 480px)" : "100%",
    margin: "0 auto",
  };
  const video: CSSProperties = {
    width: "100%",
    aspectRatio: s.ratio,
    display: "block",
    borderRadius: "16px",
    background: "#000",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  return (
    <div style={wrap}>
      <video
        ref={ref}
        className="plugmein-video"
        style={video}
        src={s.src}
        poster={s.poster}
        controls
        playsInline
        preload="metadata"
        onLoadedMetadata={resume}
      />
    </div>
  );
}
