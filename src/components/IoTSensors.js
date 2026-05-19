import { useState, useEffect } from "react";
import { T } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Card, Btn, WaveLoader } from "./UI";

/*
  IoT Sensor Simulation:
  - Shows a sensor panel that can be triggered
  - Simulates reading a vehicle's RFID Tag ID from the ground sensor
  - Matches scanned tag against the reserved spot's registered tag
  - Shows MATCH ✅ or MISMATCH ❌ with animation
*/

// Simulated vehicle tags that might approach
const APPROACHING_VEHICLES = [
  { tagId: "VH-3301", plate: "B3-OWNER", match: true },   // correct car for B3
  { tagId: "VH-9999", plate: "XYZ-0000", match: false },  // wrong car
  { tagId: "VH-2341", plate: "ABC-1234", match: false },  // different reservation
];

export function IoTSensor({ reservedSpot = "B3", reservedTagId = "VH-3301" }) {
  const { t } = useLang();
  const [phase, setPhase] = useState("idle"); // idle | approaching | reading | match | mismatch
  const [scannedTag, setScannedTag] = useState(null);
  const [vehicleIdx, setVehicleIdx] = useState(0);
  const [readProgress, setReadProgress] = useState(0);

  const simulate = () => {
    const vehicle = APPROACHING_VEHICLES[vehicleIdx % APPROACHING_VEHICLES.length];
    setVehicleIdx(i => i + 1);
    setScannedTag(null);
    setReadProgress(0);
    setPhase("approaching");

    // Step 1: approaching
    setTimeout(() => {
      setPhase("reading");
      // Animate progress bar
      let prog = 0;
      const interval = setInterval(() => {
        prog += 8;
        setReadProgress(Math.min(prog, 100));
        if (prog >= 100) clearInterval(interval);
      }, 60);

      // Step 2: result
      setTimeout(() => {
        setScannedTag(vehicle.tagId);
        setPhase(vehicle.tagId === reservedTagId ? "match" : "mismatch");
      }, 1800);
    }, 1200);
  };

  const reset = () => { setPhase("idle"); setScannedTag(null); setReadProgress(0); };

  return (
    <Card style={{ marginBottom: 16, overflow: "hidden", animation: "fadeIn .4s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: T.text, marginBottom: 4 }}>{t.sensorTitle}</div>
        <div style={{ fontSize: "clamp(11px,3vw,12px)", color: T.muted, fontWeight: 600 }}>{t.sensorSub}</div>
      </div>

      {/* Sensor visual */}
      <div style={{ position: "relative", background: "linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius: 16, padding: "clamp(16px,5vw,24px)", marginBottom: 16, overflow: "hidden", minHeight: 140 }}>
        {/* Grid lines (parking floor effect) */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,rgba(59,130,246,0.07) 0px,rgba(59,130,246,0.07) 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,rgba(59,130,246,0.07) 0px,rgba(59,130,246,0.07) 1px,transparent 1px,transparent 32px)", borderRadius: 16 }} />

        {/* Sensor circle */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: "clamp(64px,17vw,80px)", height: "clamp(64px,17vw,80px)", borderRadius: "50%",
            background: phase === "match" ? "linear-gradient(135deg,#10b981,#059669)"
              : phase === "mismatch" ? "linear-gradient(135deg,#ef4444,#dc2626)"
              : phase === "reading" ? "linear-gradient(135deg,#f59e0b,#d97706)"
              : "linear-gradient(135deg,#334155,#475569)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "clamp(26px,7vw,32px)",
            boxShadow: phase === "match" ? "0 0 0 0 rgba(16,185,129,0.4)" : phase === "mismatch" ? "0 0 0 0 rgba(239,68,68,0.4)" : "none",
            animation: phase === "match" ? "sensorPulse 1.5s ease-in-out infinite"
              : phase === "mismatch" ? "sensorWarn 1.5s ease-in-out infinite"
              : phase === "reading" ? "spin 1.5s linear infinite"
              : "none",
            transition: "background 0.4s ease",
          }}>
            {phase === "idle" && "📡"}
            {phase === "approaching" && "🚗"}
            {phase === "reading" && "🔬"}
            {phase === "match" && "✅"}
            {phase === "mismatch" && "❌"}
          </div>

          {/* Status text */}
          <div style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(12px,3.5vw,14px)", textAlign: "center" }}>
            {phase === "idle" && <span style={{ color: "#64748b" }}>{t.sensorIdle}</span>}
            {phase === "approaching" && <span style={{ color: "#7dd3fc", animation: "pulse 1s infinite" }}>{t.vehicleApproaching}</span>}
            {phase === "reading" && <span style={{ color: "#fbbf24" }}>{t.readingTag}</span>}
            {phase === "match" && <span style={{ color: "#34d399", animation: "popIn .4s ease" }}>{t.matchFound}</span>}
            {phase === "mismatch" && <span style={{ color: "#f87171", animation: "popIn .4s ease" }}>{t.matchFail}</span>}
          </div>

          {/* Progress bar for reading */}
          {phase === "reading" && (
            <div style={{ width: "100%", maxWidth: 200, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${readProgress}%`, background: "linear-gradient(90deg,#f59e0b,#fbbf24)", borderRadius: 6, transition: "width 0.1s linear" }} />
            </div>
          )}
        </div>

        {/* Scan lines animation when reading */}
        {phase === "reading" && (
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "linear-gradient(0deg,transparent 0%,rgba(251,191,36,0.06) 50%,transparent 100%)", animation: "imgScroll 1s linear infinite", pointerEvents: "none" }} />
        )}
      </div>

      {/* Tag comparison — shown after scan */}
      {(phase === "match" || phase === "mismatch") && scannedTag && (
        <div style={{ background: T.card2, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "clamp(12px,3.5vw,16px)", marginBottom: 14, animation: "slideUp .4s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{t.tagRead}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: phase === "match" ? T.green : T.red, fontFamily: "monospace" }}>{scannedTag}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{t.registeredTag}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: T.accent, fontFamily: "monospace" }}>{reservedTagId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{t.spotStatus}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: T.yellow }}>🔒 {t.reserved}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{t.spotStatus === "Spot Status" ? "Access" : "الوصول"}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: phase === "match" ? T.green : T.red }}>
              {phase === "match" ? `🔓 ${t.accessGranted}` : `🔒 ${t.accessDenied}`}
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {phase === "idle" && (
        <Btn onClick={simulate} icon="📡">{t.simulateEntry}</Btn>
      )}
      {phase === "approaching" && (
        <div style={{ textAlign: "center", padding: "8px 0" }}><WaveLoader /></div>
      )}
      {phase === "reading" && (
        <div style={{ textAlign: "center", padding: "8px 0" }}><WaveLoader /></div>
      )}
      {(phase === "match" || phase === "mismatch") && (
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={simulate} variant={phase === "match" ? "green" : "danger"} style={{ flex: 1 }} icon="🔄">{t.scanAgain}</Btn>
          <Btn onClick={reset} variant="ghost" style={{ flex: 1 }}>✕</Btn>
        </div>
      )}

      {/* Spot info badge */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <div style={{ background: "#dbeafe", border: "1.5px solid #93c5fd", borderRadius: 20, padding: "4px 16px", fontSize: 11, fontWeight: 800, color: T.accent }}>
          🅿️ {t.spot}: {reservedSpot} · Tag: {reservedTagId}
        </div>
      </div>
    </Card>
  );
}