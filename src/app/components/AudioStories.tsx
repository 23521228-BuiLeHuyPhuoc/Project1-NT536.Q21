import { useRef, useState } from "react";
import { Play, Pause, Mic } from "lucide-react";

const episodes = [
  {
    title: "Tập 1 — Giấc mơ SoundWave",
    speaker: "MC Hồng Phúc",
    duration: "3:42",
    desc: "Hành trình từ ý tưởng tới sân khấu lớn nhất Đông Nam Á.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    title: "Tập 2 — Phỏng vấn Beyoncé & Rihanna",
    speaker: "Phóng viên Linh Đan",
    duration: "4:15",
    desc: "Cuộc trò chuyện độc quyền với hai nghệ sĩ đêm khai mạc 21.08.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    title: "Tập 3 — Hậu trường Adele & Taylor Swift",
    speaker: "Đạo diễn âm thanh",
    duration: "5:01",
    desc: "Câu chuyện chuẩn bị đêm 2 — từ 'Hello' tới 'Blank Space'.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
  {
    title: "Tập 4 — Closing Night: Mariah Carey & Justin Bieber",
    speaker: "Khán giả Việt",
    duration: "6:30",
    desc: "Tiếng nói fan và preview đêm 3 — whistle-note và dance-pop khép màn.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  },
];

export function AudioStories() {
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = (i: number, src: string) => {
    if (!audioRef.current) audioRef.current = new Audio();
    if (playing === i) {
      audioRef.current.pause();
      setPlaying(null);
    } else {
      audioRef.current.src = src;
      audioRef.current.play();
      setPlaying(i);
    }
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black to-purple-950/60 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="uppercase tracking-[0.3em] text-amber-300 flex items-center justify-center gap-2">
            <Mic className="w-4 h-4" /> Podcast & Lời dẫn
          </span>
          <h2 className="text-5xl mt-3">Nghe câu chuyện đằng sau sân khấu</h2>
          <p className="mt-3 text-white/60">Bốn tập podcast với giọng nói thật từ ekip và nghệ sĩ</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {episodes.map((e, i) => (
            <div
              key={e.title}
              className="flex gap-4 p-5 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <button
                onClick={() => toggle(i, e.src)}
                className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-amber-300 flex items-center justify-center shadow-lg shadow-fuchsia-500/40 hover:scale-105 transition"
              >
                {playing === i ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white ml-1" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-fuchsia-300">
                  <span>{e.speaker}</span>
                  <span>•</span>
                  <span>{e.duration}</span>
                </div>
                <h3 className="text-xl mt-1">{e.title}</h3>
                <p className="text-sm text-white/60 mt-1">{e.desc}</p>
                {playing === i && (
                  <div className="mt-3 flex gap-1 items-end h-5">
                    {[...Array(40)].map((_, k) => (
                      <span
                        key={k}
                        className="flex-1 bg-gradient-to-t from-fuchsia-500 to-amber-300 rounded-full animate-pulse"
                        style={{
                          height: `${20 + Math.random() * 80}%`,
                          animationDelay: `${k * 40}ms`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
