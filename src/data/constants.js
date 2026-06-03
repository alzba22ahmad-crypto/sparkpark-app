export const PARKING_IMGS = [
  "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80",
  "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
  "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=800&q=80",
  "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80",
];

export const T = {
  bg: "#f0f6ff", bg2: "#e4eefb", white: "#ffffff",
  card: "#ffffff", card2: "#f7faff",
  border: "rgba(99,160,255,0.18)",
  accent: "#3b82f6", accent2: "#2563eb",
  sky: "#7dd3fc", green: "#10b981",
  yellow: "#f59e0b", red: "#ef4444",
  purple: "#8b5cf6", pink: "#ec4899",
  muted: "#94a3b8", text: "#1e3a5f", sub: "#4a6fa5",
  shadow: "0 4px 24px rgba(59,130,246,0.10)",
  shadowHover: "0 8px 32px rgba(59,130,246,0.18)",
};

export const MOCK_SPOTS = [
  { id: "A1", zone: "A", status: "available", tagId: null, lat: 26.4207, lng: 50.0888 },
  { id: "A2", zone: "A", status: "occupied",  tagId: "VH-2341", lat: 26.4208, lng: 50.0889 },
  { id: "A3", zone: "A", status: "reserved",  tagId: "VH-1820", lat: 26.4209, lng: 50.0890 },
  { id: "A4", zone: "A", status: "available", tagId: null, lat: 26.4210, lng: 50.0891 },
  { id: "A5", zone: "A", status: "available", tagId: null, lat: 26.4211, lng: 50.0892 },
  { id: "B1", zone: "B", status: "occupied",  tagId: "VH-5502", lat: 26.4207, lng: 50.0893 },
  { id: "B2", zone: "B", status: "available", tagId: null, lat: 26.4208, lng: 50.0894 },
  { id: "B3", zone: "B", status: "reserved",  tagId: "VH-3301", lat: 26.4209, lng: 50.0895 },
  { id: "B4", zone: "B", status: "available", tagId: null, lat: 26.4210, lng: 50.0896 },
  { id: "B5", zone: "B", status: "occupied",  tagId: "VH-6610", lat: 26.4211, lng: 50.0897 },
  { id: "C1", zone: "C", status: "available", tagId: null, lat: 26.4207, lng: 50.0898 },
  { id: "C2", zone: "C", status: "available", tagId: null, lat: 26.4208, lng: 50.0899 },
  { id: "C3", zone: "C", status: "occupied",  tagId: "VH-9923", lat: 26.4209, lng: 50.0900 },
  { id: "C4", zone: "C", status: "reserved",  tagId: "VH-7714", lat: 26.4210, lng: 50.0901 },
  { id: "C5", zone: "C", status: "available", tagId: null, lat: 26.4211, lng: 50.0902 },
];

export const STATUS_CFG = {
  available: { color: "#10b981", bg: "#d1fae5", labelKey: "available", icon: "✓" },
  reserved:  { color: "#f59e0b", bg: "#fef3c7", labelKey: "reserved",  icon: "⏰" },
  occupied:  { color: "#ef4444", bg: "#fee2e2", labelKey: "occupied",  icon: "🚗" },
};

export const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@700;900&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root {
  width: 100%; height: 100%;
  font-family: 'Nunito', sans-serif;
  background: #f0f6ff;
  color: #1a2540;
  -webkit-tap-highlight-color: transparent;
}
@keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes floatX { 0%,100%{transform:translateX(0)} 50%{transform:translateX(8px)} }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
@keyframes popIn { 0%{transform:scale(.7);opacity:0} 80%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
@keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes waveBar { 0%,100%{transform:scaleY(.4)} 50%{transform:scaleY(1)} }
@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes carDriveAcross {
  0%   { transform: translateX(-160px) scaleX(1); opacity: 0; }
  5%   { opacity: 1; }
  95%  { opacity: 1; }
  100% { transform: translateX(calc(100vw + 160px)) scaleX(1); opacity: 0; }
}
@keyframes imgScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes bannerFade {
  from { opacity: 0; transform: scale(1.04); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes bannerEmoji {
  from { transform: scale(.5) rotate(-15deg); opacity:0; }
  to   { transform: scale(1) rotate(0deg); opacity:1; }
}
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
@keyframes sensorPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
  50%     { box-shadow: 0 0 0 16px rgba(16,185,129,0); }
}
@keyframes sensorWarn {
  0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
  50%     { box-shadow: 0 0 0 16px rgba(239,68,68,0); }
}
button { font-family: 'Nunito', sans-serif; }
input, textarea, select { font-family: 'Nunito', sans-serif; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #c5d8f5; border-radius: 4px; }
`;

// ── AI Occupancy Prediction ─────────────────────────────────────────────────
// نمط إشغال جامعة الإمام عبدالرحمن بن فيصل (أحد-خميس = دوام، جمعة-سبت = عطلة)
export const AI_PATTERNS = {
  weekday: [
    0.05, 0.05, 0.05, 0.05, 0.05, 0.10,
    0.20, 0.50, 0.90, 0.95, 0.95, 0.85,
    0.70, 0.85, 0.90, 0.80, 0.55, 0.30,
    0.20, 0.15, 0.10, 0.10, 0.05, 0.05,
  ],
  weekend: [
    0.05, 0.05, 0.05, 0.05, 0.05, 0.05,
    0.05, 0.10, 0.15, 0.20, 0.25, 0.30,
    0.25, 0.20, 0.15, 0.15, 0.10, 0.10,
    0.05, 0.05, 0.05, 0.05, 0.05, 0.05,
  ],
};

export function predictOccupancy(hour, dayOfWeek) {
  const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
  const key = isWeekend ? "weekend" : "weekday";
  const rate = AI_PATTERNS[key][hour] || 0.05;
  var level, labelAr, labelEn, color, emoji;
  if (rate >= 0.8) {
    level = "high";   labelAr = "مزدحم جداً"; labelEn = "Very Busy"; color = "#ef4444"; emoji = "🔴";
  } else if (rate >= 0.5) {
    level = "medium"; labelAr = "متوسط";      labelEn = "Moderate";  color = "#f59e0b"; emoji = "🟡";
  } else {
    level = "low";    labelAr = "هادئ";        labelEn = "Quiet";     color = "#10b981"; emoji = "🟢";
  }
  return { level: level, labelAr: labelAr, labelEn: labelEn, color: color, emoji: emoji, rate: rate };
}

export function getBestParkingTimes(dayOfWeek) {
  const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
  const key = isWeekend ? "weekend" : "weekday";
  const hours = AI_PATTERNS[key];
  const indexed = hours.map(function(rate, index) { return { hour: index, rate: rate }; });
  indexed.sort(function(a, b) { return a["rate"] - b["rate"]; });
  return indexed.slice(0, 3).map(function(item) {
    var h = item["hour"];
    var ampm = h >= 12 ? "PM" : "AM";
    var h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return h12 + ":00 " + ampm;
  });
}