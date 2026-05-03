import { Instagram, Youtube, Facebook, Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        <div>
          <div className="text-2xl pb-1 inline-block bg-gradient-to-r from-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            SOUNDWAVE
          </div>
          <p className="mt-3 text-sm text-white/50">
            Sản phẩm đa phương tiện — bài tập nhóm môn Truyền thông đa phương tiện.
            Chủ đề: lễ hội âm nhạc giả định SoundWave Concert 2026.
          </p>
        </div>
        <div>
          <h4 className="mb-3">Nội dung</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="#vr" className="hover:text-fuchsia-300">Thực tế ảo 360°</a></li>
            <li><a href="#gallery" className="hover:text-fuchsia-300">Thư viện hình ảnh</a></li>
            <li><a href="#videos" className="hover:text-fuchsia-300">Thư viện video</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3">Về dự án</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Kịch bản & biên tập</li>
            <li>Dựng cảnh & hậu kỳ</li>
            <li>Thiết kế giao diện</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3">Kết nối</h4>
          <div className="flex gap-3">
            {[Instagram, Youtube, Facebook, Music2].map((Icon, i) => (
              <a
                key={i}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-fuchsia-500 hover:border-fuchsia-500 transition cursor-pointer"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/40">
            Hình ảnh, video, âm thanh trong dự án thuộc về các nghệ sĩ/tác giả gốc,
            được sử dụng cho mục đích học tập phi thương mại.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 text-sm text-white/40 text-center">
        © 2026 · Bài tập nhóm SoundWave · Sản phẩm phi thương mại phục vụ học tập.
      </div>
    </footer>
  );
}