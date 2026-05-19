import { useState, useEffect, useRef } from "react";
import { PARKING_IMGS } from "../data/constants";
import { T } from "../data/constants";
import { useLang } from "../context/LanguageContext";

/* ═══════════════════════════════════════════════════════════════
   🚗  ANIMATED DRIVING CAR
═══════════════════════════════════════════════════════════════ */
export function DrivingCar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const first = setTimeout(() => setVisible(true), 1500);
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => setVisible(true), 300);
    }, 12000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);
  if (!visible) return null;
  return (
    <div style={{ position: "fixed", bottom: "clamp(80px,20vw,100px)", left: 0, right: 0, zIndex: 200, pointerEvents: "none", overflow: "hidden", height: 60 }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.25),transparent)" }} />
      <div style={{ position: "absolute", bottom: 4, left: 0, animation: "carDriveAcross 5s cubic-bezier(0.25,0.46,0.45,0.94) forwards", fontSize: 48, lineHeight: 1, filter: "drop-shadow(0 6px 16px rgba(59,130,246,0.35))" }}>
        <svg width="120" height="52" viewBox="0 0 120 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="50" rx="48" ry="4" fill="rgba(0,0,0,0.12)" />
          <rect x="8" y="26" width="104" height="20" rx="6" fill="#2563eb" />
          <path d="M28 26 C32 12, 88 12, 92 26 Z" fill="#3b82f6" />
          <path d="M34 24 C36 16, 58 15, 60 24 Z" fill="#bfdbfe" opacity="0.9" />
          <path d="M62 24 C64 15, 84 16, 88 24 Z" fill="#bfdbfe" opacity="0.9" />
          <path d="M36 22 C38 17, 46 16, 48 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <rect x="104" y="33" width="8" height="8" rx="3" fill="#1d4ed8" />
          <rect x="8" y="33" width="8" height="8" rx="3" fill="#1d4ed8" />
          <rect x="108" y="34" width="6" height="5" rx="2" fill="#fef3c7" />
          <rect x="6" y="34" width="5" height="5" rx="2" fill="#ef4444" opacity="0.8" />
          <circle cx="28" cy="46" r="7" fill="#1e293b" /><circle cx="28" cy="46" r="4" fill="#94a3b8" /><circle cx="28" cy="46" r="2" fill="#cbd5e1" />
          <circle cx="88" cy="46" r="7" fill="#1e293b" /><circle cx="88" cy="46" r="4" fill="#94a3b8" /><circle cx="88" cy="46" r="2" fill="#cbd5e1" />
          <line x1="60" y1="26" x2="60" y2="46" stroke="#1d4ed8" strokeWidth="1" opacity="0.4" />
          <rect x="44" y="34" width="10" height="2.5" rx="1.25" fill="#93c5fd" opacity="0.7" />
          <rect x="66" y="34" width="10" height="2.5" rx="1.25" fill="#93c5fd" opacity="0.7" />
          <defs>
            <radialGradient id="headlight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef9c3" /><stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   📸  HORIZONTAL SCROLLING PHOTO STRIP
═══════════════════════════════════════════════════════════════ */
export function PhotoStrip() {
  return (
    <div style={{ overflow: "hidden", margin: "16px 0", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, zIndex: 2, background: "linear-gradient(90deg, #f0f6ff, transparent)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, zIndex: 2, background: "linear-gradient(270deg, #f0f6ff, transparent)", pointerEvents: "none" }} />
      <div style={{ display: "flex", gap: 12, width: "max-content", animation: "imgScroll 28s linear infinite", padding: "4px 0" }}>
        {[...PARKING_IMGS, ...PARKING_IMGS].map((src, i) => (
          <div key={i} style={{ width: "clamp(140px,38vw,200px)", height: "clamp(88px,22vw,120px)", borderRadius: 16, overflow: "hidden", flexShrink: 0, boxShadow: "0 4px 20px rgba(59,130,246,0.15)", border: "2px solid rgba(255,255,255,0.8)", position: "relative" }}>
            <img src={src} alt="parking" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.92) saturate(1.1)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   🌄  HERO HEADER
═══════════════════════════════════════════════════════════════ */
export function HeroHeader({ avail, tick }) {
  const { t, lang, toggleLang } = useLang();
  const [imgIdx, setImgIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => { setImgIdx(i => (i + 1) % PARKING_IMGS.length); setFade(true); }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ position: "relative", overflow: "hidden", borderBottomLeftRadius: "clamp(24px,7vw,36px)", borderBottomRightRadius: "clamp(24px,7vw,36px)", minHeight: "clamp(180px,42vw,240px)" }}>
      <div style={{ position: "absolute", inset: 0, transition: "opacity 0.6s ease", opacity: fade ? 1 : 0 }}>
        <img src={PARKING_IMGS[imgIdx]} alt="parking" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(1px) brightness(0.45) saturate(1.3)" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, rgba(37,99,235,0.82) 0%, rgba(59,130,246,0.65) 50%, rgba(125,211,252,0.5) 100%)" }} />
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", bottom: -20, left: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      {/* Lang Toggle in hero */}
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
        <button onClick={toggleLang} style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 12, padding: "6px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
          {lang === "ar" ? "🌐 EN" : "🌐 عر"}
        </button>
      </div>
      <div style={{ position: "relative", zIndex: 1, padding: "clamp(24px,7vw,36px) clamp(16px,5vw,24px) clamp(28px,8vw,40px)" }}>
        <div style={{ fontSize: "clamp(12px,3vw,13px)", color: "rgba(255,255,255,0.8)", marginBottom: 4, fontWeight: 600 }}>👋 {t.welcome}</div>
        <div style={{ fontSize: "clamp(20px,5.5vw,26px)", fontWeight: 900, color: "#fff", marginBottom: 4, fontFamily: "'Poppins',sans-serif" }}>SparkPark 🚗</div>
        <div style={{ fontSize: "clamp(12px,3vw,13px)", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{t.appSub}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 24, padding: "8px 18px", marginTop: 16 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#86efac", boxShadow: tick % 2 === 0 ? "0 0 0 5px rgba(134,239,172,0.35)" : "none", transition: "box-shadow .4s" }} />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(12px,3.5vw,14px)" }}>{avail} {t.availableNow}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   🎠  SLIDER BANNER
═══════════════════════════════════════════════════════════════ */
export function SliderBanner() {
  const { t } = useLang();
  const SLIDES = [
    { id: 1, bg: "linear-gradient(135deg,#3b82f6,#06b6d4)", emoji: "🅿️", titleKey: "slide1Title", tagKey: "slide1Tag", tagColor: "#bfdbfe", subKey: "slide1Sub" },
    { id: 2, bg: "linear-gradient(135deg,#10b981,#34d399)", emoji: "🔍", titleKey: "slide2Title", tagKey: "slide2Tag", tagColor: "#bbf7d0", subKey: "slide2Sub" },
    { id: 3, bg: "linear-gradient(135deg,#f59e0b,#fbbf24)", emoji: "⚡", titleKey: "slide3Title", tagKey: "slide3Tag", tagColor: "#fde68a", subKey: "slide3Sub" },
    { id: 4, bg: "linear-gradient(135deg,#8b5cf6,#a78bfa)", emoji: "📡", titleKey: "slide4Title", tagKey: "slide4Tag", tagColor: "#ddd6fe", subKey: "slide4Sub" },
    { id: 5, bg: "linear-gradient(135deg,#ec4899,#f43f5e)", emoji: "⏱️", titleKey: "slide5Title", tagKey: "slide5Tag", tagColor: "#fce7f3", subKey: "slide5Sub" },
  ];
  const [current, setCurrent] = useState(0);
  const [startX, setStartX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const timerRef = useRef(null);
  const goTo = (idx) => setCurrent((idx + SLIDES.length) % SLIDES.length);
  useEffect(() => {
    timerRef.current = setInterval(() => goTo(current + 1), 3800);
    return () => clearInterval(timerRef.current);
  }, [current]);
  const dragStart = (x) => { setDragging(true); setStartX(x); clearInterval(timerRef.current); };
  const dragEnd = (x) => {
    if (!dragging) return; setDragging(false);
    const diff = startX - x;
    if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
  };
  const s = SLIDES[current];
  return (
    <div style={{ margin: "clamp(14px,4vw,20px) clamp(14px,4vw,20px) 0", userSelect: "none" }}>
      <div key={current}
        onMouseDown={e => dragStart(e.clientX)} onMouseUp={e => dragEnd(e.clientX)}
        onTouchStart={e => dragStart(e.touches[0].clientX)} onTouchEnd={e => dragEnd(e.changedTouches[0].clientX)}
        style={{ background: s.bg, borderRadius: "clamp(18px,5vw,24px)", padding: "clamp(18px,5vw,24px) clamp(16px,5vw,22px)", position: "relative", overflow: "hidden", cursor: "grab", boxShadow: "0 8px 32px rgba(0,0,0,0.13)", minHeight: "clamp(112px,28vw,140px)", display: "flex", alignItems: "center", gap: "clamp(14px,4vw,22px)", animation: "bannerFade .42s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit" }}>
          <img src={PARKING_IMGS[current % PARKING_IMGS.length]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.18, filter: "blur(2px) saturate(1.5)", mixBlendMode: "overlay" }} />
        </div>
        <div style={{ position: "absolute", top: -28, right: -28, width: "clamp(80px,22vw,110px)", height: "clamp(80px,22vw,110px)", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
        <div style={{ fontSize: "clamp(40px,11vw,54px)", flexShrink: 0, animation: "bannerEmoji .5s cubic-bezier(.22,1,.36,1)" }}>{s.emoji}</div>
        <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.25)", color: s.tagColor, fontSize: "clamp(9px,2.5vw,11px)", fontWeight: 900, letterSpacing: 1.5, padding: "3px 10px", borderRadius: 20, marginBottom: "clamp(4px,1.5vw,8px)" }}>{t[s.tagKey]}</div>
          <div style={{ fontSize: "clamp(16px,4.8vw,21px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, fontFamily: "'Poppins',sans-serif", marginBottom: "clamp(4px,1.5vw,6px)", textShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{t[s.titleKey]}</div>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "rgba(255,255,255,0.88)", fontWeight: 600, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{t[s.subKey]}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 12 }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => goTo(i)} style={{ width: i === current ? "clamp(22px,6vw,28px)" : "clamp(7px,2vw,9px)", height: "clamp(7px,2vw,9px)", borderRadius: 5, background: i === current ? "#3b82f6" : "#bfdbfe", transition: "all .35s cubic-bezier(.22,1,.36,1)", cursor: "pointer", boxShadow: i === current ? "0 2px 10px rgba(59,130,246,0.45)" : "none" }} />
        ))}
      </div>
    </div>
  );
}

/* ─── FLOATING BLOBS ─────────────────────────────────────────── */
export function BlobBg() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{ position: "absolute", top: "-10%", right: "-8%", width: "min(340px,60vw)", height: "min(340px,60vw)", borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.12),transparent 70%)", animation: "floatY 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "15%", left: "-10%", width: "min(280px,50vw)", height: "min(280px,50vw)", borderRadius: "50%", background: "radial-gradient(circle,rgba(125,211,252,0.10),transparent 70%)", animation: "floatY 10s ease-in-out infinite reverse" }} />
      <div style={{ position: "absolute", top: "40%", left: "30%", width: "min(180px,35vw)", height: "min(180px,35vw)", borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)", animation: "floatX 12s ease-in-out infinite" }} />
    </div>
  );
}