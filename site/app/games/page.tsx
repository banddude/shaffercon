"use client";

import { Metadata } from "next";
import Link from "next/link";
import {
  AppleSection,
  AppleCard,
  AppleGrid,
} from "@/app/components/UI/AppleStyle";
import { useEffect, useState } from "react";
import { withBasePath } from "@/app/config";
import { Zap, Plug, Trophy, Crosshair, Hash, Grid3x3 } from "lucide-react";

export default function GamesPage() {
  const [leaderboards, setLeaderboards] = useState<{
    zappybird: Array<{ name: string; score: number }>;
    sparkybros: Array<{ name: string; score: number }>;
    doom: Array<{ name: string; level: number; kills: number; time: number; score: number }>;
    hopscotch: Array<{ name: string; score: number }>;
    classichopscotch: Array<{ name: string; score: number }>;
  }>({
    zappybird: [],
    sparkybros: [],
    doom: [],
    hopscotch: [],
    classichopscotch: [],
  });

  useEffect(() => {
    // Load leaderboards from localStorage
    const zappyBirdScores = JSON.parse(
      localStorage.getItem("zappybird-leaderboard") || "[]"
    );
    const sparkyBrosScores = JSON.parse(
      localStorage.getItem("sparkybros-leaderboard") || "[]"
    );
    const doomScores = JSON.parse(
      localStorage.getItem("doom-leaderboard") || "[]"
    );
    const hopscotchScores = JSON.parse(
      localStorage.getItem("hopscotch-leaderboard") || "[]"
    );
    const classicHopscotchScores = JSON.parse(
      localStorage.getItem("classic-hopscotch-leaderboard") || "[]"
    );

    setLeaderboards({
      zappybird: zappyBirdScores.slice(0, 3),
      sparkybros: sparkyBrosScores.slice(0, 3),
      doom: doomScores.slice(0, 3),
      hopscotch: hopscotchScores.slice(0, 3),
      classichopscotch: classicHopscotchScores.slice(0, 3),
    });

    // Listen for storage changes to update leaderboard in real-time
    const handleStorageChange = () => {
      const zb = JSON.parse(
        localStorage.getItem("zappybird-leaderboard") || "[]"
      );
      const sb = JSON.parse(
        localStorage.getItem("sparkybros-leaderboard") || "[]"
      );
      const dm = JSON.parse(
        localStorage.getItem("doom-leaderboard") || "[]"
      );
      const hs = JSON.parse(
        localStorage.getItem("hopscotch-leaderboard") || "[]"
      );
      const ch = JSON.parse(
        localStorage.getItem("classic-hopscotch-leaderboard") || "[]"
      );
      setLeaderboards({
        zappybird: zb.slice(0, 3),
        sparkybros: sb.slice(0, 3),
        doom: dm.slice(0, 3),
        hopscotch: hs.slice(0, 3),
        classichopscotch: ch.slice(0, 3),
      });
    };

    window.addEventListener("storage", handleStorageChange);
    // Also check every second for updates from same window
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  const games = [
    {
      title: "Zappy Bird",
      description: "Dodge electrical conduit through a parallax city skyline! Tap to flap as the sky shifts from dawn to night: how far can you fly?",
      href: withBasePath("games/zappy-bird.html"),
      icon: Zap,
      leaderboardKey: "zappybird" as const,
    },
    {
      title: "Sparky Bros",
      description: "Classic platformer action: run, jump, and collect wire nuts across industrial zones. Stomp spark enemies and warp through conduit pipes!",
      href: withBasePath("games/sparky-bros.html"),
      icon: Plug,
      leaderboardKey: "sparkybros" as const,
    },
    {
      title: "Sparky's Hopscotch",
      description: "Leap across numbered junction boxes in order! Each level stacks higher with trickier patterns. Keep your balance and climb the leaderboard.",
      href: withBasePath("games/sparky-hopscotch.html"),
      icon: Hash,
      leaderboardKey: "hopscotch" as const,
    },
    {
      title: "Classic Hopscotch",
      description: "Toss your marker and hop the chalk court on the job site! Complete all 10 rounds without stepping on the lines to prove you've got the moves.",
      href: withBasePath("games/classic-hopscotch.html"),
      icon: Grid3x3,
      leaderboardKey: "classichopscotch" as const,
    },
    {
      title: "DΩΩM",
      description: "9 levels of first-person electrical warfare. Six weapons, seven enemy types, and one epic boss: fight through the power plant and restore the grid.",
      href: withBasePath("games/electrician-doom.html"),
      icon: Crosshair,
      leaderboardKey: "doom" as const,
    },
  ];

  return (
    <main className="w-full min-h-[100dvh] flex items-center">
      <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-16">
        <h1
          className="text-2xl sm:text-5xl font-black text-center mb-2 sm:mb-6"
          style={{ color: "var(--text)" }}
        >
          Games
        </h1>
        <p
          className="text-sm sm:text-lg text-center mb-6 sm:mb-12 max-w-xl mx-auto"
          style={{ color: "var(--secondary)" }}
        >
          Electrician-themed arcade games, play on desktop or mobile!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-12">
          {games.map((game, idx) => {
            const gameLeaderboard = leaderboards[game.leaderboardKey];
            const isLastOdd = idx === games.length - 1 && games.length % 2 !== 0;
            return (
              <div
                key={idx}
                className={`rounded-lg border overflow-hidden ${isLastOdd ? "sm:col-span-2 sm:max-w-lg sm:mx-auto" : ""}`}
                style={{
                  background: "var(--background)",
                  borderColor: "var(--secondary)",
                }}
              >
                <a
                  href={game.href}
                  className="group block p-4 sm:p-8 transition-all duration-300 hover:bg-opacity-80"
                >
                  <div className="mb-2 sm:mb-4">
                    <game.icon
                      className="w-8 h-8 sm:w-12 sm:h-12"
                      style={{ color: "var(--primary)" }}
                      strokeWidth={2}
                    />
                  </div>
                  <h2
                    className="text-lg sm:text-2xl font-bold mb-1 sm:mb-3"
                    style={{ color: "var(--text)" }}
                  >
                    {game.title}
                  </h2>
                  <p
                    className="text-xs sm:text-base mb-3 sm:mb-6 line-clamp-2"
                    style={{ color: "var(--secondary)" }}
                  >
                    {game.description}
                  </p>
                  <span
                    className="inline-flex items-center font-semibold text-xs sm:text-base"
                    style={{ color: "var(--primary)" }}
                  >
                    Play Now →
                  </span>
                </a>

                {/* Mini Leaderboard */}
                <div
                  className="px-4 sm:px-8 pb-4 sm:pb-6 pt-2"
                  style={{ borderTop: "1px solid var(--secondary)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4" style={{ color: "var(--primary)" }} strokeWidth={2} />
                    <h3
                      className="text-xs sm:text-sm font-bold"
                      style={{ color: "var(--text)" }}
                    >
                      Top Players
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {gameLeaderboard.length > 0 ? (
                      gameLeaderboard.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-xs sm:text-sm"
                        >
                          <span style={{ color: "var(--secondary)" }}>
                            {idx + 1}. {entry.name}
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: "var(--primary)" }}
                          >
                            {game.leaderboardKey === "doom" && "level" in entry
                              ? `L${entry.level} • ${entry.score}`
                              : entry.score}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p
                        className="text-xs italic text-center py-2"
                        style={{ color: "var(--secondary)" }}
                      >
                        No scores yet. Be the first!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboards */}
        <div className="space-y-4 sm:space-y-6">
          <h2
            className="text-xl sm:text-3xl font-bold text-center mb-3 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3"
            style={{ color: "var(--text)" }}
          >
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "var(--primary)" }} strokeWidth={2} />
            Full Leaderboards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {/* Zappy Bird Leaderboard */}
            <div
              className="p-4 sm:p-6 rounded-lg border"
              style={{
                background: "var(--background)",
                borderColor: "var(--secondary)",
              }}
            >
              <h3
                className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-center flex items-center justify-center gap-2"
                style={{ color: "var(--text)" }}
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--primary)" }} strokeWidth={2} />
                Zappy Bird
              </h3>
              <div className="space-y-2">
                {leaderboards.zappybird.length > 0 ? (
                  leaderboards.zappybird.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded"
                      style={{
                        background: idx === 0 ? "rgba(255, 215, 0, 0.1)" : "transparent",
                      }}
                    >
                      <span
                        className="text-sm sm:text-base font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {idx + 1}. {entry.name}
                      </span>
                      <span
                        className="text-sm sm:text-base font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {entry.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <p
                    className="text-xs sm:text-sm text-center py-4"
                    style={{ color: "var(--secondary)" }}
                  >
                    No scores yet. Be the first!
                  </p>
                )}
              </div>
            </div>

            {/* Sparky Bros Leaderboard */}
            <div
              className="p-4 sm:p-6 rounded-lg border"
              style={{
                background: "var(--background)",
                borderColor: "var(--secondary)",
              }}
            >
              <h3
                className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-center flex items-center justify-center gap-2"
                style={{ color: "var(--text)" }}
              >
                <Plug className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--primary)" }} strokeWidth={2} />
                Sparky Bros
              </h3>
              <div className="space-y-2">
                {leaderboards.sparkybros.length > 0 ? (
                  leaderboards.sparkybros.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded"
                      style={{
                        background: idx === 0 ? "rgba(255, 215, 0, 0.1)" : "transparent",
                      }}
                    >
                      <span
                        className="text-sm sm:text-base font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {idx + 1}. {entry.name}
                      </span>
                      <span
                        className="text-sm sm:text-base font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {entry.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <p
                    className="text-xs sm:text-sm text-center py-4"
                    style={{ color: "var(--secondary)" }}
                  >
                    No scores yet. Be the first!
                  </p>
                )}
              </div>
            </div>

            {/* Hopscotch Leaderboard */}
            <div
              className="p-4 sm:p-6 rounded-lg border"
              style={{
                background: "var(--background)",
                borderColor: "var(--secondary)",
              }}
            >
              <h3
                className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-center flex items-center justify-center gap-2"
                style={{ color: "var(--text)" }}
              >
                <Hash className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--primary)" }} strokeWidth={2} />
                Sparky's Hopscotch
              </h3>
              <div className="space-y-2">
                {leaderboards.hopscotch.length > 0 ? (
                  leaderboards.hopscotch.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded"
                      style={{
                        background: idx === 0 ? "rgba(255, 215, 0, 0.1)" : "transparent",
                      }}
                    >
                      <span
                        className="text-sm sm:text-base font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {idx + 1}. {entry.name}
                      </span>
                      <span
                        className="text-sm sm:text-base font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {entry.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <p
                    className="text-xs sm:text-sm text-center py-4"
                    style={{ color: "var(--secondary)" }}
                  >
                    No scores yet. Be the first!
                  </p>
                )}
              </div>
            </div>

            {/* Classic Hopscotch Leaderboard */}
            <div
              className="p-4 sm:p-6 rounded-lg border"
              style={{
                background: "var(--background)",
                borderColor: "var(--secondary)",
              }}
            >
              <h3
                className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-center flex items-center justify-center gap-2"
                style={{ color: "var(--text)" }}
              >
                <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--primary)" }} strokeWidth={2} />
                Classic Hopscotch
              </h3>
              <div className="space-y-2">
                {leaderboards.classichopscotch.length > 0 ? (
                  leaderboards.classichopscotch.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded"
                      style={{
                        background: idx === 0 ? "rgba(255, 215, 0, 0.1)" : "transparent",
                      }}
                    >
                      <span
                        className="text-sm sm:text-base font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {idx + 1}. {entry.name}
                      </span>
                      <span
                        className="text-sm sm:text-base font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {entry.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <p
                    className="text-xs sm:text-sm text-center py-4"
                    style={{ color: "var(--secondary)" }}
                  >
                    No scores yet. Be the first!
                  </p>
                )}
              </div>
            </div>

            {/* DΩΩM Leaderboard */}
            <div
              className="p-4 sm:p-6 rounded-lg border"
              style={{
                background: "var(--background)",
                borderColor: "var(--secondary)",
              }}
            >
              <h3
                className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-center flex items-center justify-center gap-2"
                style={{ color: "var(--text)" }}
              >
                <Crosshair className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--primary)" }} strokeWidth={2} />
                DΩΩM
              </h3>
              <div className="space-y-2">
                {leaderboards.doom.length > 0 ? (
                  leaderboards.doom.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded"
                      style={{
                        background: idx === 0 ? "rgba(255, 215, 0, 0.1)" : "transparent",
                      }}
                    >
                      <span
                        className="text-sm sm:text-base font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {idx + 1}. {entry.name}
                      </span>
                      <span
                        className="text-xs sm:text-sm font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        L{entry.level} • {entry.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <p
                    className="text-xs sm:text-sm text-center py-4"
                    style={{ color: "var(--secondary)" }}
                  >
                    No scores yet. Be the first!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
