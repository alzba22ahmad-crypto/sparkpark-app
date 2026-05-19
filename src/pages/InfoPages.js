import { useState } from "react";
import { T } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Card, Badge, TopBar } from "../components/UI";

/* ─── NOTIFICATIONS ─── */
export function NotificationsPage({ setPage }) {
  const { t } = useLang();
  const notifs = [
    { id: 1, icon: "🟢", titleKey: "A1 Available", bodyKey: "New spot cleared nearby", time: "2 min", color: T.green },
    { id: 2, icon: "⏰", titleKey: "Booking Expiring", bodyKey: "Spot B3 ends in 15 min", time: "5 min", color: T.yellow },
    { id: 3, icon: "✅", titleKey: "Booking Confirmed", bodyKey: "C2 booked for Wednesday", time: "1h", color: T.accent },
    { id: 4, icon: "💳", titleKey: "Payment Done", bodyKey: "4 SAR deducted for A3", time: "Yesterday", color: "#8b5cf6" },
    { id: 5, icon: "🚗", titleKey: "Vehicle Detected", bodyKey: "VH-2341 entered B3 auto", time: "Yesterday", color: "#ec4899" },
  ];
  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.notifTitle} back onBack={() => setPage("home")} right={<span style={{ fontSize: 11, color: T.accent, fontWeight: 700, cursor: "pointer" }}>{t.readAll}</span>} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>
        {notifs.map((n, i) => (
          <div key={n.id} style={{ background: T.card, border: `1.5px solid ${n.color}33`, borderRadius: 16, padding: "clamp(12px,3.5vw,16px)", marginBottom: 10, display: "flex", gap: 12, boxShadow: `0 4px 16px ${n.color}11`, animation: `fadeIn .4s ease ${i * .07}s both` }}>
            <span style={{ fontSize: "clamp(20px,5.5vw,24px)" }}>{n.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,14px)", color: T.text }}>{n.titleKey}</div>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: n.color, flexShrink: 0 }} />
              </div>
              <div style={{ fontSize: "clamp(11px,3vw,12px)", color: T.sub, marginTop: 2, fontWeight: 600 }}>{n.bodyKey}</div>
              <div style={{ fontSize: "clamp(10px,2.5vw,11px)", color: T.muted, marginTop: 4 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── HISTORY ─── */
export function HistoryPage({ setPage }) {
  const { t } = useLang();
  const bookings = [
    { id: "#0847", spot: "B3", date: "6 May 2026", dur: "1h 47min", cost: "3.50 SAR", status: "completed", color: T.green },
    { id: "#0831", spot: "A1", date: "4 May 2026",  dur: "2h",      cost: "4.00 SAR", status: "completed", color: T.green },
    { id: "#0819", spot: "C2", date: "2 May 2026",  dur: "45min",   cost: "1.50 SAR", status: "completed", color: T.green },
    { id: "#0805", spot: "B4", date: "29 Apr 2026", dur: "—",       cost: "—",        status: "cancelled", color: T.red },
    { id: "#0791", spot: "A3", date: "25 Apr 2026", dur: "3h",      cost: "6.00 SAR", status: "completed", color: T.green },
  ];
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const filters = [{ key: "all", label: t.all }, { key: "completed", label: t.completed }, { key: "cancelled", label: t.cancelled }];
  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.historyTitle} back onBack={() => setPage("home")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {filters.map(f => (
            <div key={f.key} onClick={() => setFilter(f.key)} style={{ background: filter === f.key ? T.accent : "#e0eeff", color: filter === f.key ? "#fff" : T.sub, padding: "7px clamp(12px,3.5vw,18px)", borderRadius: 24, fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "all .2s", boxShadow: filter === f.key ? "0 4px 14px rgba(59,130,246,0.35)" : "none" }}>{f.label}</div>
          ))}
        </div>
        {filtered.map((b, i) => (
          <Card key={b.id} style={{ marginBottom: 12, animation: `fadeIn .4s ease ${i * .07}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: "clamp(18px,5vw,22px)" }}>🚗</span>
                  <span style={{ fontWeight: 800, fontSize: "clamp(14px,3.8vw,16px)", color: T.text }}>{t.spot} {b.spot}</span>
                </div>
                <div style={{ fontSize: "clamp(11px,3vw,12px)", color: T.sub, fontWeight: 600 }}>{b.date}</div>
                <div style={{ fontSize: "clamp(11px,3vw,12px)", color: T.sub, marginTop: 2 }}>{t.totalDuration}: {b.dur} · {b.cost}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge label={b.status === "completed" ? t.completed : t.cancelled} color={b.color} bg={b.color === T.green ? "#d1fae5" : "#fee2e2"} />
                <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>{b.id}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}