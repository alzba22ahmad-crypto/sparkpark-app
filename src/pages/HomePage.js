import { useState, useEffect } from "react";
import { T, STATUS_CFG } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Card, Badge } from "../components/UI";
import { HeroHeader, SliderBanner, PhotoStrip } from "../components/Visuals";
import { IoTSensor, OccupancyTimer, WrongCarAlert } from "../components/IoTSensors";

export default function HomePage({ setPage, user, spots }) {
  const { t } = useLang();
  
  // حساب المواقف المتوفرة
  const avail = spots ? spots.filter(s => s.status === "available").length : 0;
  
  const [tick, setTick] = useState(0);
  useEffect(() => { 
    const ti = setInterval(() => setTick(p => p + 1), 2000); 
    return () => clearInterval(ti); 
  }, []);

  // تعديل الـ page لزر البحث عن السيارة ليكون "find" ليطابق App.js
  const quickActions = [
    { icon: "🅿️", labelKey: "bookSpot", subKey: "bookSub", page: "reserve", color: T.accent, bg: "#eff6ff" },
    { icon: "⚡", labelKey: "instantPark", subKey: "instantSub", page: "adhoc", color: T.yellow, bg: "#fffbeb" },
    { icon: "🔍", labelKey: "findCar", subKey: "findCarSub", page: "find", color: T.green, bg: "#f0fdf4" }, // تم التعديل هنا
    { icon: "🔔", labelKey: "notifications", subKey: "notifSub", page: "notifications", color: "#8b5cf6", bg: "#f5f3ff" },
  ];

  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <HeroHeader avail={avail} tick={tick} />
      <SliderBanner />

      <div style={{ padding: "16px 0 0" }}>
        <div style={{ padding: "0 clamp(14px,4vw,20px)", marginBottom: 8 }}>
          <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: T.text }}>{t.ourParking}</div>
        </div>
        <PhotoStrip />
      </div>

      <div style={{ padding: "0 clamp(14px,4vw,20px)" }}>
        {/* Wrong car alert - يظهر تلقائياً إذا كانت سيارة غير مصرح لها */}
        <WrongCarAlert spotId="B3" />

        {/* Quick actions - الأزرار السريعة */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(10px,3vw,14px)", marginBottom: "clamp(12px,3vw,16px)" }}>
          {quickActions.map((a, i) => (
            <div 
              key={a.page} 
              onClick={() => setPage(a.page)} 
              style={{ 
                background: a.bg, 
                border: `1.5px solid ${a.color}33`, 
                borderRadius: "clamp(14px,4vw,20px)", 
                padding: "clamp(14px,4vw,20px) clamp(12px,3.5vw,18px)", 
                cursor: "pointer", 
                transition: "all .22s", 
                boxShadow: `0 4px 18px ${a.color}22`, 
                animation: `fadeIn .4s ease ${i * 0.08}s both` 
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
            >
              <div style={{ fontSize: "clamp(26px,7vw,32px)", marginBottom: 8, animation: `bounce 2s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}>{a.icon}</div>
              <div style={{ fontWeight: 800, fontSize: "clamp(12px,3.5vw,14px)", color: T.text }}>{t[a.labelKey]}</div>
              <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: a.color, marginTop: 2, fontWeight: 700 }}>{t[a.subKey]}</div>
            </div>
          ))}
        </div>

        {/* Parking map - خريطة المواقف */}
        <Card style={{ marginBottom: "clamp(12px,3vw,16px)", animation: "fadeIn .5s ease .2s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: T.text }}>{t.parkingMap}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 11, color: T.green, fontWeight: 700 }}>{t.live}</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "clamp(4px,1.5vw,8px)", marginBottom: 12 }}>
            {spots && spots.map(s => (
              <div key={s.id} style={{ background: STATUS_CFG[s.status].bg, border: `1.5px solid ${STATUS_CFG[s.status].color}55`, borderRadius: "clamp(6px,2vw,10px)", padding: "clamp(8px,2.5vw,12px) 4px", textAlign: "center" }}>
                <div style={{ fontSize: "clamp(9px,2.5vw,11px)", fontWeight: 800, color: STATUS_CFG[s.status].color }}>{s.id}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active booking - الحجز الحالي */}
        <Card style={{ marginBottom: "clamp(12px,3vw,16px)", animation: "fadeIn .5s ease .35s both" }}>
          <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", marginBottom: 14, color: T.text }}>{t.activeBooking}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "clamp(26px,7vw,32px)", fontWeight: 900, color: T.accent, fontFamily: "'Poppins',sans-serif" }}>B3</div>
              <div style={{ fontSize: "clamp(11px,3vw,13px)", color: T.sub, fontWeight: 600 }}>{t.zoneB}</div>
            </div>
            <Badge label={t.reserved} color={T.yellow} bg="#fef3c7" />
          </div>
          <Btn onClick={() => setPage("checkout")} style={{ marginTop: 12 }} icon="🚪">{t.checkout}</Btn>
        </Card>

        {/* Occupancy timer - يظهر تلقائياً عند دخول السيارة الصحيحة */}
        <OccupancyTimer spotId="B3" pricePerHour={2} />

        <IoTSensor reservedSpot="B3" reservedTagId="VH-3301" />
      </div>
    </div>
  );
}