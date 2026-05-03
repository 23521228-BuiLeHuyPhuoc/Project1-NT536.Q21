import { motion } from "motion/react";
import { Mail, Users, GraduationCap } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-black text-white overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="uppercase tracking-[0.3em] text-fuchsia-400">Liên hệ</span>
          <h2 className="text-5xl mt-3 pb-2 bg-gradient-to-r from-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            Liên hệ Ban Tổ chức
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Đây là dự án đa phương tiện phi thương mại do nhóm sinh viên thực hiện với chủ đề
            <span className="text-fuchsia-300"> SoundWave Concert 2026</span>.
            Mọi thắc mắc hoặc góp ý vui lòng liên hệ trực tiếp qua email ban tổ chức.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-400/30 flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-fuchsia-300" />
            </div>
            <h3 className="text-lg text-white/90 mb-2">Email</h3>
            <a
              href="mailto:soundwave.org@student.edu.vn"
              className="text-fuchsia-300 hover:text-fuchsia-200 transition break-all"
            >
              soundwave.org@student.edu.vn
            </a>
          </div>

          <div className="rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-400/30 flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-fuchsia-300" />
            </div>
            <h3 className="text-lg text-white/90 mb-2">Ban Tổ chức</h3>
            <p className="text-white/60">
              Nhóm Sinh viên<br />Truyền thông Đa phương tiện
            </p>
          </div>

          <div className="rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-400/30 flex items-center justify-center mb-4">
              <GraduationCap className="w-7 h-7 text-fuchsia-300" />
            </div>
            <h3 className="text-lg text-white/90 mb-2">Dự án</h3>
            <p className="text-white/60">
              Bài tập Môn học<br />Phi thương mại
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-white/40">
            * Lưu ý: Website này là dự án mô phỏng phục vụ mục đích học tập. Không có chức năng bán vé hoặc giao dịch thật.
          </p>
        </motion.div>
      </div>
    </section>
  );
}