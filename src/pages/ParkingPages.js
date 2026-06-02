import { useState } from "react";
import { T } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Card, Field, Row, TopBar } from "../components/UI";
import { db } from "../firebase/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// ─── AD HOC (الموقف الفوري) ───────────────────────────────────────────────────
export function AdHocPage({ setPage, spots, setSelectedSpot }) {
  const { t } = useLang();
  const [selId, setSelId]   = useState(null);
  const [saving, setSaving] = useState(false);

  const textColor   = T["text"];
  const greenColor  = T["green"];
  const accentColor = T["accent"];
  const mutedColor  = T["muted"];

  const avail   = spots ? spots.filter(function(s) { return s["status"] === "available"; }) : [];
  const selSpot = avail.find(function(s) { return s["id"] === selId; }) || null;

  const handlePark = async function() {
    if (!selSpot) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "spots", selId), {
        status: "occupied",
        occupiedSince: serverTimestamp(),
        wrongCarAlert: null,
      });
      const bookingId = "BK-" + Date.now();
      await setDoc(doc(db, "bookings", bookingId), {
        bookingId: bookingId,
        spotId: selId,
        type: "adhoc",
        status: "active",
        startedAt: new Date().toISOString(),
      });
      if (setSelectedSpot) setSelectedSpot(selSpot);
      setPage("res-info");
    } catch (err) {
      console.error("AdHoc park error:", err);
      if (setSelectedSpot) setSelectedSpot(selSpot);
      setPage("res-info");
    }
    setSaving(false);
  };

  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={"⚡ " + (t.instantPark || "موقف فوري")} back onBack={() => setPage("home")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>

        <div style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)", border: "1.5px solid #fbbf24", borderRadius: 16, padding: "clamp(12px,3.5vw,16px)", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: "clamp(24px,6vw,28px)", animation: "bounce 2s infinite" }}>⚡</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: "#92400e" }}>{t.parkNow || "اركن الآن مجاناً"}</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#78350f", fontWeight: 600 }}>{t.parkNowSub || "بدون حجز مسبق"}</div>
          </div>
        </div>

        <div style={{ fontWeight: 800, marginBottom: 12, color: textColor }}>
          {t.availableSpots || "المواقف المتاحة"} ({avail.length})
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(8px,2.5vw,12px)", marginBottom: 16 }}>
          {avail.map(function(spot) {
            const { id } = spot;
            const isSel = id === selId;
            return (
              <div
                key={id}
                onClick={() => setSelId(id)}
                style={{
                  background: isSel ? "linear-gradient(135deg,#3b82f6,#2563eb)" : "#d1fae5",
                  border: "2px solid " + (isSel ? "#3b82f6" : "#34d399"),
                  borderRadius: "clamp(10px,3vw,14px)",
                  padding: "clamp(12px,3.5vw,18px) 8px",
                  textAlign: "center", cursor: "pointer", transition: "all .22s",
                  transform: isSel ? "scale(1.06)" : "scale(1)"
                }}
              >
                <div style={{ fontSize: "clamp(12px,3.5vw,15px)", fontWeight: 900, color: isSel ? "#fff" : greenColor }}>{id}</div>
              </div>
            );
          })}
        </div>

        {selSpot && (
          <Card style={{ marginBottom: 16, animation: "popIn .35s ease" }}>
            <div style={{ fontWeight: 800, marginBottom: 10, color: textColor }}>
              {t.spotDetails || "تفاصيل"} {selSpot["id"]}
            </div>
            <Row label={t.zone   || "المنطقة"} value={"Zone " + selSpot["zone"]} />
            <Row label={t.status || "الحالة"}  value={t.free || "مجاني"} accent={greenColor} />
            <Btn onClick={handlePark} style={{ marginTop: 14 }} icon="🅿️" disabled={saving}>
              {saving ? "جاري الحفظ..." : (t.parkHere || "اركن هنا")}
            </Btn>
          </Card>
        )}

        {avail.length === 0 && (
          <div style={{ textAlign: "center", padding: 32, color: mutedColor, fontWeight: 700 }}>
            😔 {t.noSpotsAvail || "لا توجد مواقف متاحة حالياً"}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RESERVE (حجز موقف مع فلتر Zone) ─────────────────────────────────────────
export function ReservePage({ setPage, spots, setSelectedSpot }) {
  const { t } = useLang();
  const [step,   setStep]   = useState(1);
  const [zone,   setZone]   = useState("all");
  const [date,   setDate]   = useState("");
  const [time,   setTime]   = useState("");
  const [spotId, setSpotId] = useState("");
  const [saving, setSaving] = useState(false);

  const textColor   = T["text"];
  const accentColor = T["accent"];
  const subColor    = T["sub"];
  const mutedColor  = T["muted"];
  const bg2Color    = T["bg2"];
  const borderColor = T["border"];
  const greenColor  = T["green"];

  const availSpots = spots ? spots.filter(function(s) {
    const statusOk = s["status"] === "available";
    const zoneOk   = zone === "all" || s["zone"] === zone;
    return statusOk && zoneOk;
  }) : [];

  const selSpot = spots ? (spots.find(function(s) { return s["id"] === spotId; }) || null) : null;

  const handleConfirm = async function() {
    if (!spotId) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "spots", spotId), { status: "reserved" });
      const bookingId = "BK-" + Date.now();
      await setDoc(doc(db, "bookings", bookingId), {
        bookingId: bookingId,
        spotId: spotId,
        date: date,
        time: time,
        type: "reserve",
        status: "confirmed",
        createdAt: new Date().toISOString(),
      });
      if (setSelectedSpot && selSpot) setSelectedSpot(selSpot);
      setPage("res-info");
    } catch (err) {
      console.error("Reserve error:", err);
      if (setSelectedSpot && selSpot) setSelectedSpot(selSpot);
      setPage("res-info");
    }
    setSaving(false);
  };

  const stepLabels = [
    t.chooseTime    || "الوقت",
    t.chooseSpot    || "الموقف",
    t.confirmBooking|| "التأكيد",
  ];

  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.bookSpotTitle || "احجز موقفاً"} back onBack={() => setPage("home")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {stepLabels.map(function(label, i) {
            const active = i + 1 <= step;
            return (
              <div key={label} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ height: 6, borderRadius: 6, background: active ? accentColor : bg2Color, marginBottom: 4 }} />
                <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: active ? accentColor : mutedColor, fontWeight: 700 }}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <Card style={{ animation: "slideUp .35s ease" }}>
            <div style={{ fontWeight: 800, marginBottom: 20, fontSize: 16, color: textColor }}>📅 {t.chooseTime || "اختر الوقت"}</div>
            <Field
              label={t.date || "التاريخ"}
              type="date"
              value={date}
              onChange={function(e) { setDate(e["target"]["value"]); }}
            />
            <Field
              label={t.time || "الوقت"}
              type="time"
              value={time}
              onChange={function(e) { setTime(e["target"]["value"]); }}
            />
            <Btn onClick={() => setStep(2)} icon="→" disabled={!date || !time}>{t.next || "التالي"}</Btn>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ animation: "slideUp .35s ease" }}>
            <Card style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 10, color: textColor }}>🏢 {t.filterZone || "فلتر المنطقة"}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["all", "A", "B", "C"].map(function(z) {
                  const isActive = zone === z;
                  return (
                    <div
                      key={z}
                      onClick={() => setZone(z)}
                      style={{
                        flex: 1, padding: "8px", textAlign: "center",
                        borderRadius: 10, cursor: "pointer",
                        background: isActive ? accentColor : "#f1f5f9",
                        color: isActive ? "#fff" : subColor,
                        fontWeight: 800,
                        border: "1.5px solid " + (isActive ? accentColor : borderColor)
                      }}
                    >
                      {z === "all" ? "الكل" : "Zone " + z}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 15, color: textColor }}>
                🗺️ {t.chooseSpot || "اختر موقفاً"} ({availSpots.length})
              </div>
              {availSpots.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: mutedColor, fontWeight: 600 }}>
                  😔 {t.noSpotsZone || "لا توجد مواقف في هذه المنطقة"}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(8px,2.5vw,12px)", marginBottom: 16 }}>
                  {availSpots.map(function(spot) {
                    const { id } = spot;
                    const isSel = spotId === id;
                    return (
                      <div
                        key={id}
                        onClick={() => setSpotId(id)}
                        style={{
                          background: isSel ? "linear-gradient(135deg,#3b82f6,#2563eb)" : "#d1fae5",
                          border: "2px solid " + (isSel ? "#3b82f6" : "#34d399"),
                          borderRadius: "clamp(10px,3vw,14px)",
                          padding: "12px 6px", textAlign: "center", cursor: "pointer",
                          transform: isSel ? "scale(1.05)" : "scale(1)", transition: "all .2s"
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: 900, color: isSel ? "#fff" : greenColor }}>{id}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Btn onClick={() => setStep(3)} disabled={!spotId} icon="→">{t.next || "التالي"}</Btn>
              <Btn variant="ghost" onClick={() => setStep(1)} style={{ marginTop: 8 }}>{t.back || "رجوع"}</Btn>
            </Card>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Card style={{ animation: "slideUp .35s ease" }}>
            <div style={{ fontWeight: 800, marginBottom: 20, fontSize: 16, color: textColor }}>✅ {t.confirmBooking || "تأكيد الحجز"}</div>
            <Row label={t.spot  || "الموقف"}  value={spotId} />
            <Row label={t.zone  || "المنطقة"} value={"Zone " + (selSpot ? selSpot["zone"] : "")} />
            <Row label={t.date  || "التاريخ"} value={date} />
            <Row label={t.time  || "الوقت"}   value={time} />
            <Row label={t.price || "السعر"}   value="2 SAR / hr" accent={accentColor} />
            <Btn onClick={handleConfirm} style={{ marginTop: 20 }} icon="✅" disabled={saving}>
              {saving ? "جاري الحفظ..." : (t.confirmBtn || "أكد الحجز")}
            </Btn>
            <Btn variant="ghost" onClick={() => setStep(2)} style={{ marginTop: 10 }}>{t.back || "رجوع"}</Btn>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── RESERVATION INFO ─────────────────────────────────────────────────────────
export function ReservationInfoPage({ setPage, selectedSpot }) {
  const { t } = useLang();

  const textColor   = T["text"];
  const greenColor  = T["green"];
  const accentColor = T["accent"];

  const spotName = selectedSpot ? selectedSpot["id"]   : "B3";
  const spotZone = selectedSpot ? selectedSpot["zone"] : "B";
  const spotLat  = selectedSpot ? selectedSpot["lat"]  : 26.4033;
  const spotLng  = selectedSpot ? selectedSpot["lng"]  : 50.1089;
  const spotTag  = selectedSpot ? (selectedSpot["reservedTagId"] || selectedSpot["tagId"] || "—") : "—";

  const handleNavigate = function() {
    window.open("https://www.google.com/maps?q=" + spotLat + "," + spotLng, "_blank");
  };

  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.bookingDetails || "تفاصيل الحجز"} back onBack={() => setPage("home")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>

        <div style={{ background: "linear-gradient(145deg,#2563eb,#3b82f6)", borderRadius: 24, padding: "clamp(20px,6vw,32px)", textAlign: "center", marginBottom: 16, color: "#fff", animation: "popIn .4s ease" }}>
          <div style={{ fontSize: "clamp(40px,12vw,56px)", marginBottom: 10 }}>📍</div>
          <div style={{ fontSize: "clamp(28px,8vw,36px)", fontWeight: 900, fontFamily: "'Poppins',sans-serif" }}>{spotName}</div>
          <div style={{ fontSize: "clamp(12px,3vw,14px)", opacity: 0.9, marginTop: 4 }}>Zone {spotZone}</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6, fontFamily: "monospace", fontWeight: 700 }}>🏷️ {spotTag}</div>
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.85, fontWeight: 700 }}>
            {t.bookedReady || "موقفك جاهز — توجه إليه الآن"}
          </div>
        </div>

        <Btn onClick={handleNavigate} icon="🗺️" style={{ marginBottom: 12, background: "#4285F4", boxShadow: "0 4px 16px rgba(66,133,244,0.35)" }}>
          {t.navigateToSpot || "فتح الموقع في Google Maps"}
        </Btn>

        <Card style={{ marginBottom: 12, animation: "slideUp .4s ease .1s both" }}>
          <div style={{ fontWeight: 800, marginBottom: 12, color: textColor }}>{t.bookingSummary || "ملخص الحجز"}</div>
          <Row label={t.bookingNum || "رقم الحجز"} value={"#SPK-" + Date.now().toString().slice(-6)} />
          <Row label={t.spot       || "الموقف"}    value={spotName} />
          <Row label={t.zone       || "المنطقة"}   value={"Zone " + spotZone} />
          <Row label={t.status     || "الحالة"}    value={t.confirmed || "مؤكد"} accent={greenColor} />
          <Row label={t.price      || "السعر"}     value="2 SAR / hr" accent={accentColor} />
        </Card>

        <Btn onClick={() => setPage("home")} icon="🏠">{t.backHome || "الرئيسية"}</Btn>
      </div>
    </div>
  );
}
