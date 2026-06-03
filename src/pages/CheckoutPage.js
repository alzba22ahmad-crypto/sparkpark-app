import { useState, useEffect } from "react";
import { T, PARKING_IMGS } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Card, Row, TopBar, WaveLoader } from "../components/UI";
import { db } from "../firebase/firebase";
import { doc, onSnapshot, updateDoc, addDoc, collection } from "firebase/firestore";

export default function CheckoutPage({ setPage, selectedSpot, user, spots }) {
  const { t } = useLang();
  const [done, setDone]           = useState(false);
  const [paying, setPaying]       = useState(false);
  const [selMethod, setSelMethod] = useState(null);
  const [spotData, setSpotData]   = useState(null);
  const [elapsed, setElapsed]     = useState(0);

  const textColor   = T["text"];
  const subColor    = T["sub"];
  const greenColor  = T["green"];
  const accentColor = T["accent"];
  const borderColor = T["border"];
  const cardColor   = T["card"];

  // ── تحديد الموقف النشط ──────────────────────────────────────────────────
  const userTagId = user && user.vehicle ? user["vehicle"]["tagId"] : null;
  var activeSpotId = "B3";
  if (selectedSpot) {
    activeSpotId = selectedSpot["id"];
  } else if (spots && userTagId) {
    var found = spots.find(function(s) { return s["reservedTagId"] === userTagId || s["tagId"] === userTagId; });
    if (!found) found = spots.find(function(s) { return s["status"] === "reserved" || s["status"] === "occupied"; });
    if (found) activeSpotId = found["id"];
  }

  // ── الاستماع للموقف في Firebase ──────────────────────────────────────────
  useEffect(function() {
    var unsub = onSnapshot(doc(db, "spots", activeSpotId), function(snap) {
      if (snap.exists()) setSpotData(snap["data"]());
    });
    return function() { unsub(); };
  }, [activeSpotId]);

  // ── حساب الوقت المنقضي ─────────────────────────────────────────────────
  useEffect(function() {
    function getMs(ts) {
      if (!ts) return null;
      if (typeof ts["toDate"] === "function") return ts["toDate"]().getTime();
      if (ts["seconds"]) return ts["seconds"] * 1000;
      return null;
    }
    var startMs = spotData ? getMs(spotData["occupiedSince"]) : null;
    if (!startMs) { setElapsed(0); return; }
    function tick() { setElapsed(Math.floor((Date.now() - startMs) / 1000)); }
    tick();
    var id = setInterval(tick, 1000);
    return function() { clearInterval(id); };
  }, [spotData]);

  // ── الحسابات ──────────────────────────────────────────────────────────────
  var pricePerHour = 2;
  var cost         = ((elapsed / 3600) * pricePerHour).toFixed(2);
  var hrs          = Math.floor(elapsed / 3600);
  var mins         = Math.floor((elapsed % 3600) / 60);
  var durText      = elapsed > 0 ? (hrs > 0 ? hrs + "h " + mins + "min" : mins + "min") : "—";

  var entryTime = "—";
  if (spotData && spotData["occupiedSince"]) {
    var ts = spotData["occupiedSince"];
    var d  = typeof ts["toDate"] === "function" ? ts["toDate"]() : new Date(ts["seconds"] * 1000);
    entryTime = d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
  }

  var nowTime = new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });

  // ── الدفع وتحديث Firebase ─────────────────────────────────────────────────
  var handlePay = async function() {
    if (!selMethod) return;
    setPaying(true);
    try {
      await updateDoc(doc(db, "spots", activeSpotId), {
        status: "available",
        occupiedSince: null,
        tagId: null,
        reservedTagId: null,
        wrongCarAlert: null,
      });
      await addDoc(collection(db, "parking_logs"), {
        spotId: activeSpotId,
        action: "Checkout",
        amount: parseFloat(cost),
        durationSec: elapsed,
        paymentMethod: selMethod,
        timestamp: new Date().toISOString(),
      });
      setTimeout(function() { setDone(true); setPaying(false); }, 1500);
    } catch (err) {
      console.error("Checkout error:", err);
      setPaying(false);
    }
  };

  var methods = [
    { id: "apple", icon: "🍎", label: "Apple Pay" },
    { id: "mada",  icon: "💳", label: "Mada" },
    { id: "visa",  icon: "💰", label: "Visa" },
  ];

  // ── شاشة النجاح ──────────────────────────────────────────────────────────
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
          <Row label={t.spot        || "الموقف"}       value={activeSpotId} />
          <Row label={t.actualDuration || "المدة الفعلية"} value={durText} />
          <Row label={t.amountPaid  || "المبلغ المدفوع"} value={cost + " SAR"} accent={greenColor} />
          <Row label={t.payMethod   || "طريقة الدفع"}  value={selMethod || "—"} accent={accentColor} />
        </Card>
        <Btn onClick={() => setPage("home")} icon="🏠">{t.backHome}</Btn>
      </div>
    </div>
  );

  // ── شاشة الدفع ───────────────────────────────────────────────────────────
  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.checkoutTitle || "تسجيل الخروج"} back onBack={() => setPage("home")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>

        <Card style={{ marginBottom: 16, textAlign: "center", animation: "fadeIn .4s ease" }}>
          <div style={{ fontSize: "clamp(40px,11vw,52px)", marginBottom: 8, animation: "bounce 2s infinite" }}>🚗</div>
          <div style={{ fontWeight: 900, fontSize: "clamp(16px,4.5vw,20px)", color: textColor, fontFamily: "'Poppins',sans-serif" }}>{t.goodbye}</div>
          <div style={{ fontSize: "clamp(12px,3.5vw,13px)", color: subColor, fontWeight: 600 }}>{t.thankYou}</div>
        </Card>

        <Card style={{ marginBottom: 16, animation: "fadeIn .4s ease .1s both" }}>
          <div style={{ fontWeight: 800, marginBottom: 12, color: textColor }}>{t.sessionSummary}</div>
          <Row label={t.spot        || "الموقف"}    value={activeSpotId} />
          <Row label={t.entryTime   || "الدخول"}    value={entryTime} />
          <Row label={t.now         || "الآن"}       value={nowTime} />
          <Row label={t.totalDuration || "المدة"}   value={durText} />
          <Row label={t.total       || "الإجمالي"}  value={cost + " SAR"} accent={greenColor} />
        </Card>

        <div style={{ fontWeight: 800, marginBottom: 12, color: textColor, animation: "fadeIn .4s ease .15s both" }}>{t.payMethod}</div>
        {methods.map(function(m, i) {
          var isSel = selMethod === m["id"];
          return (
            <div
              key={m["id"]}
              onClick={() => setSelMethod(m["id"])}
              style={{
                background: isSel ? "linear-gradient(135deg,#dbeafe,#bfdbfe)" : cardColor,
                border: "1.5px solid " + (isSel ? accentColor : borderColor),
                borderRadius: 14, padding: "clamp(12px,3.5vw,16px)", marginBottom: 10,
                cursor: "pointer", fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 700,
                display: "flex", alignItems: "center", gap: 12, transition: "all .2s",
                animation: "fadeIn .4s ease " + (0.2 + i * 0.08) + "s both"
              }}
            >
              <span style={{ fontSize: "clamp(20px,5.5vw,24px)" }}>{m["icon"]}</span>
              {m["label"]}
              {isSel && <span style={{ marginLeft: "auto", color: accentColor }}>✓</span>}
            </div>
          );
        })}

        {paying
          ? <WaveLoader />
          : <Btn onClick={handlePay} style={{ marginTop: 8 }} disabled={!selMethod} icon="💳">
              {t.payBtn || "ادفع"} {cost} SAR
            </Btn>
        }
      </div>
    </div>
  );
}
