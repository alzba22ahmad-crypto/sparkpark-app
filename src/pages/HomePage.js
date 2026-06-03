import { useState, useEffect } from "react";
import { T, STATUS_CFG, predictOccupancy, getBestParkingTimes } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Card, Badge } from "../components/UI";
import { HeroHeader, SliderBanner, PhotoStrip } from "../components/Visuals";
import { IoTSensor, OccupancyTimer, WrongCarAlert } from "../components/IoTSensors";

// ── AI Prediction Widget ──────────────────────────────────────────────────────
function AIPredictionCard({ t }) {
  const now       = new Date();
  const curHour   = now.getHours();
  const curDay    = now.getDay();

  const pred      = predictOccupancy(curHour, curDay);
  const bestTimes = getBestParkingTimes(curDay);

  const predColor  = pred["color"];
  const predEmoji  = pred["emoji"];
  const predLabelAr = pred["labelAr"];
  const predRate   = pred["rate"];

  const textColor = T["text"];
  const subColor  = T["sub"];
  const mutedColor = T["muted"];

  // الـ 8 ساعات القادمة للرسم البياني
  const bars = [];
  for (var i = 0; i < 8; i++) {
    var h = (curHour + i) % 24;
    var p = predictOccupancy(h, curDay);
    var h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    var ampm = h >= 12 ? "م" : "ص";
    bars.push({ h: h, h12: h12, ampm: ampm, rate: p["rate"], color: p["color"], isNow: i === 0 });
  }

  return (
    <Card style={{ marginBottom: "clamp(12px,3vw,16px)", animation: "fadeIn .5s ease .15s both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: textColor }}>
          🤖 {t.aiPrediction || "توقع الذكاء الاصطناعي"}
        </div>
        <div style={{ fontSize: 10, color: mutedColor, fontWeight: 700, background: "#f1f5f9", padding: "3px 10px", borderRadius: 20 }}>
          {t.liveAnalysis || "تحليل مباشر"}
        </div>
      </div>

      {/* الحالة الحالية */}
      <div style={{
        background: predColor + "18",
        border: "1.5px solid " + predColor + "44",
        borderRadius: 14, padding: "12px 16px", marginBottom: 14,
        display: "flex", alignItems: "center", gap: 12
      }}>
        <div style={{ fontSize: 32 }}>{predEmoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, color: predColor, fontSize: "clamp(14px,4vw,17px)" }}>{predLabelAr}</div>
          <div style={{ fontSize: 11, color: subColor, fontWeight: 600, marginTop: 2 }}>
            {t.nowOccupancy || "نسبة الإشغال الآن"}: {Math.round(predRate * 100)}%
          </div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "conic-gradient(" + predColor + " " + (predRate * 360) + "deg, #e2e8f0 0deg)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: predColor }}>
            {Math.round(predRate * 100)}
          </div>
        </div>
      </div>

      {/* رسم بياني - الـ 8 ساعات القادمة */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: subColor, fontWeight: 700, marginBottom: 8 }}>
          📊 {t.next8Hours || "الـ 8 ساعات القادمة"}
        </div>
        <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 56 }}>
          {bars.map(function(item) {
            var barH = Math.max(6, Math.round(item["rate"] * 48));
            var isNow = item["isNow"];
            return (
              <div key={item["h"]} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{
                  width: "100%", height: barH,
                  background: item["color"],
                  borderRadius: "4px 4px 2px 2px",
                  opacity: isNow ? 1 : 0.55,
                  border: isNow ? "2px solid " + textColor : "none",
                  transition: "height .4s ease"
                }} />
                <div style={{ fontSize: 8, color: isNow ? textColor : mutedColor, fontWeight: isNow ? 900 : 600 }}>
                  {item["h12"]}{item["ampm"]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* أفضل أوقات اليوم */}
      <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "10px 14px" }}>
        <div style={{ fontSize: 11, color: "#166534", fontWeight: 800, marginBottom: 8 }}>
          ✨ {t.bestTimes || "أفضل أوقات الوصول اليوم"}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {bestTimes.map(function(time) {
            return (
              <div key={time} style={{
                background: "#dcfce7", border: "1px solid #86efac",
                borderRadius: 8, padding: "4px 12px",
                fontSize: 11, fontWeight: 800, color: "#166534"
              }}>
                🕐 {time}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// ── HomePage ──────────────────────────────────────────────────────────────────
export default function HomePage({ setPage, user, spots, sensors }) {
  const { t } = useLang();

  const accentColor = T["accent"];
  const yellowColor = T["yellow"];
  const greenColor  = T["green"];
  const textColor   = T["text"];
  const subColor    = T["sub"];

  const avail = spots ? spots.filter(function(s) { return s["status"] === "available"; }).length : 0;

  const userTagId  = user && user.vehicle ? user["vehicle"]["tagId"] : null;
  const bookedSpot = spots ? (
    spots.find(function(s) { return s["reservedTagId"] === userTagId || s["tagId"] === userTagId; }) ||
    spots.find(function(s) { return s["status"] === "reserved" || s["status"] === "occupied"; })
  ) : null;

  const bookedId     = bookedSpot ? bookedSpot["id"]     : "B3";
  const bookedZone   = bookedSpot ? bookedSpot["zone"]   : "B";
  const bookedTagId  = bookedSpot ? (bookedSpot["reservedTagId"] || bookedSpot["tagId"] || "VH-3301") : "VH-3301";
  const bookedStatus = bookedSpot ? bookedSpot["status"] : "reserved";

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const ti = setInterval(() => setTick(function(p) { return p + 1; }), 2000);
    return () => clearInterval(ti);
  }, []);

  const quickActions = [
    { icon: "🅿️", labelKey: "bookSpot",     subKey: "bookSub",    pg: "reserve",       color: accentColor, bg: "#eff6ff" },
    { icon: "⚡",  labelKey: "instantPark",  subKey: "instantSub", pg: "adhoc",         color: yellowColor, bg: "#fffbeb" },
    { icon: "🔍", labelKey: "findCar",       subKey: "findCarSub", pg: "find",          color: greenColor,  bg: "#f0fdf4" },
    { icon: "🔔", labelKey: "notifications", subKey: "notifSub",   pg: "notifications", color: "#8b5cf6",   bg: "#f5f3ff" },
  ];

  const statusLabel = {
    reserved: { label: t.reserved, color: yellowColor, bg: "#fef3c7" },
    occupied: { label: t.occupied, color: "#ef4444",   bg: "#fee2e2" },
    available:{ label: t.available,color: greenColor,  bg: "#d1fae5" },
  };
  const badgeCfg = statusLabel[bookedStatus] || statusLabel["reserved"];

  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <HeroHeader avail={avail} tick={tick} />
      <SliderBanner />

      <div style={{ padding: "16px 0 0" }}>
        <div style={{ padding: "0 clamp(14px,4vw,20px)", marginBottom: 8 }}>
          <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: textColor }}>{t.ourParking}</div>
        </div>
        <PhotoStrip />
      </div>

      <div style={{ padding: "0 clamp(14px,4vw,20px)" }}>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(10px,3vw,14px)", marginBottom: "clamp(12px,3vw,16px)" }}>
          {quickActions.map(function(a, i) {
            const { icon, labelKey, subKey, pg, color, bg } = a;
            return (
              <div
                key={pg}
                onClick={() => setPage(pg)}
                style={{
                  background: bg,
                  border: "1.5px solid " + color + "33",
                  borderRadius: "clamp(14px,4vw,20px)",
                  padding: "clamp(14px,4vw,20px) clamp(12px,3.5vw,18px)",
                  cursor: "pointer", transition: "all .22s",
                  boxShadow: "0 4px 18px " + color + "22",
                  animation: "fadeIn .4s ease " + (i * 0.08) + "s both"
                }}
                onMouseEnter={function(e) { e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={function(e) { e.currentTarget.style.transform = ""; }}
              >
                <div style={{ fontSize: "clamp(26px,7vw,32px)", marginBottom: 8, animation: "bounce 2s ease-in-out infinite", animationDelay: (i * 0.3) + "s" }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: "clamp(12px,3.5vw,14px)", color: textColor }}>{t[labelKey]}</div>
                <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: color, marginTop: 2, fontWeight: 700 }}>{t[subKey]}</div>
              </div>
            );
          })}
        </div>

        {/* AI Prediction */}
        <AIPredictionCard t={t} />

        {/* Parking map */}
        <Card style={{ marginBottom: "clamp(12px,3vw,16px)", animation: "fadeIn .5s ease .2s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: textColor }}>{t.parkingMap}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: greenColor, animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 11, color: greenColor, fontWeight: 700 }}>{t.live}</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "clamp(4px,1.5vw,8px)", marginBottom: 8 }}>
            {spots && spots.map(function(spot) {
              const { id, status } = spot;
              const cfg = STATUS_CFG[status] || STATUS_CFG["available"];
              const isMySpot = id === bookedId;
              return (
                <div key={id} style={{
                  background: cfg["bg"],
                  border: isMySpot ? "2px solid " + accentColor : "1.5px solid " + cfg["color"] + "55",
                  borderRadius: "clamp(6px,2vw,10px)",
                  padding: "clamp(8px,2.5vw,12px) 4px",
                  textAlign: "center",
                  boxShadow: isMySpot ? "0 0 0 3px " + accentColor + "33" : "none"
                }}>
                  <div style={{ fontSize: "clamp(9px,2.5vw,11px)", fontWeight: 800, color: cfg["color"] }}>{id}</div>
                  {isMySpot && <div style={{ fontSize: 8, color: accentColor, fontWeight: 900 }}>★</div>}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: subColor, fontWeight: 600 }}>★ = موقفك</div>
        </Card>

        {/* Wrong car alert */}
        <WrongCarAlert spotId={bookedId} />

        {/* Active booking */}
        {bookedSpot && (
          <Card style={{ marginBottom: "clamp(12px,3vw,16px)", animation: "fadeIn .5s ease .35s both" }}>
            <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", marginBottom: 14, color: textColor }}>{t.activeBooking}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "clamp(26px,7vw,32px)", fontWeight: 900, color: accentColor, fontFamily: "'Poppins',sans-serif" }}>{bookedId}</div>
                <div style={{ fontSize: "clamp(11px,3vw,13px)", color: subColor, fontWeight: 600 }}>Zone {bookedZone}</div>
                <div style={{ fontSize: 11, color: subColor, marginTop: 4, fontFamily: "monospace", fontWeight: 700 }}>🏷️ {bookedTagId}</div>
              </div>
              <Badge label={badgeCfg["label"]} color={badgeCfg["color"]} bg={badgeCfg["bg"]} />
            </div>
            <Btn onClick={() => setPage("checkout")} style={{ marginTop: 12 }} icon="🚪">{t.checkout}</Btn>
          </Card>
        )}

        {/* Occupancy timer */}
        <OccupancyTimer spotId={bookedId} pricePerHour={2} />

        {/* IoT Sensor simulation */}
        <IoTSensor reservedSpot={bookedId} reservedTagId={bookedTagId} />

      </div>
    </div>
  );
}
