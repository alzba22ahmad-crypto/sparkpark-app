import { useState, useEffect } from "react";
import { T, STATUS_CFG } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Card, Badge } from "../components/UI";
import { HeroHeader, SliderBanner, PhotoStrip } from "../components/Visuals";
import { IoTSensor, OccupancyTimer, WrongCarAlert } from "../components/IoTSensors";

export default function HomePage({ setPage, user, spots, sensors }) {
  const { t } = useLang();

  const avail = spots ? spots.filter(function(s) { return s["status"] === "available"; }).length : 0;

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const ti = setInterval(() => setTick(function(p) { return p + 1; }), 2000);
    return () => clearInterval(ti);
  }, []);

  const accentColor  = T["accent"];
  const yellowColor  = T["yellow"];
  const greenColor   = T["green"];
  const textColor    = T["text"];
  const subColor     = T["sub"];

  const quickActions = [
    { icon: "🅿️", labelKey: "bookSpot",      subKey: "bookSub",    pg: "reserve",       color: accentColor,  bg: "#eff6ff" },
    { icon: "⚡",  labelKey: "instantPark",   subKey: "instantSub", pg: "adhoc",         color: yellowColor,  bg: "#fffbeb" },
    { icon: "🔍", labelKey: "findCar",        subKey: "findCarSub", pg: "find",          color: greenColor,   bg: "#f0fdf4" },
    { icon: "🔔", labelKey: "notifications",  subKey: "notifSub",   pg: "notifications", color: "#8b5cf6",    bg: "#f5f3ff" },
  ];

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
              return (
                <div key={id} style={{ background: cfg["bg"], border: `1.5px solid ${cfg["color"]}55`, borderRadius: "clamp(6px,2vw,10px)", padding: "clamp(8px,2.5vw,12px) 4px", textAlign: "center" }}>
                  <div style={{ fontSize: "clamp(9px,2.5vw,11px)", fontWeight: 800, color: cfg["color"] }}>{id}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Wrong car alert */}
        <WrongCarAlert spotId="B3" />

        {/* Active booking */}
        <Card style={{ marginBottom: "clamp(12px,3vw,16px)", animation: "fadeIn .5s ease .35s both" }}>
          <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", marginBottom: 14, color: textColor }}>{t.activeBooking}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "clamp(26px,7vw,32px)", fontWeight: 900, color: accentColor, fontFamily: "'Poppins',sans-serif" }}>B3</div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: subColor, fontWeight: 600 }}>{t.zoneB}</div>
            </div>
            <Badge label={t.reserved} color={yellowColor} bg="#fef3c7" />
          </div>
          <Btn onClick={() => setPage("checkout")} style={{ marginTop: 12 }} icon="🚪">{t.checkout}</Btn>
        </Card>

        {/* Occupancy timer */}
        <OccupancyTimer spotId="B3" pricePerHour={2} />

        {/* IoT Sensor */}
        <IoTSensor reservedSpot="B3" reservedTagId="VH-3301" />

      </div>
    </div>
  );
}
