import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { motion } from "motion/react";
import {
  Compass, Move, Maximize2, Loader2, RotateCcw,
  Pause, Play, ZoomIn, ZoomOut, ChevronLeft, ChevronRight,
} from "lucide-react";

/* ── Scenes ─────────────────────────────────────────────────────────────── */
const SCENES = [
  {
    name: "Sân khấu chính",
    sub: "Stage A — Đêm khai mạc",
    url: "https://69edbb350e0199e8b4c12992.imgix.net/abc/15-taylor-swift-pop.jpg",
    thumb: "https://69edbb350e0199e8b4c12992.imgix.net/abc/15-taylor-swift-pop.jpg",
    accent: "#d946ef",
    hotspots: [
      { label: "🎤 Sân khấu chính", yaw: 0,   pitch: 0   },
      { label: "💡 LED Wall 240m²", yaw: 30,  pitch: 12  },
      { label: "🔊 Sound tower",    yaw: -25, pitch: -5  },
    ],
  },
  {
    name: "Biển fan rực lửa",
    sub: "Khán đài — SVĐ Mỹ Đình",
    url: "https://69edbb350e0199e8b4c12992.imgix.net/abcxyz/78135414b804800b0e93bd12a1bdc9a1.png",
    thumb: "https://69edbb350e0199e8b4c12992.imgix.net/abcxyz/78135414b804800b0e93bd12a1bdc9a1.png",
    accent: "#f59e0b",
    hotspots: [
      { label: "👥 60 000 khán giả", yaw: 0,   pitch: 0  },
      { label: "🔥 Pháo hoa",        yaw: -40, pitch: 20 },
      { label: "📸 Media pit",        yaw: 50,  pitch: -8 },
    ],
  },
  {
    name: "Hậu trường VIP",
    sub: "Backstage 360° — Pass Only",
    url: "https://images.unsplash.com/photo-1570489679487-936e2897d793?w=4000&q=85&auto=format",
    thumb: "https://images.unsplash.com/photo-1570489679487-936e2897d793?w=600&q=80&auto=format",
    accent: "#06b6d4",
    hotspots: [
      { label: "🎸 Phòng nghỉ nghệ sĩ", yaw: 0,   pitch: 0  },
      { label: "🎬 Đạo cụ sân khấu",    yaw: 60,  pitch: 5  },
      { label: "🍽️  Catering VIP",       yaw: -50, pitch: -5 },
    ],
  },
];

/* ── Compass directions ──────────────────────────────────────────────────── */
const COMPASS_DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export function VR360() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const rendererRef   = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef      = useRef<THREE.Scene | null>(null);
  const cameraRef     = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereRef     = useRef<THREE.Mesh | null>(null);
  const loaderRef     = useRef(new THREE.TextureLoader());
  const animRef       = useRef<number | null>(null);
  const pointerRef    = useRef<{ x: number; y: number } | null>(null);
  const autoRef       = useRef(true);
  const touchRef      = useRef<{ x: number; y: number } | null>(null);
  const sceneIdxRef   = useRef(0);

  const [sceneIdx,   setSceneIdx  ] = useState(0);
  const [loading,    setLoading   ] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [heading,    setHeading   ] = useState(0);   // 0-359
  const [fov,        setFov       ] = useState(75);
  const [hotspots,   setHotspots  ] = useState<{ label: string; x: number; y: number; visible: boolean }[]>([]);

  /* ── Sync sceneIdxRef ──────────────────────────────────────────────────── */
  useEffect(() => { sceneIdxRef.current = sceneIdx; }, [sceneIdx]);

  /* ── Three.js init (once) ──────────────────────────────────────────────── */
  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const W = container.clientWidth;
    const H = container.clientHeight || 520;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    /* Scene */
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    /* Camera — at origin, YXZ order for yaw/pitch */
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.01, 1000);
    camera.rotation.order = "YXZ";
    cameraRef.current = camera;

    /* Sphere (inside-out via BackSide) */
    const geo = new THREE.SphereGeometry(10, 64, 32);
    const mat = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    sphereRef.current = mesh;

    /* Resize */
    const onResize = () => {
      const W2 = container.clientWidth;
      const H2 = container.clientHeight || 520;
      renderer.setSize(W2, H2);
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    /* Animation loop */
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);

      /* Auto-rotate */
      if (autoRef.current) camera.rotation.y += 0.0008;

      /* Update heading state (throttled via requestAnimationFrame) */
      const deg = ((-camera.rotation.y * 180) / Math.PI + 360) % 360;
      setHeading(Math.round(deg));

      /* Project hotspots to 2D */
      const scene0 = SCENES[sceneIdxRef.current];
      const W3 = container.clientWidth;
      const H3 = container.clientHeight || 520;
      const projected = scene0.hotspots.map((h) => {
        const yawRad   = (h.yaw   * Math.PI) / 180;
        const pitchRad = (h.pitch * Math.PI) / 180;
        const vec = new THREE.Vector3(
          -Math.sin(yawRad) * Math.cos(pitchRad),
           Math.sin(pitchRad),
          -Math.cos(yawRad) * Math.cos(pitchRad),
        ).normalize().multiplyScalar(9.5);
        vec.project(camera);
        return {
          label: h.label,
          x: ((vec.x + 1) / 2) * W3,
          y: ((1 - vec.y) / 2) * H3,
          visible: vec.z < 1,
        };
      });
      setHotspots(projected);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Load texture ──────────────────────────────────────────────────────── */
  const loadScene = useCallback((idx: number) => {
    setLoading(true);
    loaderRef.current.load(
      SCENES[idx].url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        if (sphereRef.current) {
          const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
          mat.map = tex;
          mat.needsUpdate = true;
        }
        setLoading(false);
      },
      undefined,
      () => setLoading(false),
    );
    if (cameraRef.current) {
      cameraRef.current.rotation.y = 0;
      cameraRef.current.rotation.x = 0;
    }
  }, []);

  useEffect(() => { loadScene(sceneIdx); }, [sceneIdx, loadScene]);

  /* ── Sync FOV ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!cameraRef.current) return;
    cameraRef.current.fov = fov;
    cameraRef.current.updateProjectionMatrix();
  }, [fov]);

  /* ── Sync autoRotate ref ───────────────────────────────────────────────── */
  useEffect(() => { autoRef.current = autoRotate; }, [autoRotate]);

  /* ── Pointer events ────────────────────────────────────────────────────── */
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pointerRef.current = { x: e.clientX, y: e.clientY };
    setAutoRotate(false);
    autoRef.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointerRef.current || !cameraRef.current) return;
    const dx = e.clientX - pointerRef.current.x;
    const dy = e.clientY - pointerRef.current.y;
    pointerRef.current = { x: e.clientX, y: e.clientY };
    cameraRef.current.rotation.y -= dx * 0.003;
    cameraRef.current.rotation.x -= dy * 0.003;
    cameraRef.current.rotation.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, cameraRef.current.rotation.x));
  };
  const onPointerUp = () => { pointerRef.current = null; };

  /* ── Touch events ──────────────────────────────────────────────────────── */
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setAutoRotate(false); autoRef.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current || !cameraRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchRef.current.x;
    const dy = e.touches[0].clientY - touchRef.current.y;
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    cameraRef.current.rotation.y -= dx * 0.004;
    cameraRef.current.rotation.x -= dy * 0.004;
    cameraRef.current.rotation.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, cameraRef.current.rotation.x));
  };
  const onTouchEnd = () => { touchRef.current = null; };

  /* ── Scroll to zoom ────────────────────────────────────────────────────── */
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setFov((f) => Math.max(40, Math.min(100, f + e.deltaY * 0.04)));
  };

  /* ── Controls ──────────────────────────────────────────────────────────── */
  const reset = () => {
    if (cameraRef.current) { cameraRef.current.rotation.y = 0; cameraRef.current.rotation.x = 0; }
    setFov(75); setAutoRotate(true);
  };
  const goFullscreen = () => containerRef.current?.requestFullscreen?.();

  const compassDeg  = (heading + 360) % 360;
  const compassDir  = COMPASS_DIRS[Math.round(compassDeg / 45) % 8];

  return (
    <section id="vr" className="relative py-20 px-4 md:px-6 bg-gradient-to-b from-black via-fuchsia-950/20 to-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <span className="uppercase tracking-[0.3em] text-cyan-300 flex items-center justify-center gap-2 text-sm">
            <Compass className="w-4 h-4" /> Thực tế ảo 360°
          </span>
          <h2 className="text-4xl md:text-5xl mt-3 pb-2 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
          Bước Vào Lễ Hội
          </h2>
          <p className="mt-3 text-white/50 text-sm">
            Kéo chuột để nhìn xung quanh · Cuộn để zoom · Toàn màn hình để đắm chìm
          </p>
        </motion.div>

        {/* ── Viewer ─────────────────────────────────────────────────────── */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* Canvas wrapper */}
          <div
            ref={containerRef}
            className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(217,70,239,0.2)] bg-black cursor-grab active:cursor-grabbing select-none touch-none"
            style={{ height: "520px" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onWheel={onWheel}
          >
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/80 backdrop-blur-sm">
                <Loader2 className="w-9 h-9 text-fuchsia-400 animate-spin" />
                <span className="text-sm text-white/60">Đang tải môi trường 360°…</span>
              </div>
            )}

            {/* Hotspot labels */}
            {!loading && hotspots.map((h, i) =>
              h.visible ? (
                <div
                  key={i}
                  className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: h.x, top: h.y }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur border border-white/20 text-xs whitespace-nowrap text-white/90 shadow-lg">
                      {h.label}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-white/80 border border-white/30 animate-pulse" />
                  </div>
                </div>
              ) : null
            )}

            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)" }}
            />

            {/* TOP HUD */}
            {!loading && (
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                {/* LIVE badge */}
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur border border-white/15 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  LIVE 360°
                </div>

                {/* Scene label */}
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur border border-white/15 text-xs">
                  {SCENES[sceneIdx].sub}
                </div>

                {/* Compass */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur border border-white/15 text-xs">
                  <span
                    className="inline-block"
                    style={{ transform: `rotate(${compassDeg}deg)`, fontSize: "10px" }}
                  >▲</span>
                  <span className="text-cyan-300">{compassDir}</span>
                  <span className="text-white/50">{compassDeg}°</span>
                </div>
              </div>
            )}

            {/* BOTTOM HUD */}
            {!loading && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 flex-wrap justify-center px-4">
                {/* Drag hint */}
                <div className="px-3 py-2 rounded-full bg-black/60 backdrop-blur border border-white/15 text-xs flex items-center gap-2">
                  <Move className="w-3.5 h-3.5 text-cyan-300" />
                  Kéo để xoay
                </div>

                {/* Zoom */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); setFov((f) => Math.max(40, f - 8)); }}
                  className="pointer-events-auto px-2.5 py-2 rounded-full bg-black/60 hover:bg-white/10 backdrop-blur border border-white/15 text-xs flex items-center gap-1 transition"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); setFov((f) => Math.min(100, f + 8)); }}
                  className="pointer-events-auto px-2.5 py-2 rounded-full bg-black/60 hover:bg-white/10 backdrop-blur border border-white/15 text-xs flex items-center gap-1 transition"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                {/* Auto-rotate */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); setAutoRotate((a) => !a); }}
                  className="pointer-events-auto px-3 py-2 rounded-full bg-black/60 hover:bg-white/10 backdrop-blur border border-white/15 text-xs flex items-center gap-2 transition"
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {autoRotate ? "Dừng" : "Tự quay"}
                </button>

                {/* Reset */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="pointer-events-auto px-3 py-2 rounded-full bg-black/60 hover:bg-white/10 backdrop-blur border border-white/15 text-xs flex items-center gap-2 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>

                {/* Fullscreen */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); goFullscreen(); }}
                  className="pointer-events-auto px-3 py-2 rounded-full bg-fuchsia-500/80 hover:bg-fuchsia-500 backdrop-blur border border-white/20 text-xs flex items-center gap-2 transition"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Toàn màn hình
                </button>
              </div>
            )}

            {/* FOV label */}
            {!loading && (
              <div className="absolute bottom-4 right-4 z-20 pointer-events-none text-xs text-white/30">
                FOV {fov}°
              </div>
            )}
          </div>

          {/* Scene switcher with nav arrows */}
          <div className="mt-5 relative">
            <button
              onClick={() => setSceneIdx((i) => (i - 1 + SCENES.length) % SCENES.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-black/80 border border-white/15 flex items-center justify-center hover:bg-white/10 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSceneIdx((i) => (i + 1) % SCENES.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-black/80 border border-white/15 flex items-center justify-center hover:bg-white/10 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-3 gap-3 px-4">
              {SCENES.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setSceneIdx(i)}
                  className={`group relative aspect-video rounded-2xl overflow-hidden border transition-all duration-300 ${
                    i === sceneIdx
                      ? "border-fuchsia-400/80 ring-2 ring-fuchsia-400/30 scale-[1.02]"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  {/* Thumbnail */}
                  <img
                    src={s.thumb}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  {/* 360° stamp */}
                  <div
                    className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-[9px] border font-mono"
                    style={{
                      background: `${s.accent}22`,
                      borderColor: `${s.accent}55`,
                      color: s.accent,
                    }}
                  >
                    360°
                  </div>
                  {/* Label */}
                  <div className="absolute inset-x-0 bottom-0 p-2 text-left">
                    <div className="text-[10px] text-cyan-300 truncate">{s.sub}</div>
                    <div className="text-xs truncate">{s.name}</div>
                  </div>
                  {/* Active badge */}
                  {i === sceneIdx && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-fuchsia-500 text-[9px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      ĐANG XEM
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info row */}
          <motion.div
            className="mt-6 grid sm:grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}