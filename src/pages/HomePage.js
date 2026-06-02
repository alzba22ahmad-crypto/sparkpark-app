import { useState, useEffect } from "react";
import { T, STATUS_CFG } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Card, Badge } from "../components/UI";
import { HeroHeader, SliderBanner, PhotoStrip } from "../components/Visuals";
import { IoTSensor, OccupancyTimer, WrongCarAlert } from "../components/IoTSensors";

export default function HomePage({ setPage, user, spots, sensors }) {
  const { t } = useLang();

  // ── ألوان محلية لتجنب T.x في JSX ──────────────────────────────
  const accentColor = T["accent"];
  const yellowColor = T["yellow"];
  const greenColor  = T["green"];
  const textColor   = T["text"];
  const subColor    = T["sub"];

  // ── المواقف المتوفرة ────────────────────────────────────────────
  const avail = spots ? spots.filter(function(s) { return s["status"] === "available"; }).length : 0;

  // ── إيجاد موقف المستخدم الحالي من Firebase ─────────────────────
  // نبحث عن الموقف المحجوز أو المشغول الذي يطابق تاج اليوزر
  const userTagId = user && user.vehicle ? user["vehicle"]["tagId"] : null;

  const bookedSpot = spots ? (
    // أولاً: ابحث عن موقف tagId يطابق تاج المستخدم
    spots.find(function(s) { return s["reservedTagId"] === userTagId || s["tagId"] === userTagId; }) ||
    // ثانياً: إذا ما لقينا، خذ أي موقف محجوز
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
                  border: `1.5px solid ${color}33`,
                  borderRadius: "clamp(14px,4vw,20px)",
                  padding: "clamp(14px,4vw,20px) clamp(12px,3.5vw,18px)",
                  cursor: "pointer",
                  transition: "all .22s",
                  boxShadow: `0 4px 18px ${color}22`,
                  animation: `fadeIn .4s ease ${i * 0.08}s both`
                }}
                onMouseEnter={function(e) { e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={function(e) { e.currentTarget.style.transform = ""; }}
              >
                <div style={{ fontSize: "clamp(26px,7vw,32px)", marginBottom: 8, animation: "bounce 2s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: "clamp(12px,3.5vw,14px)", color: textColor }}>{t[labelKey]}</div>
                <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: color, marginTop: 2, fontWeight: 700 }}>{t[subKey]}</div>
              </div>
            );
          })}
        </div>

        {/* Parking map */}
        <Card style={{ marginBottom: "clamp(12px,3vw,16px)", animation: "fadeIn .5s ease .2s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: textColor }}>{t.parkingMap}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: greenColor, animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 11, color: greenColor, fontWeight: 700 }}>{t.live}</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "clamp(4px,1.5vw,8px)", marginBottom: 12 }}>
            {spots && spots.map(function(spot) {
              const { id, status } = spot;
              const cfg = STATUS_CFG[status] || STATUS_CFG["available"];
              const isMySpot = id === bookedId;
              return (
                <div key={id} style={{
                  background: cfg["bg"],
                  border: isMySpot ? `2px solid ${accentColor}` : `1.5px solid ${cfg["color"]}55`,
                  borderRadius: "clamp(6px,2vw,10px)",
                  padding: "clamp(8px,2.5vw,12px) 4px",
                  textAlign: "center",
                  boxShadow: isMySpot ? `0 0 0 3px ${accentColor}33` : "none"
                }}>
                  <div style={{ fontSize: "clamp(9px,2.5vw,11px)", fontWeight: 800, color: cfg["color"] }}>{id}</div>
                  {isMySpot && <div style={{ fontSize: 8, color: accentColor, fontWeight: 900 }}>★</div>}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: subColor, fontWeight: 600 }}>★ = {t.yourSpot || "موقفك"}</div>
        </Card>

        {/* Wrong car alert - يظهر تلقائياً من Firebase */}
        <WrongCarAlert spotId={bookedId} />

        {/* Active booking */}
        {bookedSpot && (
          <Card style={{ marginBottom: "clamp(12px,3vw,16px)", animation: "fadeIn .5s ease .35s both" }}>
            <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", marginBottom: 14, color: textColor }}>{t.activeBooking}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "clamp(26px,7vw,32px)", fontWeight: 900, color: accentColor, fontFamily: "'Poppins',sans-serif" }}>{bookedId}</div>
                <div style={{ fontSize: "clamp(11px,3vw,13px)", color: subColor, fontWeight: 600 }}>{t.zone || "Zone"} {bookedZone}</div>
                <div style={{ fontSize: 11, color: subColor, marginTop: 4, fontFamily: "monospace", fontWeight: 700 }}>🏷️ {bookedTagId}</div>
              </div>
              <Badge label={badgeCfg["label"]} color={badgeCfg["color"]} bg={badgeCfg["bg"]} />
            </div>
            <Btn onClick={() => setPage("checkout")} style={{ marginTop: 12 }} icon="🚪">{t.checkout}</Btn>
          </Card>
        )}

        {/* Occupancy timer - يظهر تلقائياً من Firebase لما السيارة تدخل */}
        <OccupancyTimer spotId={bookedId} pricePerHour={2} />

        {/* IoT Sensor simulation */}
        <IoTSensor reservedSpot={bookedId} reservedTagId={bookedTagId} />

      </div>
    </div>
  );
}
