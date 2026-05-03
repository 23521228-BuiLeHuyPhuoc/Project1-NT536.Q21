import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Shape =
  | { kind: "rect"; x: number; y: number; w: number; h: number }
  | { kind: "polygon"; points: string };

interface Zone {
  id: string;
  name: string;
  labelLines?: string[]; // Multi-line tspan rendering
  shape: Shape;
  color: string;
  hoverColor: string;
  seats: number;
  price: string;
  type: "Đứng" | "Ngồi";
  group?: "wing-tl" | "wing-tr" | "wing-bl" | "wing-br";
  fontSize?: number;
  labelRotate?: number;
  labelOffsetY?: number;
}

// === Bảng màu các loài Hoa ===
// Ngồi → Tone lạnh / Pastel mát   |   Đứng → Tone nóng rực
const FLOWER = {
  // ---- Ngồi (tone lạnh) ----
  oaiHuong:    { color: "#c4b5fd", hoverColor: "#ddd6fe" }, // tím pastel
  anhDao:      { color: "#bae6fd", hoverColor: "#e0f2fe" }, // xanh lam nhạt
  tuDinhHuong: { color: "#5eead4", hoverColor: "#99f6e4" }, // teal
  nhai:        { color: "#60a5fa", hoverColor: "#93c5fd" }, // xanh dương
  tra:         { color: "#93c5fd", hoverColor: "#bfdbfe" }, // xanh lam nhạt
  camChuong:   { color: "#a78bfa", hoverColor: "#c4b5fd" }, // tím pastel trung
  ly:          { color: "#67e8f9", hoverColor: "#a5f3fc" }, // cyan
  su:          { color: "#6ee7b7", hoverColor: "#a7f3d0" }, // bạc hà
  thachThao:   { color: "#818cf8", hoverColor: "#a5b4fc" }, // indigo pastel

  // ---- Đứng (tone nóng rực) ----
  senVang:     { color: "#facc15", hoverColor: "#fde047" }, // vàng rực (Siêu VIP)
  sen:         { color: "#ec4899", hoverColor: "#f472b6" }, // hồng đậm
  phuong:      { color: "#b91c1c", hoverColor: "#dc2626" }, // đỏ rực
  hong:        { color: "#dc2626", hoverColor: "#ef4444" }, // đỏ
  mai:         { color: "#ea580c", hoverColor: "#f97316" }, // cam
  huongDuong:  { color: "#d97706", hoverColor: "#f59e0b" }, // cam-vàng

  stage: { color: "#1f2937", hoverColor: "#1f2937" },
};

const zones: Zone[] = [
  // ===== HÀNG NGỒI TRÊN (tone lạnh) =====
  { id: "nhahat1", name: "Oải Hương 1", labelLines: ["Oải Hương", "1"], shape: { kind: "rect", x: 250, y: 160, w: 248, h: 50 }, ...FLOWER.oaiHuong, seats: 220, price: "600.000 VNĐ", type: "Ngồi" },
  { id: "nhahat2", name: "Oải Hương 2", labelLines: ["Oải Hương", "2"], shape: { kind: "rect", x: 502, y: 160, w: 248, h: 50 }, ...FLOWER.oaiHuong, seats: 220, price: "600.000 VNĐ", type: "Ngồi" },

  { id: "xr1", name: "Anh Đào 1", labelLines: ["Anh Đào", "1"], shape: { kind: "rect", x: 250, y: 214, w: 248, h: 46 }, ...FLOWER.anhDao, seats: 200, price: "750.000 VNĐ", type: "Ngồi" },
  { id: "xr2", name: "Anh Đào 2", labelLines: ["Anh Đào", "2"], shape: { kind: "rect", x: 502, y: 214, w: 248, h: 46 }, ...FLOWER.anhDao, seats: 200, price: "750.000 VNĐ", type: "Ngồi" },

  { id: "ss1", name: "Tigon 1", labelLines: ["Tigon", "1"], shape: { kind: "rect", x: 250, y: 264, w: 248, h: 46 }, ...FLOWER.tuDinhHuong, seats: 180, price: "850.000 VNĐ", type: "Ngồi", fontSize: 11 },
  { id: "ss2", name: "Tigon 2", labelLines: ["Tigon", "2"], shape: { kind: "rect", x: 502, y: 264, w: 248, h: 46 }, ...FLOWER.tuDinhHuong, seats: 180, price: "850.000 VNĐ", type: "Ngồi", fontSize: 11 },

  { id: "bpp1", name: "Nhài 1", shape: { kind: "rect", x: 250, y: 314, w: 248, h: 50 }, ...FLOWER.nhai, seats: 220, price: "1.100.000 VNĐ", type: "Ngồi" },
  { id: "bpp2", name: "Nhài 2", shape: { kind: "rect", x: 502, y: 314, w: 248, h: 50 }, ...FLOWER.nhai, seats: 220, price: "1.100.000 VNĐ", type: "Ngồi" },

  // ===== HÀNG TRÀ (FOH đã xóa — lối đi trống ở giữa) =====
  {
    id: "dinhnoc", name: "Trà 1",
    shape: { kind: "polygon", points: "250,368 463,368 463,416 290,416" },
    ...FLOWER.tra, seats: 140, price: "1.200.000 VNĐ", type: "Ngồi",
  },
  {
    id: "kichtran", name: "Trà 2",
    shape: { kind: "polygon", points: "537,368 750,368 710,416 537,416" },
    ...FLOWER.tra, seats: 140, price: "1.200.000 VNĐ", type: "Ngồi",
  },

  // ===== FLOOR (Đứng — tone nóng rực) — kẹp 2 bên Runway =====
  {
    id: "nhatre1", name: "Hướng Dương 1", labelLines: ["Hướng Dương", "1"],
    shape: { kind: "polygon", points: "160,420 260,420 260,620 140,620" },
    ...FLOWER.huongDuong, seats: 240, price: "1.700.000 VNĐ", type: "Đứng", fontSize: 11,
  },
  { id: "mut1", name: "Mai 1", shape: { kind: "rect", x: 264, y: 420, w: 100, h: 200 }, ...FLOWER.mai, seats: 220, price: "1.800.000 VNĐ", type: "Đứng" },
  { id: "cm1", name: "Hồng 1", shape: { kind: "rect", x: 368, y: 420, w: 100, h: 200 }, ...FLOWER.hong, seats: 240, price: "2.000.000 VNĐ", type: "Đứng" },

  // RUNWAY → Sen (hồng đậm)
  { id: "runway", name: "Sen", shape: { kind: "rect", x: 475, y: 420, w: 50, h: 200 }, ...FLOWER.sen, seats: 60, price: "5.000.000 VNĐ", type: "Đứng", labelRotate: -90 },

  { id: "cm2", name: "Hồng 2", shape: { kind: "rect", x: 532, y: 420, w: 100, h: 200 }, ...FLOWER.hong, seats: 240, price: "2.000.000 VNĐ", type: "Đứng" },
  { id: "mut2", name: "Mai 2", shape: { kind: "rect", x: 636, y: 420, w: 100, h: 200 }, ...FLOWER.mai, seats: 220, price: "1.800.000 VNĐ", type: "Đứng" },
  {
    id: "nhatre2", name: "Hướng Dương 2", labelLines: ["Hướng Dương", "2"],
    shape: { kind: "polygon", points: "740,420 840,420 860,620 740,620" },
    ...FLOWER.huongDuong, seats: 240, price: "1.700.000 VNĐ", type: "Đứng", fontSize: 11,
  },

  // Sen Vàng (Siêu VIP — trên runway)
  { id: "calon", name: "Sen Vàng", labelLines: ["Sen", "Vàng"], shape: { kind: "rect", x: 478, y: 500, w: 44, h: 50 }, ...FLOWER.senVang, seats: 20, price: "8.000.000 VNĐ", type: "Đứng", fontSize: 9 },

  // ===== STAGE =====
  {
    id: "stage", name: "STAGE",
    shape: { kind: "polygon", points: "200,760 800,760 800,720 700,695 700,624 300,624 300,695 200,720" },
    ...FLOWER.stage, seats: 0, price: "—", type: "Đứng", fontSize: 22, labelOffsetY: 60,
  },

  // Phượng (đỏ rực — sát sân khấu)
  { id: "xhtd1", name: "Phượng 1", labelLines: ["Phượng", "1"], shape: { kind: "rect", x: 446, y: 632, w: 50, h: 36 }, ...FLOWER.phuong, seats: 60, price: "3.500.000 VNĐ", type: "Đứng", fontSize: 10 },
  { id: "xhtd2", name: "Phượng 2", labelLines: ["Phượng", "2"], shape: { kind: "rect", x: 504, y: 632, w: 50, h: 36 }, ...FLOWER.phuong, seats: 60, price: "3.500.000 VNĐ", type: "Đứng", fontSize: 10 },
  { id: "xhtd3", name: "Phượng 3", labelLines: ["Phượng", "3"], shape: { kind: "rect", x: 446, y: 672, w: 50, h: 36 }, ...FLOWER.phuong, seats: 60, price: "3.500.000 VNĐ", type: "Đứng", fontSize: 10 },
  { id: "xhtd4", name: "Phượng 4", labelLines: ["Phượng", "4"], shape: { kind: "rect", x: 504, y: 672, w: 50, h: 36 }, ...FLOWER.phuong, seats: 60, price: "3.500.000 VNĐ", type: "Đứng", fontSize: 10 },

  // ===== CÁNH GÓC TRÁI — TRÊN =====
  { id: "tinhhoa1", name: "Lài 1", labelLines: ["Lài", "1"], shape: { kind: "rect", x: 95, y: 250, w: 70, h: 60 }, ...FLOWER.camChuong, seats: 100, price: "1.500.000 VNĐ", type: "Ngồi", group: "wing-tl", fontSize: 10 },
  { id: "tinhhoa2", name: "Lài 2", labelLines: ["Lài", "2"], shape: { kind: "rect", x: 95, y: 314, w: 70, h: 60 }, ...FLOWER.camChuong, seats: 100, price: "1.500.000 VNĐ", type: "Ngồi", group: "wing-tl", fontSize: 10 },
  { id: "xvip1", name: "Ly 1", shape: { kind: "rect", x: 169, y: 250, w: 18, h: 124 }, ...FLOWER.ly, seats: 32, price: "3.500.000 VNĐ", type: "Ngồi", group: "wing-tl", fontSize: 9, labelRotate: -90 },

  // ===== CÁNH GÓC PHẢI — TRÊN =====
  { id: "thieunhi1", name: "Nhài 3", labelLines: ["Nhài", "3"], shape: { kind: "rect", x: 835, y: 250, w: 70, h: 60 }, ...FLOWER.camChuong, seats: 100, price: "1.500.000 VNĐ", type: "Ngồi", group: "wing-tr", fontSize: 10 },
  { id: "thieunhi2", name: "Nhài 4", labelLines: ["Nhài", "4"], shape: { kind: "rect", x: 835, y: 314, w: 70, h: 60 }, ...FLOWER.camChuong, seats: 100, price: "1.500.000 VNĐ", type: "Ngồi", group: "wing-tr", fontSize: 10 },
  { id: "xvip2", name: "Ly 2", shape: { kind: "rect", x: 813, y: 250, w: 18, h: 124 }, ...FLOWER.ly, seats: 32, price: "3.500.000 VNĐ", type: "Ngồi", group: "wing-tr", fontSize: 9, labelRotate: 90 },

  // ===== CÁNH GÓC TRÁI — DƯỚI =====
  { id: "taisinh", name: "Sứ 1", shape: { kind: "rect", x: 90, y: 510, w: 70, h: 70 }, ...FLOWER.su, seats: 80, price: "1.000.000 VNĐ", type: "Ngồi", group: "wing-bl" },
  { id: "kaka", name: "Thạch Thảo 1", labelLines: ["Thạch Thảo", "1"], shape: { kind: "rect", x: 90, y: 584, w: 70, h: 70 }, ...FLOWER.thachThao, seats: 80, price: "1.000.000 VNĐ", type: "Ngồi", group: "wing-bl", fontSize: 10 },

  // ===== CÁNH GÓC PHẢI — DƯỚI =====
  { id: "damme", name: "Sứ 2", shape: { kind: "rect", x: 840, y: 510, w: 70, h: 70 }, ...FLOWER.su, seats: 80, price: "1.000.000 VNĐ", type: "Ngồi", group: "wing-br" },
  { id: "nguhanh", name: "Thạch Thảo 2", labelLines: ["Thạch Thảo", "2"], shape: { kind: "rect", x: 840, y: 584, w: 70, h: 70 }, ...FLOWER.thachThao, seats: 80, price: "1.000.000 VNĐ", type: "Ngồi", group: "wing-br", fontSize: 10 },
];

const groupTransforms: Record<string, string> = {
  "wing-tl": "rotate(-45 230 350)",
  "wing-tr": "rotate(45 770 350)",
  "wing-bl": "rotate(-45 200 600)",
  "wing-br": "rotate(45 800 600)",
};

function shapeCenter(shape: Shape): { x: number; y: number } {
  if (shape.kind === "rect") {
    return { x: shape.x + shape.w / 2, y: shape.y + shape.h / 2 };
  }
  const pts = shape.points.split(/\s+/).map((p) => p.split(",").map(Number));
  const sx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const sy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return { x: sx, y: sy };
}

// Tone lạnh (Ngồi) → chữ đậm tối; tone nóng (Đứng) → chữ trắng
function labelColorFor(zone: Zone): string {
  if (zone.id === "stage") return "#ffffff";
  return zone.type === "Ngồi" ? "#0f172a" : "#ffffff";
}

interface ZoneNodeProps {
  zone: Zone;
  isHovered: boolean;
  onMove: (zone: Zone, e: React.MouseEvent) => void;
  onLeave: () => void;
}

function ZoneNode({ zone, isHovered, onMove, onLeave }: ZoneNodeProps) {
  const fill = isHovered ? zone.hoverColor : zone.color;
  const stroke = isHovered ? "#ffffff" : "rgba(255,255,255,0.18)";
  const strokeWidth = isHovered ? 2 : 1;
  const filter = isHovered ? `drop-shadow(0 0 14px ${zone.hoverColor})` : "none";
  const center = shapeCenter(zone.shape);
  const labelY = center.y + (zone.labelOffsetY ?? 0);

  // Multi-line tspan rendering
  const fs = zone.fontSize ?? 10;
  const lines = zone.labelLines ?? [zone.name];
  const lineH = fs * 1.2;
  const totalTextH = (lines.length - 1) * lineH;
  const textStartY = labelY - totalTextH / 2;

  return (
    <g
      onMouseEnter={(e) => onMove(zone, e)}
      onMouseMove={(e) => onMove(zone, e)}
      onMouseLeave={onLeave}
      className="cursor-pointer"
      style={{ transition: "filter 0.2s ease" }}
    >
      {zone.shape.kind === "rect" ? (
        <rect
          x={zone.shape.x}
          y={zone.shape.y}
          width={zone.shape.w}
          height={zone.shape.h}
          rx={0}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          style={{ filter, transition: "fill 0.2s ease" }}
        />
      ) : (
        <polygon
          points={zone.shape.points}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          style={{ filter, transition: "fill 0.2s ease" }}
        />
      )}
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fill={labelColorFor(zone)}
        fontSize={fs}
        fontWeight="800"
        pointerEvents="none"
        style={{ letterSpacing: 1, fontFamily: "'Inter', 'Montserrat', 'Roboto', system-ui, sans-serif" }}
        transform={
          zone.labelRotate
            ? `rotate(${zone.labelRotate} ${center.x} ${labelY})`
            : undefined
        }
      >
        {lines.map((line, i) => (
          <tspan key={i} x={center.x} y={textStartY + i * lineH}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export function SeatMap() {
  const [hoveredZone, setHoveredZone] = useState<Zone | null>(null);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });

  const handleMove = (zone: Zone, event: React.MouseEvent) => {
    setHoveredZone(zone);
    setPopoverPos({ x: event.clientX, y: event.clientY });
  };

  const ungrouped = zones.filter((z) => !z.group);
  const groups = ["wing-tl", "wing-tr", "wing-bl", "wing-br"] as const;

  return (
    <section
      id="seatmap"
      className="py-24 px-6 text-white overflow-hidden bg-gradient-to-b from-black via-purple-950/30 to-black"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span className="uppercase tracking-[0.3em] text-pink-400">Sơ đồ Concert</span>
          <h2 className="mt-3">Vườn Hoa Âm Nhạc</h2>
          <p className="mt-3 text-white/60">
            Mỗi hạng vé là một loài hoa — tone nóng cho khu Đứng giữa sân khấu, tone lạnh cho ghế Ngồi
          </p>
        </motion.div>

        <motion.div
          className="relative rounded-3xl p-6 md:p-10 border border-white/10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(180,30,80,0.35) 0%, rgba(50,10,40,0.7) 55%, rgba(15,5,20,0.95) 100%)",
            boxShadow: "0 20px 60px rgba(217,70,239,0.18) inset",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <svg
            viewBox="0 0 1000 800"
            className="w-full h-auto"
            style={{
              filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.5))",
              fontFamily: "'Inter', 'Montserrat', 'Roboto', system-ui, sans-serif",
            }}
          >
            {ungrouped.map((zone) => (
              <ZoneNode
                key={zone.id}
                zone={zone}
                isHovered={hoveredZone?.id === zone.id}
                onMove={handleMove}
                onLeave={() => setHoveredZone(null)}
              />
            ))}

            {groups.map((g) => {
              const inGroup = zones.filter((z) => z.group === g);
              if (inGroup.length === 0) return null;
              return (
                <g key={g} transform={groupTransforms[g]}>
                  {inGroup.map((zone) => (
                    <ZoneNode
                      key={zone.id}
                      zone={zone}
                      isHovered={hoveredZone?.id === zone.id}
                      onMove={handleMove}
                      onLeave={() => setHoveredZone(null)}
                    />
                  ))}
                </g>
              );
            })}

            {/* Mini Legend đã được xóa */}
          </svg>

          <AnimatePresence>
            {hoveredZone && hoveredZone.id !== "stage" && (
              <div
                className="fixed z-50 pointer-events-none"
                style={{
                  left: `${popoverPos.x}px`,
                  top: `${popoverPos.y - 18}px`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl p-6 border border-white/20 bg-black/95 backdrop-blur-xl"
                  style={{
                    boxShadow: `0 0 40px ${hoveredZone.color}aa, 0 8px 32px rgba(0,0,0,0.6)`,
                    minWidth: "300px",
                    fontFamily: "'Inter', 'Montserrat', 'Roboto', system-ui, sans-serif",
                  }}
                >
                  <div
                    className="h-1 w-12 rounded-full mb-3"
                    style={{ background: hoveredZone.hoverColor }}
                  />
                  <h3 className="mb-4" style={{ color: hoveredZone.hoverColor }}>
                    {hoveredZone.name}
                  </h3>
                  <div className="space-y-3 text-white/85">
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 uppercase tracking-wider text-xs">Số vé</span>
                      <span>{hoveredZone.seats} vé</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 uppercase tracking-wider text-xs">Giá vé</span>
                      <span className="text-amber-300">{hoveredZone.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 uppercase tracking-wider text-xs">Loại vé</span>
                      <span
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          background:
                            hoveredZone.type === "Đứng"
                              ? "rgba(251, 146, 60, 0.2)"
                              : "rgba(103, 232, 249, 0.15)",
                          color:
                            hoveredZone.type === "Đứng" ? "#fb923c" : "#67e8f9",
                          border: `1px solid ${
                            hoveredZone.type === "Đứng"
                              ? "rgba(251,146,60,0.4)"
                              : "rgba(103,232,249,0.35)"
                          }`,
                        }}
                      >
                        {hoveredZone.type}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Legend — 2 nhóm: Đứng (nóng) & Ngồi (tone lạnh) */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-white/60 mb-3 uppercase tracking-widest text-xs">
              Khu Đứng — Tone nóng (giữa, sát sân khấu)
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              {[
                { color: FLOWER.senVang.color,   label: "Sen Vàng (Siêu VIP)" },
                { color: FLOWER.sen.color,        label: "Sen" },
                { color: FLOWER.phuong.color,     label: "Phượng" },
                { color: FLOWER.hong.color,       label: "Hồng" },
                { color: FLOWER.mai.color,        label: "Mai" },
                { color: FLOWER.huongDuong.color, label: "Hướng Dương" },
              ].map((l) => (
                <div
                  key={l.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10"
                >
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ background: l.color }} />
                  <span className="text-white/75">{l.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-white/60 mb-3 uppercase tracking-widest text-xs">
              Khu Ngồi — Tone lạnh (xung quanh)
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              {[
                { color: FLOWER.oaiHuong.color,    label: "Oải Hương" },
                { color: FLOWER.anhDao.color,       label: "Anh Đào" },
                { color: FLOWER.tuDinhHuong.color,  label: "Tử Đinh Hương" },
                { color: FLOWER.nhai.color,         label: "Nhài" },
                { color: FLOWER.tra.color,          label: "Trà" },
                { color: FLOWER.camChuong.color,    label: "Cẩm Chướng" },
                { color: FLOWER.ly.color,           label: "Ly" },
                { color: FLOWER.su.color,           label: "Sứ" },
                { color: FLOWER.thachThao.color,    label: "Thạch Thảo" },
              ].map((l) => (
                <div
                  key={l.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10"
                >
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ background: l.color }} />
                  <span className="text-white/75">{l.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 text-center text-sm text-white/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>
            * Đây là sơ đồ minh họa phục vụ mục đích học tập. Không có giao dịch thật.
          </p>
        </motion.div>
      </div>
    </section>
  );
}