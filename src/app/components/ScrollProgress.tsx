import { motion, useScroll, useSpring, useTransform } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const width = useTransform(springProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px] bg-white/5 backdrop-blur-md">
      <motion.div
        className="h-full relative flex items-center justify-end rounded-r-full"
        style={{
          width,
          background: "linear-gradient(90deg, transparent, rgba(217,70,239,0.6) 50%, #f59e0b)",
          boxShadow: "0 0 15px rgba(245,158,11,0.4)",
        }}
      >
        <div className="absolute right-0 w-6 h-6 bg-amber-500 rounded-full blur-[8px] opacity-80" />
        <div className="absolute right-0 w-[6px] h-[6px] bg-white rounded-full shadow-[0_0_12px_2px_#f59e0b]" />
      </motion.div>
    </div>
  );
}