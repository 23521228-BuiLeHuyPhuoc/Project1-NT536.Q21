import { useEffect, useState } from "react";
import { Calendar, MapPin, Compass, PlayCircle } from "lucide-react";

const slides = [
  {
    img: "https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2181107453-20241209114519432.jpg?c=original",
    label: "Đêm khai mạc bùng cháy",
    sub: "Đêm 1 — Beyoncé & Rihanna",
  },
  {
    img: "https://s1.ticketm.net/dam/a/7b0/59dd6cb6-7e74-4832-812e-7dc7a62bb7b0_TABLET_LANDSCAPE_LARGE_16_9.jpg",
    label: "Pháo hoa & Sân khấu ngoạn mục",
    sub: "Đêm 2 — Adele & Taylor Swift",
  },
  {
    img: "https://res.cloudinary.com/sagacity/image/upload/c_crop,h_1074,w_1600,x_0,y_0/c_scale,w_1080/v1396551798/RH_HOUSTON_AP-1196_tb4mtd.jpg",
    label: "Không khí lễ hội cuồng nhiệt",
    sub: "Đêm 3 — Mariah Carey & Justin Bieber",
  },
  {
    img: "https://assets.teenvogue.com/photos/641b2a23912ddccbabf80f80/16:9/w_2560%2Cc_limit/GettyImages-1474459622.jpg",
    label: "Laser & Ánh đèn huyền ảo",
    sub: "21 – 23 Tháng 8, 2026",
  },
  {
    img: "https://69edbb350e0199e8b4c12992.imgix.net/rrrr/rihanna-musicares-billboard-1548.webp",
    label: "Rihanna Concert",
    sub: "21 – 23 Tháng 8, 2026",
  },
  {
    img: "https://assets.newsweek.com/wp-content/uploads/2025/08/2262996-beyonce-performing-her-renaissance-world-tour.jpg?w=1200crop=1",
    label: "Beyonce Concert",
    sub: "21 – 23 Tháng 8, 2026",
  },
  {
    img: "https://images.axios.com/UpLYTZxSMb7o3dDENxvC3_LvrqU=/0x220:4000x2470/1920x1080/2023/08/31/1693490966219.jpg",
    label: "Đại nhạc hội giữa bầu trời",
    sub: "SVĐ Mỹ Đình, Hà Nội",
  },
];

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  size: 1.2 + ((i * 7 + 3) % 4),
  left: ((i * 13 + 5) % 100),
  color: ["#ff80ff", "#a78bfa", "#fbbf24", "#60a5fa", "#f472b6", "#34d399", "#e879f9", "#fb923c"][i % 8],
  duration: 9 + ((i * 3) % 12),
  delay: (i * 0.6) % 14,
  drift: ((i % 3) - 1) * 30,
}));

const SPOTLIGHTS = [
  { left: "12%",  height: "72vh", color: "rgba(255,80,200,0.55)",  coneColor: "rgba(255,80,200,0.10)",  anim: "sp-1", blur: 7,  coneW: 90  },
  { left: "42%",  height: "80vh", color: "rgba(130,100,255,0.50)", coneColor: "rgba(130,100,255,0.09)", anim: "sp-2", blur: 12, coneW: 120 },
  { left: "68%",  height: "65vh", color: "rgba(255,200,80,0.45)",  coneColor: "rgba(255,200,80,0.08)",  anim: "sp-3", blur: 9,  coneW: 85  },
  { left: "88%",  height: "58vh", color: "rgba(100,200,255,0.35)", coneColor: "rgba(100,200,255,0.07)", anim: "sp-4", blur: 8,  coneW: 70  },
];

const CONCERT_DATE = new Date("2026-08-21T18:00:00+07:00");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg,rgba(217,70,239,0.15),rgba(168,85,247,0.08))",
          border: "1px solid rgba(217,70,239,0.3)",
          boxShadow: "0 0 20px rgba(217,70,239,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <span className="text-2xl md:text-3xl tabular-nums text-white">
          {String(value).padStart(2, "0")}
        </span>
        {/* Shine */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/50 to-transparent" />
      </div>
      <span className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-white/45">{label}</span>
    </div>
  );
}

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible]   = useState([true, false, false, false, false]);
  const [labelKey, setLabelKey] = useState(0);
  const countdown = useCountdown(CONCERT_DATE);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % slides.length;
        setVisible((v) => { const a = [...v]; a[next] = true; return a; });
        setTimeout(() => {
          setVisible(() => { const a = Array(slides.length).fill(false); a[next] = true; return a; });
        }, 1400);
        setLabelKey((k) => k + 1);
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const goTo = (i: number) => {
    if (i === current) return;
    setVisible((v) => { const a = [...v]; a[i] = true; return a; });
    setCurrent(i);
    setLabelKey((k) => k + 1);
    setTimeout(() => {
      setVisible(() => { const a = Array(slides.length).fill(false); a[i] = true; return a; });
    }, 1400);
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
      {/* ─── Keyframes ─── */}
      <style>{`
        @keyframes heroFadeIn  { from{opacity:0;transform:scale(1.07)} to{opacity:1;transform:scale(1.02)} }
        @keyframes heroFadeOut { from{opacity:1} to{opacity:0} }
        @keyframes kenBurns    { 0%{transform:scale(1.0)} 100%{transform:scale(1.1)} }

        @keyframes sp-1 { 0%,100%{transform:rotate(-28deg);opacity:.7} 50%{transform:rotate(18deg);opacity:1} }
        @keyframes sp-2 { 0%,100%{transform:rotate(20deg);opacity:.6}  50%{transform:rotate(-22deg);opacity:.95} }
        @keyframes sp-3 { 0%,100%{transform:rotate(0deg);opacity:.6}   33%{transform:rotate(-20deg);opacity:.9} 66%{transform:rotate(24deg);opacity:.7} }
        @keyframes sp-4 { 0%,100%{transform:rotate(15deg);opacity:.5}  50%{transform:rotate(-15deg);opacity:.8} }

        @keyframes floatUp {
          0%   {transform:translateY(0) translateX(0);opacity:0}
          12%  {opacity:.9}
          88%  {opacity:.5}
          100% {transform:translateY(-110vh) translateX(var(--drift,0px));opacity:0}
        }
        @keyframes heroSlideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.7);opacity:.4} }

        @keyframes glitch {
          0%,88%,100% { transform:none; filter:none; }
          90%  { transform:translate(-3px, 0) skewX(-1deg); filter:hue-rotate(80deg) brightness(1.3); }
          92%  { transform:translate(3px, 0)  skewX(1deg);  filter:hue-rotate(-80deg) brightness(0.9); }
          94%  { transform:translate(-1px, 0); filter:none; }
          96%  { transform:none; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes auroraPulse {
          0%,100% { opacity:.35; transform:scaleX(1); }
          50%      { opacity:.55; transform:scaleX(1.08); }
        }
        @keyframes countFlip {
          from { transform:translateY(-6px);opacity:0 }
          to   { transform:translateY(0);opacity:1 }
        }
        @keyframes wave {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.15); }
        }

        .hero-slide-active { animation:heroFadeIn 1.3s ease forwards; z-index:2; }
        .hero-slide-exit   { animation:heroFadeOut 1.3s ease forwards; z-index:1; }
        .hero-slide-hidden { opacity:0; z-index:0; }
        .kb  { animation:kenBurns 10s ease-in-out infinite alternate; }

        .sp-1 { animation:sp-1 6s ease-in-out infinite; }
        .sp-2 { animation:sp-2 8s ease-in-out infinite 1.2s; }
        .sp-3 { animation:sp-3 7s ease-in-out infinite 2.4s; }
        .sp-4 { animation:sp-4 9s ease-in-out infinite 3.6s; }

        .hero-label { animation:heroSlideUp 0.65s ease forwards; }
        .pulse-dot  { animation:pulseDot 1.4s ease-in-out infinite; }

        .title-glitch {
          background: linear-gradient(
            110deg,
            #e879f9 0%,#f472b6 20%,#fbbf24 35%,#f472b6 50%,#c084fc 65%,#e879f9 80%,#fbbf24 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glitch 8s ease-in-out infinite, shimmer 4s linear infinite;
          padding-right: 0.25em;
        }
        .wave-letter {
          display: inline-block;
          transition: all 0.3s ease;
        }
        .title-glitch:hover .wave-letter {
          animation: wave 0.5s ease;
        }
        .aurora {
          animation: auroraPulse 5s ease-in-out infinite;
        }
        .count-flip { animation:countFlip .25s ease forwards; }
      `}</style>

      {/* ─── Background Slideshow ─── */}
      {slides.map((s, i) => {
        const isCurrent = i === current;
        const isVisible  = visible[i];
        const cls = isCurrent ? "hero-slide-active" : isVisible ? "hero-slide-exit" : "hero-slide-hidden";
        return (
          <div key={s.img} className={`absolute inset-0 ${cls}`}>
            <img src={s.img} alt={s.label} className="w-full h-full object-cover kb" />
          </div>
        );
      })}

      {/* ─── Aurora Glow ─── */}
      <div className="absolute inset-x-0 top-1/3 z-[3] pointer-events-none aurora"
        style={{
          height: "300px",
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(217,70,239,0.18) 0%, rgba(168,85,247,0.10) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ─── Spotlight Beams ─── */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        {SPOTLIGHTS.map((sp, i) => (
          <div key={i} className={`${sp.anim} absolute bottom-0 origin-bottom`} style={{ left: sp.left }}>
            <div style={{ width:"3px", height:sp.height, background:`linear-gradient(to top,${sp.color},transparent)`, filter:`blur(${sp.blur}px)` }} />
            <div style={{ position:"absolute", bottom:0, left:`${-sp.coneW/2}px`, width:`${sp.coneW}px`, height:sp.height, background:`linear-gradient(to top,${sp.coneColor},transparent)`, clipPath:"polygon(50% 100%,0% 0%,100% 0%)", filter:"blur(22px)" }} />
          </div>
        ))}
      </div>

      {/* ─── Floating Particles ─── */}
      <div className="absolute inset-0 z-[6] pointer-events-none">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width:`${p.size}px`, height:`${p.size}px`,
              left:`${p.left}%`, bottom:0,
              background:p.color,
              boxShadow:`0 0 6px 2px ${p.color}88`,
              animation:`floatUp ${p.duration}s linear infinite`,
              animationDelay:`${p.delay}s`,
              "--drift":`${p.drift}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ─── Gradient Overlay ─── */}
      <div className="absolute inset-0 z-[7] pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.10) 60%, rgba(0,0,0,0.25) 100%)"
        }}
      />
      {/* Side gradient — left fade so text is readable */}
      <div className="absolute inset-0 z-[7] pointer-events-none"
        style={{
          background: "linear-gradient(to right, rgba(10,0,20,0.80) 0%, rgba(10,0,20,0.50) 35%, transparent 65%)"
        }}
      />

      {/* ─── Noise/Grain overlay (subtle) ─── */}
      <div
        className="absolute inset-0 z-[8] pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ─── Content ─── */}
      <div className="relative z-[9] h-full flex flex-col justify-end pb-6 px-8 md:px-16 text-white">
        {/* Date badge */}
        <div className="mb-4 self-start px-4 py-1.5 rounded-full border border-fuchsia-400/40 bg-fuchsia-950/50 backdrop-blur-sm">
          <span className="uppercase tracking-[0.35em] text-fuchsia-300 text-xs">
            21 · 22 · 23 Tháng 8 · 2026
          </span>
        </div>

        {/* Main title — no max-w constraint, overflow visible */}
        <h1
          className="title-glitch leading-none select-none pb-3"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)", display: "block", width: "fit-content", marginTop: "1rem" }}
        >
          {"SOUNDWAVE".split("").map((char, i) => (
            <span key={i} className="wave-letter" style={{ animationDelay: `${i * 0.05}s` }}>
              {char}
            </span>
          ))}
        </h1>
        <h2 className="text-xl md:text-2xl tracking-[0.45em] text-white/80 mt-1">
          CONCERT 2026
        </h2>

        <p className="mt-3 max-w-sm text-sm text-white/65">
          Đại nhạc hội đa phương tiện — âm thanh, hình ảnh và ánh đèn hội tụ.
          Ba đêm bùng cháy cùng các siêu sao quốc tế.
        </p>

        {/* ── Countdown ── */}
        <div className="mt-5 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            Đếm ngược đến khai mạc
          </span>
          <div className="flex items-end gap-3">
            <CountdownBox value={countdown.d} label="Ngày" />
            <span className="text-2xl text-fuchsia-400/60 pb-5">:</span>
            <CountdownBox value={countdown.h} label="Giờ" />
            <span className="text-2xl text-fuchsia-400/60 pb-5">:</span>
            <CountdownBox value={countdown.m} label="Phút" />
            <span className="text-2xl text-fuchsia-400/60 pb-5">:</span>
            <CountdownBox value={countdown.s} label="Giây" />
          </div>
        </div>

        {/* CTA buttons */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href="#vr"
            onClick={(e) => { e.preventDefault(); document.getElementById("vr")?.scrollIntoView({ behavior:"smooth" }); }}
            className="group relative flex items-center gap-2 px-6 py-2.5 rounded-full overflow-hidden transition"
            style={{ background:"linear-gradient(135deg,#d946ef,#ec4899)", boxShadow:"0 0 24px rgba(217,70,239,0.45)" }}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
            <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300 relative z-10" />
            <span className="text-sm tracking-wide relative z-10">Khám phá 360°</span>
          </a>
          <a
            href="#videos"
            onClick={(e) => { e.preventDefault(); document.getElementById("videos")?.scrollIntoView({ behavior:"smooth" }); }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/30 bg-white/5 hover:bg-white/12 backdrop-blur transition"
          >
            <PlayCircle className="w-4 h-4 text-amber-300" />
            <span className="text-sm tracking-wide">Xem video</span>
          </a>
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-5 mt-5 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-fuchsia-400" />
            21 – 23.08.2026
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-pink-400" />
            SVĐ Mỹ Đình, Hà Nội
          </div>
        </div>
      </div>

      {/* ─── Slide label + dots — bottom right ─── */}
      <div className="absolute bottom-14 right-8 md:right-16 z-[10] flex flex-col items-end gap-3">
        <div
          key={labelKey}
          className="hero-label flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
        >
          <span className="pulse-dot w-2 h-2 rounded-full bg-red-500 inline-block" />
          <span className="text-sm">
            <span className="text-fuchsia-300 mr-1">{slides[current].label}</span>
            — {slides[current].sub}
          </span>
        </div>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? "w-10 bg-fuchsia-400" : "w-4 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}