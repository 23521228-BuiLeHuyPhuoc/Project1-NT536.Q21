import { Check, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "EARLY BIRD",
    price: "1.290.000đ",
    perks: ["Vé 3 ngày", "Khu vực General", "Quà lưu niệm"],
    hot: false,
  },
  {
    name: "VIP WAVE",
    price: "3.490.000đ",
    perks: ["Vé 3 ngày", "Khu VIP gần sân khấu", "Lounge riêng", "Đồ uống miễn phí"],
    hot: true,
  },
  {
    name: "BACKSTAGE",
    price: "6.990.000đ",
    perks: ["Mọi quyền lợi VIP", "Meet & Greet nghệ sĩ", "Tour backstage", "Ảnh kỷ niệm"],
    hot: false,
  },
];

export function Tickets() {
  return (
    <section className="py-24 px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="uppercase tracking-[0.3em] text-amber-300">Vé</span>
          <h2 className="text-5xl mt-3">Chọn trải nghiệm của bạn</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl p-8 border transition ${
                t.hot
                  ? "bg-gradient-to-b from-fuchsia-600 to-purple-800 border-fuchsia-300 scale-105 shadow-2xl shadow-fuchsia-500/40"
                  : "bg-white/5 border-white/10 hover:border-white/30"
              }`}
            >
              {t.hot && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-300 text-black px-4 py-1 rounded-full text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> PHỔ BIẾN NHẤT
                </div>
              )}
              <h3 className="text-2xl tracking-widest">{t.name}</h3>
              <div className="text-4xl mt-4">{t.price}</div>
              <ul className="mt-6 space-y-3">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2 items-start text-white/90">
                    <Check className="w-5 h-5 text-amber-300 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full py-3 rounded-full transition ${
                  t.hot
                    ? "bg-white text-purple-900 hover:bg-amber-300"
                    : "bg-fuchsia-500 hover:bg-fuchsia-400"
                }`}
              >
                Mua vé
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
