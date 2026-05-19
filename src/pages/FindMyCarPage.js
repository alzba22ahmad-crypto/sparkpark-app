import { useState } from "react";
import { T } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Card, TopBar, WaveLoader } from "../components/UI";
import { useGPS } from "../hooks/useGPS";

export default function FindMyCarPage({ setPage, user, spots }) {
  const { t } = useLang();
  const { userPos, watching, startWatching, stopWatching, getDistance, navigateTo } = useGPS();
  const [phase, setPhase] = useState("idle");
  const mySpot = spots.find(s => s.tagId === user.vehicle?.tagId);
  const handleFind = () => { setPhase("locating"); startWatching(); setTimeout(() => setPhase("found"), 2800); };
  const distText = () => {
    if (!userPos || !mySpot) return t.enableGPS;
    const d = getDistance(userPos.lat, userPos.lng, mySpot.lat, mySpot.lng);
    return d < 1000 ? `${d} m` : `${(d / 1000).toFixed(1)} km`;
  };
  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.findCarTitle} back onBack={() => setPage("home")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>
        <Card style={{ marginBottom: 16, animation: "fadeIn .4s ease" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: "clamp(48px,13vw,60px)", height: "clamp(48px,13vw,60px)", borderRadius: 16, background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(24px,6vw,30px)", animation: "bounce 2s ease-in-out infinite" }}>🚗</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "clamp(14px,3.5vw,16px)", color: T.text }}>{user.vehicle?.model}</div>
              <div style={{ fontSize: 12, color: T.sub, fontWeight: 600 }}>{user.vehicle?.plate} · {user.vehicle?.color}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Tag: <span style={{ color: T.accent, fontWeight: 700 }}>{user.vehicle?.tagId}</span></div>
            </div>
          </div>
        </Card>
        {phase === "idle" && (
          <Card style={{ textAlign: "center", padding: "clamp(24px,7vw,40px)", animation: "fadeIn .4s ease" }}>
            <div style={{ fontSize: "clamp(56px,15vw,72px)", marginBottom: 16, animation: "floatY 3s ease-in-out infinite" }}>🔭</div>
            <div style={{ fontWeight: 900, fontSize: "clamp(16px,4.5vw,20px)", marginBottom: 8, fontFamily: "'Poppins',sans-serif" }}>{t.whereIsMyCar}</div>
            <div style={{ fontSize: "clamp(12px,3.5vw,14px)", color: T.sub, marginBottom: 28, fontWeight: 600 }}>{t.findCarDesc}</div>
            <Btn onClick={handleFind} icon="📡">{t.findBtn}</Btn>
          </Card>
        )}
        {phase === "locating" && (
          <Card style={{ textAlign: "center", padding: "clamp(24px,7vw,40px)" }}>
            <div style={{ fontSize: "clamp(48px,13vw,64px)", marginBottom: 16, animation: "spin 2s linear infinite" }}>📡</div>
            <div style={{ fontWeight: 800, fontSize: "clamp(14px,4vw,17px)", color: T.accent, marginBottom: 16 }}>{t.locating}</div>
            <WaveLoader />
          </Card>
        )}
        {phase === "found" && mySpot && (
          <>
            <div style={{ background: "linear-gradient(135deg,#d1fae5,#a7f3d0)", border: "1.5px solid #6ee7b7", borderRadius: 20, padding: "clamp(16px,5vw,24px)", textAlign: "center", marginBottom: 14, animation: "popIn .5s ease" }}>
              <div style={{ fontSize: "clamp(40px,11vw,52px)", marginBottom: 8, animation: "bounce 1s ease-in-out infinite" }}>🎯</div>
              <div style={{ fontWeight: 900, fontSize: "clamp(18px,5vw,22px)", color: "#065f46", fontFamily: "'Poppins',sans-serif" }}>{t.carFound}</div>
              <div style={{ fontSize: "clamp(12px,3.5vw,14px)", color: "#047857", marginTop: 4, fontWeight: 600 }}>{t.spot} {mySpot.id}</div>
              <div style={{ fontSize: 12, color: "#047857", marginTop: 4 }}>{t.distance}: {distText()}</div>
            </div>
            <Btn variant="green" onClick={() => { setPhase("navigating"); navigateTo(mySpot.lat, mySpot.lng); }} style={{ marginBottom: 10 }} icon="🧭">{t.navigateToMyCar}</Btn>
            <Btn variant="ghost" onClick={() => { setPhase("idle"); stopWatching(); }}>{t.searchAgain}</Btn>
          </>
        )}
        {phase === "navigating" && (
          <Card style={{ textAlign: "center", padding: "clamp(24px,7vw,40px)", animation: "popIn .4s ease" }}>
            <div style={{ fontSize: "clamp(48px,13vw,64px)", marginBottom: 16, animation: "bounce 1s ease-in-out infinite" }}>🧭</div>
            <div style={{ fontWeight: 900, fontSize: "clamp(16px,4.5vw,20px)", color: T.accent, marginBottom: 8 }}>{t.navigating}</div>
            <Btn onClick={() => { setPhase("idle"); stopWatching(); setPage("home"); }}>{t.done}</Btn>
          </Card>
        )}
      </div>
    </div>
  );
}