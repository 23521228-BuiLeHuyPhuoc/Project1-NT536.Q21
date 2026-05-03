import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let rafId: number;
    let mx = 0, my = 0;
    let cx = 0, cy = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`;
        dotRef.current.style.top = `${my}px`;
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      cx = lerp(cx, mx, 0.12);
      cy = lerp(cy, my, 0.12);
      if (glowRef.current) {
        glowRef.current.style.left = `${cx}px`;
        glowRef.current.style.top = `${cy}px`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    rafId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Large ambient glow */}
      <div
        ref={glowRef}
        className="fixed z-[150] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(217,70,239,0.07) 0%, rgba(244,114,182,0.04) 40%, transparent 70%)",
        }}
      />
      {/* Sharp dot */}
      <div
        ref={dotRef}
        className="fixed z-[151] pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "6px",
          height: "6px",
          background: "rgba(217,70,239,0.9)",
          boxShadow: "0 0 8px rgba(217,70,239,1)",
        }}
      />
    </>
  );
}
