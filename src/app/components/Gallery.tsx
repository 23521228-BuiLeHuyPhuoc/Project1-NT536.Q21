import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const photos = [
  { src:"https://69edbb350e0199e8b4c12992.imgix.net/be/beyoncee.gif",  title:"Đêm 1 — Khai mạc",       sub:"Beyoncé & Rihanna" },
  { src:"https://69edbb350e0199e8b4c12992.imgix.net/ri/rihanna.gif",  title:"Biển fan rực sáng",       sub:"Hơn 40,000 khán giả"         },
  { src:"https://69edbb350e0199e8b4c12992.imgix.net/ju/justin.gif",  title:"Pháo hoa khai màn",       sub:"21.08.2026"                   },
  { src:"https://69edbb350e0199e8b4c12992.imgix.net/mmm/maria.gif",  title:"Đèn vàng huyền ảo",       sub:"Stage A"                      },
  { src:"https://69edbb350e0199e8b4c12992.imgix.net/aded/ade.gif",  title:"Đêm 2 — Ballad",          sub:"Adele & Taylor Swift"        },
  { src:"https://69edbb350e0199e8b4c12992.imgix.net/g%C3%ACd/6f5c0b81de5c2e286ea12a6935b20168.gif",  title:"Đêm 3 — Closing Night",   sub:"Mariah Carey & Justin Bieber"        },
  { src:"https://69edbb350e0199e8b4c12992.imgix.net/ssssttt/st.gif",  title:"Hiệu ứng laser",          sub:"LED 360°"                     },
  { src:"https://69edbb350e0199e8b4c12992.imgix.net/stage/stage.gif",  title:"Toàn cảnh sân vận động",  sub:"SVĐ Mỹ Đình"                  },
];

export function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length));
  const next = () => setLightbox((i) => (i === null ? 0 : (i + 1) % photos.length));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft")  prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape")     setLightbox(null);
  };

  return (
    <>
      <section id="gallery" className="py-24 px-6 bg-gradient-to-b from-black via-purple-950 to-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <span className="uppercase tracking-[0.3em] text-fuchsia-400">Khoảnh khắc</span>
            <h2 className="text-5xl mt-3 pb-2 bg-gradient-to-r from-pink-300 to-amber-200 bg-clip-text text-transparent">
              Những đêm bùng cháy
            </h2>
            <p className="mt-3 text-white/55">Hình ảnh thực tế từ các lễ hội âm nhạc — gợi cảm hứng cho 3 đêm SoundWave 2026</p>
            <p className="mt-1 text-white/35 text-xs flex items-center justify-center gap-1">
              <ZoomIn className="w-3 h-3" /> Bấm vào ảnh để xem toàn màn hình
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
            {photos.map((p, i) => (
              <motion.div
                key={p.src}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                onClick={() => setLightbox(i)}
                className={`relative overflow-hidden rounded-2xl group cursor-zoom-in ${
                  i === 0 || i === 5 ? "md:row-span-2 md:col-span-2" : ""
                }`}
              >
                <ImageWithFallback
                  src={p.src}
                  alt={p.title}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                {/* Zoom icon */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <ZoomIn className="w-4 h-4 text-white/80" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-1 group-hover:translate-y-0 transition duration-300">
                  <div className="text-xs uppercase tracking-widest text-fuchsia-300">{p.sub}</div>
                  <div className="text-base text-white">{p.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.93)", backdropFilter: "blur(12px)" }}
            onClick={() => setLightbox(null)}
            onKeyDown={handleKey}
            tabIndex={0}
          >
            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative max-w-5xl w-full mx-6"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[lightbox].src.replace(/w=\d+/, "w=1600")}
                alt={photos[lightbox].title}
                className="w-full rounded-2xl object-contain max-h-[80vh]"
                style={{ boxShadow: "0 0 60px rgba(217,70,239,0.25)" }}
              />
              {/* Caption */}
              <div className="mt-4 text-center">
                <div className="text-xs uppercase tracking-widest text-fuchsia-300">{photos[lightbox].sub}</div>
                <div className="text-xl text-white">{photos[lightbox].title}</div>
              </div>
            </motion.div>

            {/* Controls */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center border border-white/15 transition"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center border border-white/15 transition"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/60 backdrop-blur flex items-center justify-center border border-white/15 transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  className={`h-1.5 rounded-full transition-all ${i === lightbox ? "w-8 bg-fuchsia-400" : "w-4 bg-white/30"}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}