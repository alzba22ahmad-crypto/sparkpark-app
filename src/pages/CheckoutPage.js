import { useState } from "react";
import { T, PARKING_IMGS } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Card, Row, TopBar, WaveLoader } from "../components/UI";
import { BlobBg } from "../components/Visuals";

export default function CheckoutPage({ setPage }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const [paying, setPaying] = useState(false);
  const [selMethod, setSelMethod] = useState(null);
  const methods = [{ id: "apple", icon: "🍎", label: "Apple Pay" }, { id: "mada", icon: "💳", label: "Mada" }, { id: "visa", icon: "💰", label: "Visa" }];

  if (done) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(16px,5vw,24px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <img src={PARKING_IMGS[3]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(3px) brightness(0.35)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(16,185,129,0.7),rgba(5,150,105,0.8))" }} />
      </div>
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 360, width: "100%" }}>
        <div style={{ fontSize: "clamp(64px,18vw,88px)", marginBottom: 16, animation: "popIn .6s ease" }}>🎊</div>
        <div style={{ fontSize: "clamp(20px,5.5vw,24px)", fontWeight: 900, color: "#fff", marginBottom: 8, fontFamily: "'Poppins',sans-serif" }}>{t.paySuccess}</div>
        <div style={{ fontSize: "clamp(13px,3.5vw,15px)", color: "rgba(255,255,255,0.85)", marginBottom: 32, fontWeight: 600 }}>{t.paySuccessSub}</div>
        <Card style={{ marginBottom: 20, animation: "slideUp .5s ease .3s both" }}>
          <Row label={t.actualDuration} value="1h 47min" />
          <Row label={t.amountPaid} value="3.50 SAR" accent={T.green} />
          <Row label={t.timeSaved} value="7.2 min" accent={T.accent} />
        </Card>
        <Btn onClick={() => setPage("home")} icon="🏠">{t.backHome}</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.checkoutTitle} back onBack={() => setPage("reservation-info")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>
        <Card style={{ marginBottom: 16, textAlign: "center", animation: "fadeIn .4s ease" }}>
          <div style={{ fontSize: "clamp(40px,11vw,52px)", marginBottom: 8, animation: "bounce 2s infinite" }}>🚗</div>
          <div style={{ fontWeight: 900, fontSize: "clamp(16px,4.5vw,20px)", color: T.text, fontFamily: "'Poppins',sans-serif" }}>{t.goodbye}</div>
          <div style={{ fontSize: "clamp(12px,3.5vw,13px)", color: T.sub, fontWeight: 600 }}>{t.thankYou}</div>
        </Card>
        <Card style={{ marginBottom: 16, animation: "fadeIn .4s ease .1s both" }}>
          <div style={{ fontWeight: 800, marginBottom: 12, color: T.text }}>{t.sessionSummary}</div>
          <Row label={t.entryTime} value="10:30 AM" />
          <Row label={t.now} value="12:17 PM" />
          <Row label={t.totalDuration} value="1h 47min" />
          <Row label={t.total} value="3.50 SAR" accent={T.green} />
        </Card>
        <div style={{ fontWeight: 800, marginBottom: 12, color: T.text, animation: "fadeIn .4s ease .15s both" }}>{t.payMethod}</div>
        {methods.map((m, i) => (
          <div key={m.id} onClick={() => setSelMethod(m.id)} style={{ background: selMethod === m.id ? "linear-gradient(135deg,#dbeafe,#bfdbfe)" : T.card, border: `1.5px solid ${selMethod === m.id ? T.accent : T.border}`, borderRadius: 14, padding: "clamp(12px,3.5vw,16px)", marginBottom: 10, cursor: "pointer", fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 700, display: "flex", alignItems: "center", gap: 12, transition: "all .2s", animation: `fadeIn .4s ease ${.2 + i * .08}s both` }}>
            <span style={{ fontSize: "clamp(20px,5.5vw,24px)" }}>{m.icon}</span>{m.label}
            {selMethod === m.id && <span style={{ marginLeft: "auto", color: T.accent }}>✓</span>}
          </div>
        ))}
        {paying ? <WaveLoader /> : <Btn onClick={() => { if (selMethod) { setPaying(true); setTimeout(() => setDone(true), 1500); } }} style={{ marginTop: 8 }} disabled={!selMethod} icon="💳">{t.payBtn} 3.50 SAR</Btn>}
      </div>
    </div>
  );
}