import { useState } from "react";
import { T, PARKING_IMGS } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Card, Field, Row, Badge, TopBar } from "../components/UI";

/* ─── AD HOC (الموقف الفوري - مجاني بالكامل) ─── */
export function AdHocPage({ setPage, spots }) {
  const { t } = useLang();
  const [sel, setSel] = useState(null);
  const avail = spots.filter(s => s.status === "available");
  
  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={`⚡ ${t.instantPark}`} back onBack={() => setPage("home")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>
        <div style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)", border: "1.5px solid #fbbf24", borderRadius: 16, padding: "clamp(12px,3.5vw,16px)", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: "clamp(24px,6vw,28px)", animation: "bounce 2s infinite" }}>⚡</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: "#92400e" }}>{t.parkNow}</div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "#78350f", fontWeight: 600 }}>{t.parkNowSub}</div>
          </div>
        </div>
        <div style={{ fontWeight: 800, marginBottom: 12, color: T.text }}>{t.availableSpots} ({avail.length})</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(8px,2.5vw,12px)", marginBottom: 16 }}>
          {avail.map(s => (
            <div key={s.id} onClick={() => setSel(s)} style={{ background: sel?.id === s.id ? "linear-gradient(135deg,#3b82f6,#2563eb)" : "#d1fae5", border: `2px solid ${sel?.id === s.id ? "#3b82f6" : "#34d399"}`, borderRadius: "clamp(10px,3vw,14px)", padding: "clamp(12px,3.5vw,18px) 8px", textAlign: "center", cursor: "pointer", transition: "all .22s", transform: sel?.id === s.id ? "scale(1.06)" : "scale(1)" }}>
              <div style={{ fontSize: "clamp(12px,3.5vw,15px)", fontWeight: 900, color: sel?.id === s.id ? "#fff" : T.green }}>{s.id}</div>
            </div>
          ))}
        </div>
        {sel && (
          <Card style={{ marginBottom: 16, animation: "popIn .35s ease" }}>
            <div style={{ fontWeight: 800, marginBottom: 10, color: T.text }}>{t.spotDetails} {sel.id}</div>
            <Row label={t.zone} value={`${t.zone} ${sel.id[0]}`} />
            <Row label={t.status} value={t.free || "مجاني"} accent={T.green} />
            <Btn onClick={() => setPage("res-info")} style={{ marginTop: 14 }} icon="🅿️">{t.parkHere}</Btn>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ─── RESERVE (حجز موقف مع فلتر المسافة الذكي) ─── */
export function ReservePage({ setPage, spots }) {
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [distance, setDistance] = useState(3); // المسافة الافتراضية 3km
  const [form, setForm] = useState({ date: "", time: "", duration: "1", spotId: "", lat: null, lng: null });

  // منطق فلترة المواقف بناءً على المسافة المختارة
  const filteredSpots = spots.filter(s => s.status === "available" && (s.dist || 1) <= distance);

  const stepLabels = [t.chooseTime.replace("📅 ", ""), t.chooseSpot.replace("🗺️ ", ""), t.confirmBooking.replace("✅ ", "")];

  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.bookSpotTitle} back onBack={() => setPage("home")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {stepLabels.map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 6, borderRadius: 6, background: i + 1 <= step ? T.accent : T.bg2, marginBottom: 4 }} />
              <div style={{ fontSize: "clamp(9px,2.5vw,11px)", color: i + 1 <= step ? T.accent : T.muted, fontWeight: 700 }}>{s}</div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card style={{ animation: "slideUp .35s ease" }}>
            <div style={{ fontWeight: 800, marginBottom: 20, fontSize: 16, color: T.text }}>{t.chooseTime}</div>
            <Field label={t.date} type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            <Field label={t.time} type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
            <Btn onClick={() => setStep(2)} icon="→">{t.next}</Btn>
          </Card>
        )}

        {step === 2 && (
          <div style={{ animation: "slideUp .35s ease" }}>
            <Card style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 10, color: T.text }}>📍 ابحث في نطاق المسافة:</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[3, 10, 20].map(d => (
                  <div key={d} onClick={() => setDistance(d)} style={{ flex: 1, padding: "8px", textAlign: "center", borderRadius: 10, cursor: "pointer", background: distance === d ? T.accent : "#f1f5f9", color: distance === d ? "#fff" : T.sub, fontWeight: 800, border: `1.5px solid ${distance === d ? T.accent : T.border}` }}>
                    {d}km
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 15, color: T.text }}>{t.chooseSpot} ({filteredSpots.length})</div>
              {filteredSpots.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: T.muted }}>
                  لا توجد مواقف متاحة في نطاق {distance}km. حاول زيادة المسافة.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(8px,2.5vw,12px)", marginBottom: 16 }}>
                  {filteredSpots.map(s => (
                    <div key={s.id} onClick={() => setForm(p => ({ ...p, spotId: s.id, lat: s.lat, lng: s.lng }))} style={{ background: form.spotId === s.id ? "linear-gradient(135deg,#3b82f6,#2563eb)" : "#d1fae5", border: `2px solid ${form.spotId === s.id ? "#3b82f6" : "#34d399"}`, borderRadius: "clamp(10px,3vw,14px)", padding: "12px 6px", textAlign: "center", cursor: "pointer", transform: form.spotId === s.id ? "scale(1.05)" : "scale(1)" }}>
                      <div style={{ fontSize: "14px", fontWeight: 900, color: form.spotId === s.id ? "#fff" : T.green }}>{s.id}</div>
                      <div style={{ fontSize: "10px", color: form.spotId === s.id ? "#fff" : T.muted }}>{s.dist || 1}km</div>
                    </div>
                  ))}
                </div>
              )}
              <Btn onClick={() => setStep(3)} disabled={!form.spotId} icon="→">{t.next}</Btn>
              <Btn variant="ghost" onClick={() => setStep(1)} style={{ marginTop: 8 }}>{t.back}</Btn>
            </Card>
          </div>
        )}

        {step === 3 && (
          <Card style={{ animation: "slideUp .35s ease" }}>
            <div style={{ fontWeight: 800, marginBottom: 20, fontSize: 16, color: T.text }}>{t.confirmBooking}</div>
            <Row label={t.spot} value={form.spotId} />
            <Row label={t.date} value={form.date} />
            <Row label={t.time} value={form.time} />
            <Btn onClick={() => setPage("res-info")} style={{ marginTop: 20 }} icon="✅">{t.confirmBtn}</Btn>
            <Btn variant="ghost" onClick={() => setStep(2)} style={{ marginTop: 10 }}>{t.back}</Btn>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ─── RESERVATION INFO (تفاصيل الحجز و Google Maps) ─── */
export function ReservationInfoPage({ setPage }) {
  const { t } = useLang();

  // فتح قوقل ماب بالإحداثيات (مثال لجامعة IAU بالدمام)
  const handleNavigate = () => {
    const lat = 26.3927; 
    const lng = 50.1917;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.bookingDetails} back onBack={() => setPage("home")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>
        <div style={{ background: "linear-gradient(145deg,#2563eb,#3b82f6)", borderRadius: 24, padding: "30px", textAlign: "center", marginBottom: 16, color: "#fff" }}>
          <div style={{ fontSize: "50px", marginBottom: 10 }}>📍</div>
          <div style={{ fontSize: "32px", fontWeight: 900 }}>B3</div>
          <div style={{ fontSize: "14px", opacity: 0.9 }}>{t.bookedReady}</div>
        </div>

        <Btn onClick={handleNavigate} icon="🗺️" style={{ marginBottom: 12, background: "#4285F4" }}>
          {t.navigateToSpot || "فتح الموقع في Google Maps"}
        </Btn>

        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 12 }}>{t.bookingSummary}</div>
          <Row label={t.bookingNum} value="#SPK-2026-IAU" />
          <Row label={t.status} value={t.confirmed || "مؤكد"} accent={T.green} />
        </Card>
        
        <Btn onClick={() => setPage("home")} icon="🏠">{t.backHome}</Btn>
      </div>
    </div>
  );
}