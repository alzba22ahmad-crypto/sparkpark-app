import { T } from "../data/constants";
import { useLang } from "../context/LanguageContext";

export const Btn = ({ children, onClick, variant = "primary", style = {}, disabled = false, icon }) => {
  const base = { width: "100%", padding: "15px 0", borderRadius: 16, border: "none", cursor: disabled ? "not-allowed" : "pointer", fontWeight: 800, fontSize: 15, fontFamily: "'Nunito',sans-serif", transition: "all .22s", opacity: disabled ? .55 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: .2 };
  const variants = {
    primary: { background: `linear-gradient(135deg,${T.accent},${T.accent2})`, color: "#fff", boxShadow: "0 6px 20px rgba(59,130,246,0.35)" },
    green:   { background: `linear-gradient(135deg,${T.green},#059669)`, color: "#fff", boxShadow: "0 6px 20px rgba(16,185,129,0.35)" },
    yellow:  { background: `linear-gradient(135deg,${T.yellow},#d97706)`, color: "#fff", boxShadow: "0 6px 20px rgba(245,158,11,0.3)" },
    ghost:   { background: T.card, color: T.sub, border: `1.5px solid ${T.border}`, boxShadow: T.shadow },
    danger:  { background: "#fff0f0", color: T.red, border: `1.5px solid #fca5a5` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>{icon && <span>{icon}</span>}{children}</button>;
};

export const Field = ({ label, type = "text", placeholder, value, onChange, icon }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <div style={{ fontSize: 12, color: T.sub, marginBottom: 6, fontWeight: 700, letterSpacing: .5 }}>{label}</div>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, pointerEvents: "none" }}>{icon}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{ width: "100%", boxSizing: "border-box", background: T.card2, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: icon ? "13px 14px 13px 46px" : "13px 16px", color: T.text, fontSize: 14, outline: "none", fontFamily: "inherit", boxShadow: "inset 0 1px 3px rgba(99,160,255,0.08)", transition: "border .2s" }}
        onFocus={e => { e.target.style.border = `1.5px solid ${T.accent}`; }}
        onBlur={e => { e.target.style.border = `1.5px solid ${T.border}`; }}
      />
    </div>
  </div>
);

export const Card = ({ children, style = {} }) => (
  <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: 20, boxShadow: T.shadow, ...style }}>
    {children}
  </div>
);

export const Badge = ({ label, color, bg }) => (
  <span style={{ background: bg || `${color}22`, color, border: `1.5px solid ${color}44`, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, display: "inline-block" }}>
    {label}
  </span>
);

export const Row = ({ label, value, accent }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
    <span style={{ color: T.muted, fontSize: 13, fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 700, color: accent || T.text }}>{value}</span>
  </div>
);

export const WaveLoader = () => (
  <div style={{ display: "flex", gap: 5, alignItems: "center", justifyContent: "center", height: 40 }}>
    {[0, 1, 2, 3, 4].map(i => (
      <div key={i} style={{ width: 5, height: 28, borderRadius: 4, background: T.accent, animation: `waveBar .9s ease-in-out infinite`, animationDelay: `${i * .12}s` }} />
    ))}
  </div>
);

export const TopBar = ({ title, back, onBack, right }) => {
  const { lang, toggleLang } = useLang();
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(240,246,255,0.92)", backdropFilter: "blur(16px)", borderBottom: `1.5px solid ${T.border}`, padding: "clamp(10px,3vw,16px) clamp(14px,4vw,20px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ width: 36 }}>{back && <button onClick={onBack} style={{ background: "none", border: "none", color: T.accent, fontSize: 22, cursor: "pointer", fontWeight: 700 }}>←</button>}</div>
      <div style={{ fontWeight: 800, fontSize: "clamp(15px,4vw,17px)", color: T.text, fontFamily: "'Poppins',sans-serif" }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {right}
        <button onClick={toggleLang} style={{ background: `linear-gradient(135deg,${T.accent},${T.accent2})`, color: "#fff", border: "none", borderRadius: 10, padding: "5px 10px", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(59,130,246,0.3)" }}>
          {lang === "ar" ? "EN" : "عر"}
        </button>
      </div>
    </div>
  );
};

export const LangToggle = ({ style = {} }) => {
  const { lang, toggleLang } = useLang();
  return (
    <button onClick={toggleLang} style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 12, padding: "6px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", ...style }}>
      {lang === "ar" ? "🌐 English" : "🌐 عربي"}
    </button>
  );
};

const NAV_KEYS = [
  { key: "home",    icon: "🏠", labelKey: "home" },
  { key: "reserve", icon: "🅿️", labelKey: "park" },
  { key: "history", icon: "📋", labelKey: "history" },
  { key: "profile", icon: "👤", labelKey: "profile" },
];

export const BottomNav = ({ active, setPage }) => {
  const { t } = useLang();
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", borderTop: `1.5px solid ${T.border}`, display: "flex", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom,8px)", boxShadow: "0 -4px 24px rgba(59,130,246,0.08)" }}>
      {NAV_KEYS.map(n => (
        <button key={n.key} onClick={() => setPage(n.key)} style={{ flex: 1, padding: "10px 0 6px", border: "none", background: "transparent", cursor: "pointer", color: active === n.key ? T.accent : T.muted, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "all .2s" }}>
          <span style={{ fontSize: "clamp(18px,5vw,22px)", transition: "transform .2s", transform: active === n.key ? "scale(1.2)" : "scale(1)" }}>{n.icon}</span>
          <span style={{ fontSize: "clamp(9px,2.5vw,11px)", fontWeight: active === n.key ? 800 : 600 }}>{t[n.labelKey]}</span>
          {active === n.key && <div style={{ width: 20, height: 3, borderRadius: 3, background: T.accent, animation: "popIn .3s ease" }} />}
        </button>
      ))}
    </div>
  );
};