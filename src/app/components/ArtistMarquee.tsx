const items = [
  "🎤 Beyoncé",
  "✦ 21.08.2026",
  "💎 Rihanna",
  "✦ SVĐ Mỹ Đình",
  "🎸 Adele",
  "✦ 22.08.2026",
  "🌟 Taylor Swift",
  "✦ Hà Nội",
  "🎹 Mariah Carey",
  "✦ 23.08.2026",
  "🕺 Justin Bieber",
  "✦ SOUNDWAVE 2026",
];

const doubled = [...items, ...items];

export function ArtistMarquee() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-fuchsia-950 via-purple-950 to-fuchsia-950 border-y border-fuchsia-500/20 py-3">
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-fuchsia-950 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-fuchsia-950 to-transparent pointer-events-none" />

      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`px-6 text-sm tracking-widest whitespace-nowrap ${
              item.startsWith("✦")
                ? "text-amber-400/70"
                : "text-white/90"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
