import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Trang chủ", href: "#home",    id: "home"    },
  { label: "VR 360", href: "#vr",     id: "vr"      },
  { label: "Sơ đồ",      href: "#seatmap", id: "seatmap" },
  { label: "Hình ảnh",   href: "#gallery", id: "gallery" },
  { label: "Video",      href: "#videos",  id: "videos"  },
  { label: "Liên hệ",   href: "#contact", id: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState("home");

  /* ── Scroll awareness ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active section detection ── */
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.25, rootMargin: "-80px 0px 0px 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const navClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu { animation: slideDown 0.25s ease forwards; }

        @keyframes navGlow {
          0%,100% { text-shadow: 0 0 8px rgba(217,70,239,0.6); }
          50%      { text-shadow: 0 0 18px rgba(244,114,182,0.9); }
        }
        .logo-glow { animation: navGlow 3s ease-in-out infinite; }
      `}</style>

      <nav
        className={`fixed top-[3px] inset-x-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-2xl border-b border-fuchsia-500/25 shadow-[0_4px_30px_rgba(217,70,239,0.12)]"
            : "bg-black/30 backdrop-blur-md border-b border-white/8"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); navClick("#home"); }}
            className="logo-glow text-xl tracking-widest bg-gradient-to-r from-fuchsia-400 via-pink-300 to-amber-300 bg-clip-text text-transparent select-none pb-1 inline-block"
          >
            SOUNDWAVE
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex gap-8 text-sm">
            {links.map((l) => (
              <li key={l.id} className="relative">
                <a
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); navClick(l.href); }}
                  className={`transition-colors duration-200 pb-1 ${
                    active === l.id
                      ? "text-fuchsia-300"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {l.label}
                </a>
                {/* Active underline */}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-fuchsia-400 to-pink-400 transition-all duration-300 ${
                    active === l.id ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </li>
            ))}
          </ul>

          {/* Year badge */}
          <span className="hidden md:block px-3 py-1 rounded-full border border-fuchsia-400/30 bg-fuchsia-950/40 text-fuchsia-300 text-xs tracking-widest">
            2026
          </span>

          {/* Hamburger */}
          <button
            className="md:hidden text-white/80 hover:text-fuchsia-300 transition p-1"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="mobile-menu md:hidden bg-black/90 backdrop-blur-2xl border-t border-white/10 px-6 pb-6 pt-4 space-y-1">
            {links.map((l) => (
              <a
                key={l.id}
                href={l.href}
                onClick={(e) => { e.preventDefault(); navClick(l.href); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  active === l.id
                    ? "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-400/25"
                    : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                {active === l.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shrink-0" />
                )}
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}