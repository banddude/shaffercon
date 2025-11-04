"use client";

import { Metadata } from "next";
import Link from "next/link";
import {
  AppleSection,
  AppleCard,
  AppleGrid,
} from "@/app/components/UI/AppleStyle";
import { useEffect, useState } from "react";

export default function GamesPage() {
  const [leaderboards, setLeaderboards] = useState<{
    zappybird: Array<{ name: string; score: number }>;
    sparkybros: Array<{ name: string; score: number }>;
  }>({
    zappybird: [],
    sparkybros: [],
  });

  useEffect(() => {
    // Load leaderboards from localStorage
    const zappyBirdScores = JSON.parse(
      localStorage.getItem("zappybird-leaderboard") || "[]"
    );
    const sparkyBrosScores = JSON.parse(
      localStorage.getItem("sparkybros-leaderboard") || "[]"
    );

    setLeaderboards({
      zappybird: zappyBirdScores.slice(0, 3),
      sparkybros: sparkyBrosScores.slice(0, 3),
    });

    // Listen for storage changes to update leaderboard in real-time
    const handleStorageChange = () => {
      const zb = JSON.parse(
        localStorage.getItem("zappybird-leaderboard") || "[]"
      );
      const sb = JSON.parse(
        localStorage.getItem("sparkybros-leaderboard") || "[]"
      );
      setLeaderboards({
        zappybird: zb.slice(0, 3),
        sparkybros: sb.slice(0, 3),
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
      description: "Navigate through electrical obstacles in this electrifying adventure! Tap to make Zappy fly and avoid the pipes.",
      href: "/shaffercon-migration/games/index.html",
      icon: "⚡",
    },
    {
      title: "Sparky Bros",
      description: "Join the Sparky Bros on their electrical engineering adventure! Jump and collect power-ups in this exciting platformer.",
      href: "/shaffercon-migration/games/sparky-bros.html",
      icon: "🔌",
    },
  ];

  return (
    <main className="w-full min-h-screen flex items-center">
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
          Play our electrical themed games!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-12">
          {games.map((game, idx) => (
            <a
              key={idx}
              href={game.href}
              className="group block p-4 sm:p-8 rounded-lg border transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--background)",
                borderColor: "var(--secondary)",
              }}
            >
              <div className="text-3xl sm:text-5xl mb-2 sm:mb-4">{game.icon}</div>
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
          ))}
        </div>

        {/* Leaderboards */}
        <div className="space-y-4 sm:space-y-6">
          <h2
            className="text-xl sm:text-3xl font-bold text-center mb-3 sm:mb-6"
            style={{ color: "var(--text)" }}
          >
            🏆 Leaderboards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {/* Zappy Bird Leaderboard */}
            <div
              className="p-4 sm:p-6 rounded-lg border"
              style={{
                background: "var(--background)",
                borderColor: "var(--secondary)",
              }}
            >
              <h3
                className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-center"
                style={{ color: "var(--text)" }}
              >
                ⚡ Zappy Bird
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
                className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-center"
                style={{ color: "var(--text)" }}
              >
                🔌 Sparky Bros
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
          </div>
        </div>
      </div>
    </main>
  );
}
