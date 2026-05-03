import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Play, PauseCircle } from "lucide-react";

const videos = [
  {
    title: "Someone Like You — Live at the BRIT Awards 2011",
    artist: "Adele",
    desc: "Màn trình diễn live huyền thoại của Beyoncé — gợi mở không khí đêm 1 tại SoundWave 2026.",
    youtubeId: "hLQl3WQQoQ0",
  },
  {
    title: "Diamonds — Live at the Concert for Valor",
    artist: "Rihanna",
    desc: "Bản live đầy cảm xúc của Rihanna — ánh sáng kim cương cho đêm khai mạc 21.08.",
    youtubeId: "lWA2pjMjpBs",
  },
  {
    title: "Beyoncé - Crazy In Love ft. JAY Z",
    artist: "Beyoncé",
    desc: "Màn trình diễn live đi vào lịch sử — giọng ca Adele cho đêm 2 tại Mỹ Đình.",
    youtubeId: "ViwtNLUqkMY",
  },
  {
    title: "Taylor Swift - Wildest Dreams",
    artist: "Taylor Swift",
    desc: "Năng lượng bùng nổ trên sân khấu — Taylor Swift mang đến đêm 2 SoundWave 2026.",
    youtubeId: "IdneKLhsWOQ",
  },
  {
    title: "All I Want for Christmas Is You — Live",
    artist: "Mariah Carey",
    desc: "Whistle-note đỉnh cao trên sân khấu live — Mariah Carey mở màn đêm 3.",
    youtubeId: "yXQViqx6GMY",
  },
  {
    title: "Justin Bieber - Sorry (PURPOSE : The Movement)",
    artist: "Justin Bieber",
    desc: "Dance-pop sôi động trên sân khấu live — Justin Bieber khép lại 3 đêm SoundWave 2026.",
    youtubeId: "fRh_vgS2dFE",
  },
  {
    title: "Taylor Swift - Blank Space",
    artist: "Taylor Swift",
    desc: "Vũ đạo huyền thoại trên sân khấu — gợi cảm hứng lễ hội đỉnh cao.",
    youtubeId: "e-ORhEE9VVg",
  },
  {
    title: "Calvin Harris, Rihanna - This Is What You Came For (Official Video)",
    artist: "Rihanna",
    desc: "Bản live của một trong những hit toàn cầu — sẽ có mặt trong setlist.",
    youtubeId: "kOkQ4T5WO9E",
  },
  {
    title: "Justin Bieber - Baby ft. Ludacris",
    artist: "Justin Bieber",
    desc: "Bản hit đầu tay vang lên trên sân khấu live — được fan yêu cầu nhiều nhất.",
    youtubeId: "kffacxfA7G4",
  },
];

const yt = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

/* Gửi lệnh tới YouTube iframe qua postMessage (IFrame API) */
function ytCmd(iframe: HTMLIFrameElement | null, func: string) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args: [] }),
    "https://www.youtube.com"
  );
}

export function VideoShowcase() {
  const [active, setActive] = useState(0);
  const main = videos[active];

  /* Ref tới iframe chính (player có âm thanh) */
  const mainIframeRef = useRef<HTMLIFrameElement>(null);

  /* true nếu chính chúng ta đã pause video (để resume khi lineup unhover) */
  const pausedByLineupRef = useRef(false);

  /* true khi Lineup đang có artist được hover */
  const lineupActiveRef = useRef(false);

  /* Lắng nghe sự kiện từ Lineup */
  useEffect(() => {
    const handler = (e: Event) => {
      const { active: isActive } = (e as CustomEvent<{ active: boolean }>).detail;
      lineupActiveRef.current = isActive;

      if (isActive) {
        /* Lineup bắt đầu hover → pause video đang phát */
        ytCmd(mainIframeRef.current, "pauseVideo");
        pausedByLineupRef.current = true;
      } else {
        /* Lineup thôi hover → resume nếu chính ta đã pause */
        if (pausedByLineupRef.current) {
          ytCmd(mainIframeRef.current, "playVideo");
          pausedByLineupRef.current = false;
        }
      }
    };

    window.addEventListener("sw:lineup-hover", handler);
    return () => window.removeEventListener("sw:lineup-hover", handler);
  }, []);

  /* Khi đổi video đang xem, reset cờ vì đây là iframe mới */
  const handleVideoSelect = (i: number) => {
    pausedByLineupRef.current = false;
    setActive(i);
  };

  return (
    <section id="videos" className="py-24 px-6 bg-gradient-to-b from-black via-fuchsia-950/40 to-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <span className="uppercase tracking-[0.3em] text-pink-400">Thư viện video</span>
          <h2 className="text-5xl mt-3">Sống lại mọi khoảnh khắc</h2>
          <p className="mt-3 text-white/60">9 màn trình diễn live từ chính các nghệ sĩ trong lineup</p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-white/10 bg-white/5">
            <div className="aspect-video bg-black">
              <iframe
                ref={mainIframeRef}
                key={main.youtubeId}
                src={`https://www.youtube.com/embed/${main.youtubeId}?rel=0&enablejsapi=1`}
                title={main.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-5">
              <div className="text-sm text-fuchsia-300">{main.artist}</div>
              <h3 className="text-2xl mt-1">{main.title}</h3>
              <p className="text-white/60 mt-2">{main.desc}</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-fuchsia-500/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-fuchsia-500 scroll-smooth">
            {videos.map((v, i) => (
              <button
                key={v.youtubeId}
                onClick={() => handleVideoSelect(i)}
                className={`w-full flex gap-3 p-2 rounded-2xl text-left transition border ${
                  i === active
                    ? "bg-fuchsia-500/20 border-fuchsia-400/60"
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className="relative w-32 aspect-video rounded-xl overflow-hidden shrink-0">
                  <img src={yt(v.youtubeId)} alt={v.title} loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    {i === active ? (
                      <PauseCircle className="w-6 h-6 fill-white text-fuchsia-400" />
                    ) : (
                      <Play className="w-6 h-6 fill-white" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-fuchsia-300">{v.artist}</div>
                  <div className="text-sm truncate">{v.title}</div>
                  <div className="text-xs text-white/40 line-clamp-2 mt-1">{v.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-16 grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {videos.slice(0, 3).map((v) => (
            <div
              key={v.youtubeId + "-loop"}
              className="rounded-3xl aspect-video overflow-hidden border border-white/10 bg-black flex items-center justify-center"
            >
              <iframe
                src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${v.youtubeId}&controls=0&rel=0&modestbranding=1`}
                title={v.title}
                allow="autoplay; encrypted-media"
                loading="lazy"
                className="w-full h-full pointer-events-none scale-125"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}