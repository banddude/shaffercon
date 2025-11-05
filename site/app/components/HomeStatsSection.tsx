"use client";

export function HomeStatsSection() {
  return (
    <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8">
      <div className="text-center">
        <div className="text-3xl font-black mb-3" style={{ color: "var(--primary)" }}>25+</div>
        <p className="font-semibold" style={{ color: "var(--text)" }}>Years of Experience</p>
      </div>
      <div className="text-center">
        <div className="text-3xl font-black mb-3" style={{ color: "var(--primary)" }}>1000+</div>
        <p className="font-semibold" style={{ color: "var(--text)" }}>Projects Completed</p>
      </div>
      <div className="text-center">
        <div className="text-3xl font-black mb-3" style={{ color: "var(--primary)" }}>100%</div>
        <p className="font-semibold" style={{ color: "var(--text)" }}>Customer Satisfaction</p>
      </div>
    </div>
  );
}
