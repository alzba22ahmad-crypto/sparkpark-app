import { useState, useEffect } from "react";
import { T } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Card, Btn, WaveLoader, Badge } from "./UI";
import { db } from "../firebase/firebase";
import { doc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

/*
  IoT Sensor Simulation:
  - Shows a sensor panel that can be triggered
  - Simulates reading a vehicle's RFID Tag ID from the ground sensor
  - Matches scanned tag against the reserved spot's registered tag
  - MATCH  ✅ → writes occupiedSince to Firestore (starts billing timer)
  - MISMATCH ❌ → writes wrongCarAlert with 15-min deadline to Firestore
*/

const APPROACHING_VEHICLES = [
  { tagId: "VH-3301", plate: "B3-OWNER", match: true },
  { tagId: "VH-9999", plate: "XYZ-0000", match: false },
  { tagId: "VH-2341", plate: "ABC-1234", match: false },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt2(n) { return String(n).padStart(2, "0"); }
function tsToMs(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate().getTime();
  if (ts.seconds) return ts.seconds * 1000;
  if (ts instanceof Date) return ts.getTime();
  return null;
}

// ─── Occupancy Timer ─────────────────────────────────────────────────────────
export function OccupancyTimer({ spotId = "B3", pricePerHour = 2 }) {
  const { t } = useLang();
  const [spotData, setSpotData] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "spots", spotId), snap => {
      setSpotData(snap.exists() ? snap.data() : null);
    });
    return () => unsub();
  }, [spotId]);

  useEffect(() => {
    const startMs = tsToMs(spotData?.occupiedSince);
    if (!startMs) { setElapsed(0); return; }
    const tick = () => setElapsed(Math.floor((Date.now() - startMs) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [spotData?.occupiedSince]);

  if (!tsToMs(spotData?.occupiedSince)) return null;

  const cost = ((elapsed / 3600) * pricePerHour).toFixed(2);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;

  return (
    <Card style={{ marginBottom: 16, animation: "fadeIn .4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: T.text }}>
          ⏱️ {t.occupancyTimer}
        </div>
        <Badge label={`🅿️ ${spotId}`} color={T.accent} bg="#dbeafe" />
      </div>

      <div style={{
        background: "linear-gradient(135deg,#1e3a5f,#2563eb)",
        borderRadius: 16, padding: "20px", textAlign: "center", marginBottom: 14
      }}>
        <div style={{
          fontFamily: "monospace", fontSize: "clamp(28px,8vw,36px)",
          fontWeight: 900, color: "#fff", letterSpacing: 4
        }}>
          {fmt2(h)}:{fmt2(m)}:{fmt2(s)}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4, fontWeight: 600 }}>
          {t.timeOccupied}
        </div>
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#f0fdf4", border: "1.5px solid #86efac",
        borderRadius: 12, padding: "12px 16px"
      }}>
        <span style={{ fontWeight: 700, color: T.sub, fontSize: 13 }}>{t.currentCost}</span>
        <span style={{ fontWeight: 900, color: T.green, fontSize: "clamp(18px,5vw,22px)", fontFamily: "monospace" }}>
          {cost} SAR
        </span>
      </div>
    </Card>
  );
}

// ─── Wrong Car Alert (15-min countdown) ──────────────────────────────────────
export function WrongCarAlert({ spotId = "B3" }) {
  const { t } = useLang();
  const [alertData, setAlertData] = useState(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "spots", spotId), snap => {
      const data = snap.exists() ? snap.data() : null;
      setAlertData(data?.wrongCarAlert ?? null);
    });
    return () => unsub();
  }, [spotId]);

  useEffect(() => {
    if (!alertData?.deadlineMs) { setRemaining(0); return; }
    const tick = () => setRemaining(Math.max(0, alertData.deadlineMs - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [alertData?.deadlineMs]);

  if (!alertData) return null;

  const expired = remaining === 0;
  const remMins = Math.floor(remaining / 60000);
  const remSecs = Math.floor((remaining % 60000) / 1000);

  const clearAlert = async () => {
    try {
      await updateDoc(doc(db, "spots", spotId), { wrongCarAlert: null });
    } catch (e) {
      console.error("clearAlert error:", e);
    }
  };

  return (
    <div style={{
      background: expired
        ? "linear-gradient(135deg,#dc2626,#b91c1c)"
        : "linear-gradient(135deg,#f59e0b,#d97706)",
      borderRadius: 20, padding: "clamp(16px,4vw,20px)", marginBottom: 16,
      animation: "sensorWarn 1.5s ease-in-out infinite",
      boxShadow: expired ? "0 8px 32px rgba(220,38,38,0.4)" : "0 8px 32px rgba(245,158,11,0.4)"
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontSize: "clamp(28px,8vw,36px)", animation: "bounce 1s infinite" }}>
          {expired ? "🚨" : "⚠️"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, color: "#fff", fontSize: "clamp(14px,4vw,16px)", marginBottom: 6 }}>
            {t.wrongCarTitle}
          </div>
          <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "clamp(11px,3vw,13px)", fontWeight: 600, marginBottom: 12 }}>
            {expired
              ? t.moveCarNow
              : `${t.moveCarAlert} ${fmt2(remMins)}:${fmt2(remSecs)} ${t.moveCarMin}`}
          </div>

          <div style={{
            background: "rgba(0,0,0,0.2)", borderRadius: 10,
            padding: "8px 12px", fontSize: 12, color: "#fff",
            fontFamily: "monospace", fontWeight: 700, marginBottom: 10
          }}>
            🏷️ {t.wrongCarTag}: {alertData.tagId}
          </div>

          {!expired && (
            <div style={{
              background: "rgba(0,0,0,0.3)", borderRadius: 12,
              padding: "8px 12px", textAlign: "center", marginBottom: 10
            }}>
              <div style={{
                fontFamily: "monospace", fontSize: "clamp(20px,6vw,26px)",
                color: "#fff", fontWeight: 900
              }}>
                {fmt2(remMins)}:{fmt2(remSecs)}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                {t.timeRemaining}
              </div>
            </div>
          )}

          <button
            onClick={clearAlert}
            style={{
              background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)",
              borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 12,
              padding: "6px 14px", cursor: "pointer", fontFamily: "Nunito,sans-serif"
            }}
          >
            ✕ {t.clearAlert}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main IoT Sensor (entry scan simulation) ─────────────────────────────────
export function IoTSensor({ reservedSpot = "B3", reservedTagId = "VH-3301" }) {
  const { t } = useLang();
  const [phase, setPhase] = useState("idle");
  const [scannedTag, setScannedTag] = useState(null);
  const [vehicleIdx, setVehicleIdx] = useState(0);
  const [readProgress, setReadProgress] = useState(0);

  const simulate = () => {
    const vehicle = APPROACHING_VEHICLES[vehicleIdx % APPROACHING_VEHICLES.length];
    setVehicleIdx(i => i + 1);
    setScannedTag(null);
    setReadProgress(0);
    setPhase("approaching");

    setTimeout(() => {
      setPhase("reading");
      let prog = 0;
      const interval = setInterval(() => {
        prog += 8;
        setReadProgress(Math.min(prog, 100));
        if (prog >= 100) clearInterval(interval);
      }, 60);

      setTimeout(async () => {
        const isMatch = vehicle.tagId === reservedTagId;
        setScannedTag(vehicle.tagId);
        setPhase(isMatch ? "match" : "mismatch");

        // ── Write sensor result to Firestore ──
        try {
          const spotRef = doc(db, "spots", reservedSpot);
          if (isMatch) {
            await updateDoc(spotRef, {
              status: "occupied",
              tagId: vehicle.tagId,
              occupiedSince: serverTimestamp(),
              wrongCarAlert: null,
            });
          } else {
            await updateDoc(spotRef, {
              wrongCarAlert: {
                tagId: vehicle.tagId,
                detectedAt: Date.now(),
                deadlineMs: Date.now() + 15 * 60 * 1000,
              },
            });
          }
        } catch (e) {
          console.error("IoT sensor Firebase write error:", e);
        }
      }, 1800);
    }, 1200);
  };

  const reset = () => { setPhase("idle"); setScannedTag(null); setReadProgress(0); };

  return (
    <Card style={{ marginBottom: 16, overflow: "hidden", animation: "fadeIn .4s ease" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: T.text, marginBottom: 4 }}>{t.sensorTitle}</div>
        <div style={{ fontSize: "clamp(11px,3vw,12px)", color: T.muted, fontWeight: 600 }}>{t.sensorSub}</div>
      </div>

      <div style={{
        position: "relative", background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
        borderRadius: 16, padding: "clamp(16px,5vw,24px)", marginBottom: 16, overflow: "hidden", minHeight: 140
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg,rgba(59,130,246,0.07) 0px,rgba(59,130,246,0.07) 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,rgba(59,130,246,0.07) 0px,rgba(59,130,246,0.07) 1px,transparent 1px,transparent 32px)",
          borderRadius: 16
        }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: "clamp(64px,17vw,80px)", height: "clamp(64px,17vw,80px)", borderRadius: "50%",
            background: phase === "match" ? "linear-gradient(135deg,#10b981,#059669)"
              : phase === "mismatch" ? "linear-gradient(135deg,#ef4444,#dc2626)"
              : phase === "reading" ? "linear-gradient(135deg,#f59e0b,#d97706)"
              : "linear-gradient(135deg,#334155,#475569)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "clamp(26px,7vw,32px)",
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

          <div style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(12px,3.5vw,14px)", textAlign: "center" }}>
            {phase === "idle"       && <span style={{ color: "#64748b" }}>{t.sensorIdle}</span>}
            {phase === "approaching" && <span style={{ color: "#7dd3fc", animation: "pulse 1s infinite" }}>{t.vehicleApproaching}</span>}
            {phase === "reading"    && <span style={{ color: "#fbbf24" }}>{t.readingTag}</span>}
            {phase === "match"      && <span style={{ color: "#34d399", animation: "popIn .4s ease" }}>{t.matchFound}</span>}
            {phase === "mismatch"   && <span style={{ color: "#f87171", animation: "popIn .4s ease" }}>{t.matchFail}</span>}
          </div>

          {phase === "reading" && (
            <div style={{ width: "100%", maxWidth: 200, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${readProgress}%`, background: "linear-gradient(90deg,#f59e0b,#fbbf24)", borderRadius: 6, transition: "width 0.1s linear" }} />
            </div>
          )}
        </div>

        {phase === "reading" && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: 16,
            background: "linear-gradient(0deg,transparent 0%,rgba(251,191,36,0.06) 50%,transparent 100%)",
            animation: "imgScroll 1s linear infinite", pointerEvents: "none"
          }} />
        )}
      </div>

      {(phase === "match" || phase === "mismatch") && scannedTag && (
        <div style={{
          background: T.card2, border: `1.5px solid ${T.border}`,
          borderRadius: 14, padding: "clamp(12px,3.5vw,16px)", marginBottom: 14, animation: "slideUp .4s ease"
        }}>
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
            <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{t.access}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: phase === "match" ? T.green : T.red }}>
              {phase === "match" ? `🔓 ${t.accessGranted}` : `🔒 ${t.accessDenied}`}
            </span>
          </div>
        </div>
      )}

      {phase === "idle" && <Btn onClick={simulate} icon="📡">{t.simulateEntry}</Btn>}
      {(phase === "approaching" || phase === "reading") && (
        <div style={{ textAlign: "center", padding: "8px 0" }}><WaveLoader /></div>
      )}
      {(phase === "match" || phase === "mismatch") && (
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={simulate} variant={phase === "match" ? "green" : "danger"} style={{ flex: 1 }} icon="🔄">{t.scanAgain}</Btn>
          <Btn onClick={reset} variant="ghost" style={{ flex: 1 }}>✕</Btn>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <div style={{ background: "#dbeafe", border: "1.5px solid #93c5fd", borderRadius: 20, padding: "4px 16px", fontSize: 11, fontWeight: 800, color: T.accent }}>
          🅿️ {t.spot}: {reservedSpot} · Tag: {reservedTagId}
        </div>
      </div>
    </Card>
  );
}
