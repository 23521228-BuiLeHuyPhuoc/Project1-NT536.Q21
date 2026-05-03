import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, useInView } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

/* ── Artist data với YouTube video ID + start time (giây) ─────────────── */
const artists = [
  {
    name: "BEYONCÉ",
    genre: "R&B / Pop",
    night: "Đêm 1 — 21.08",
    img: "https://i.scdn.co/image/ab6761610000e5eb7eaa373538359164b843f7c0",
    hit: "Crazy In Love (Live)",
    color: "from-amber-500/30 to-yellow-700/20",
    accent: "#f59e0b",
    ytId: "ViwtNLUqkMY",
    startAt: 28,
  },
  {
    name: "RIHANNA",
    genre: "Pop / R&B",
    night: "Đêm 1 — 21.08",
    img: "https://i.scdn.co/image/ab6761610000e5ebcb565a8e684e3be458d329ac",
    hit: "Diamonds (Live)",
    color: "from-violet-600/30 to-indigo-700/20",
    accent: "#8b5cf6",
    ytId: "lWA2pjMjpBs",
    startAt: 20,
  },
  {
    name: "ADELE",
    genre: "Soul / Ballad",
    night: "Đêm 2 — 22.08",
    img: "https://static01.nyt.com/images/2021/11/18/arts/18adele-review1/18adele-review1-mediumSquareAt3X.jpg",
    hit: "Someone Like You (Live)",
    color: "from-orange-500/30 to-red-700/20",
    accent: "#f97316",
    ytId: "hLQl3WQQoQ0",
    startAt: 25,
  },
  {
    name: "TAYLOR SWIFT",
    genre: "Pop / Country",
    night: "Đêm 2 — 22.08",
    img: "https://m.media-amazon.com/images/M/MV5BYWYwYzYzMjUtNWE0MS00NmJlLTljNGMtNzliYjg5NzQ1OWY5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    hit: "Wildest Dreams (Live)",
    color: "from-pink-500/30 to-rose-700/20",
    accent: "#ec4899",
    ytId: "IdneKLhsWOQ",
    startAt: 32,
  },
  {
    name: "MARIAH CAREY",
    genre: "Pop / Holiday",
    night: "Đêm 3 — 23.08",
    img: "https://www.billboard.com/wp-content/uploads/media/Mariah-Carey-Portrait-Session-1990s-billboard-1500.jpg?w=942&h=628&crop=1",
    hit: "All I Want for Christmas (Live)",
    color: "from-red-500/30 to-rose-900/20",
    accent: "#ef4444",
    ytId: "yXQViqx6GMY",
    startAt: 15,
  },
  {
    name: "JUSTIN BIEBER",
    genre: "Pop / Dance",
    night: "Đêm 3 — 23.08",
    img: "https://m.media-amazon.com/images/M/MV5BMjE1NjMxMDUyM15BMl5BanBnXkFtZTgwODMzNDM1NTE@._V1_FMjpg_UX1000_.jpg",
    hit: "Sorry (Live)",
    color: "from-cyan-500/30 to-blue-700/20",
    accent: "#06b6d4",
    ytId: "fRh_vgS2dFE",
    startAt: 30,
  },
];

/* ── Audio wave bars component ─────────────────────────────────────────── */
function AudioWave({ active, accent }: { active: boolean; accent: string }) {
  const delays = [0, 0.15, 0.3, 0.1, 0.2];
  return (
    <span className="flex items-end gap-[3px] h-5">
      {delays.map((d, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full transition-all"
          style={{
            backgroundColor: accent,
            height: active ? undefined : "4px",
            animation: active
              ? `soundwave 0.7s ease-in-out ${d}s infinite alternate`
              : "none",
            minHeight: "4px",
          }}
        />
      ))}
      <style>{`
        @keyframes soundwave {
          0%   { height: 4px;  opacity: 0.6; }
          100% { height: 18px; opacity: 1;   }
        }
      `}</style>
    </span>
  );
}

/* ── Artist card ───────────────────────────────────────────────────────── */
function ArtistCard({
  a,
  index,
  isPlaying,
  onHoverIn,
  onHoverOut,
}: {
  a: (typeof artists)[0];
  index: number;
  isPlaying: boolean;
  onHoverIn: () => void;
  onHoverOut: () => void;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  /* 3-D tilt */
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`;
    el.style.transition = "transform 0.05s ease";
    const shine = el.querySelector<HTMLDivElement>(".card-shine");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.12), transparent 65%)`;
      shine.style.opacity = "1";
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleMouseMove(e);
    onHoverIn();
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.transition = "transform 0.5s ease";
    const shine = el.querySelector<HTMLDivElement>(".card-shine");
    if (shine) shine.style.opacity = "0";
    onHoverOut();
  };

  return (
    <motion.a
      ref={cardRef}
      href="#videos"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById("videos")?.scrollIntoView({ behavior: "smooth" });
      }}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative group rounded-3xl overflow-hidden border border-white/10 hover:border-fuchsia-400/50 block will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Shine overlay */}
      <div className="card-shine absolute inset-0 z-[4] pointer-events-none transition-opacity duration-200 opacity-0 rounded-3xl" />

      {/* Glow border */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: "inset 0 0 30px rgba(217,70,239,0.15)" }}
      />

      {/* Now Playing ring */}
      {isPlaying && (
        <div
          className="absolute inset-0 z-[5] pointer-events-none rounded-3xl"
          style={{
            boxShadow: `0 0 0 2px ${a.accent}, 0 0 30px ${a.accent}55`,
            transition: "opacity 0.3s",
          }}
        />
      )}

      {/* Image */}
      <div className="aspect-[3/4] relative">
        <ImageWithFallback
          src={a.img}
          alt={a.name}
          className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${a.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Night badge */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-fuchsia-500/80 backdrop-blur text-xs z-[2]">
          {a.night}
        </span>

        {/* Now Playing badge */}
        <div
          className={`absolute top-4 right-4 z-[6] flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur border text-xs transition-all duration-300 ${
            isPlaying
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90 pointer-events-none"
          }`}
          style={{
            background: `${a.accent}22`,
            borderColor: `${a.accent}55`,
            color: a.accent,
          }}
        >
          <Volume2 className="w-3 h-3" />
          <span>Đang phát</span>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-[2]">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-2xl truncate group-hover:text-fuchsia-300 transition-colors duration-300">
              {a.name}
            </h3>
            <p className="text-sm text-fuchsia-300">{a.genre}</p>

            {/* Hit & wave */}
            <div className="flex items-center gap-2 mt-1.5">
              <p className="text-xs text-white/55 truncate">🎵 {a.hit}</p>
              {isPlaying && <AudioWave active={isPlaying} accent={a.accent} />}
            </div>
          </div>

          {/* Play / wave button */}
          <div
            className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              isPlaying
                ? "scale-110"
                : "group-hover:scale-110"
            }`}
            style={{
              background: isPlaying ? a.accent : "#a855f8",
              boxShadow: isPlaying ? `0 0 20px ${a.accent}88` : "0 4px 15px rgba(168,85,247,0.5)",
            }}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 fill-white text-white" />
            ) : (
              <VolumeX className="w-5 h-5 text-white" />
            )}
          </div>
        </div>
      </div>
    </motion.a>
  );
}

/* ── Lineup section ────────────────────────────────────────────────────── */
export function Lineup() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  /* Which artist index is being hovered (-1 = none) */
  const [hovered, setHovered] = useState(-1);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Sync ref for hovered so event dispatch is always up-to-date */
  const hoveredRef = useRef(-1);

  /* Single persistent iframe — src changed directly to avoid two players coexisting */
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleHoverIn = (i: number) => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }

    /* Transitioning from idle → hovering: signal VideoShowcase to pause */
    if (hoveredRef.current === -1) {
      window.dispatchEvent(
        new CustomEvent("sw:lineup-hover", { detail: { active: true } })
      );
    }

    hoveredRef.current = i;
    setHovered(i);

    /* Stop any current audio immediately, then load new source */
    if (iframeRef.current) {
      iframeRef.current.src = "about:blank";
      const { ytId, startAt } = artists[i];
      // Tiny tick so browser fully tears down the old stream before starting new
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&start=${startAt}&controls=0&rel=0&enablejsapi=1`;
        }
      }, 50);
    }
  };

  const handleHoverOut = () => {
    /* Small delay so audio doesn't cut instantly when moving between cards */
    leaveTimer.current = setTimeout(() => {
      hoveredRef.current = -1;
      setHovered(-1);
      if (iframeRef.current) iframeRef.current.src = "about:blank";
      /* All cards left: signal VideoShowcase to resume */
      window.dispatchEvent(
        new CustomEvent("sw:lineup-hover", { detail: { active: false } })
      );
    }, 120);
  };

  const active = hovered >= 0 ? artists[hovered] : null;

  return (
    <section className="py-24 px-6 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <span className="uppercase tracking-[0.3em] text-amber-300">Lineup 2026</span>
          <h2 className="text-5xl mt-3 pb-2 bg-gradient-to-r from-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            Những huyền thoại cùng hội tụ
          </h2>
          <p className="mt-3 text-white/55">
            Rê chuột vào từng nghệ sĩ để nghe nhạc live · Bấm để xem video
          </p>

          {/* Audio hint */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/40">
            <Volume2 className="w-3.5 h-3.5" />
            Trình duyệt cần tương tác trước (scroll / click) để phát audio tự động
          </div>
        </motion.div>

        {/* Grid */}
        <div ref={sectionRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {inView
            ? artists.map((a, i) => (
                <ArtistCard
                  key={a.name}
                  a={a}
                  index={i}
                  isPlaying={hovered === i}
                  onHoverIn={() => handleHoverIn(i)}
                  onHoverOut={handleHoverOut}
                />
              ))
            : artists.map((a) => (
                <div key={a.name} className="aspect-[3/4] rounded-3xl bg-white/5 animate-pulse" />
              ))}
        </div>

        {/* Now Playing bar */}
        <motion.div
          className="mt-8 flex items-center justify-center"
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
          transition={{ duration: 0.3 }}
        >
          {active && (
            <div
              className="flex items-center gap-3 px-5 py-3 rounded-full border backdrop-blur"
              style={{
                background: `${active.accent}18`,
                borderColor: `${active.accent}44`,
              }}
            >
              <AudioWave active={true} accent={active.accent} />
              <span className="text-sm" style={{ color: active.accent }}>
                {active.name}
              </span>
              <span className="text-xs text-white/50">— {active.hit}</span>
              <AudioWave active={true} accent={active.accent} />
            </div>
          )}
        </motion.div>
      </div>

      {/* Single hidden YouTube audio player — src changed directly via ref, never recreated */}
      <iframe
        ref={iframeRef}
        src="about:blank"
        allow="autoplay; encrypted-media"
        style={{
          position: "fixed",
          bottom: -1,
          left: -1,
          width: 1,
          height: 1,
          border: "none",
          opacity: 0,
          pointerEvents: "none",
        }}
        title="audio-preview"
      />
    </section>
  );
}