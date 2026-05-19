import { useState } from "react";
import { T, PARKING_IMGS } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Card, Field, Badge, TopBar } from "../components/UI";

// ====================== Firebase Imports ======================
import { db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
// =============================================================

/* ─── PROFILE ─── */
export function ProfilePage({ setPage, user }) {
  const { t } = useLang();
  const stats = [
    { labelKey: "bookings", val: "12", icon: "🅿️", color: T.accent, bg: "#dbeafe" },
    { labelKey: "hours",    val: "18", icon: "⏱️", color: "#8b5cf6", bg: "#ede9fe" },
    { labelKey: "sarSaved", val: "24", icon: "💰", color: T.green,   bg: "#dcfce7" },
    { labelKey: "kmLess",   val: "32", icon: "🛣️", color: T.yellow,  bg: "#fef9c3" },
  ];
  const menu = [
    { icon: "✏️", labelKey: "editProfile", page: "edit-profile" },
    { icon: "🚗", labelKey: "myCars",      page: "vehicles" },
    { icon: "🔔", labelKey: "notifications", page: "notifications" },
    { icon: "🎧", labelKey: "support",     page: "support" },
  ];
  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.profileTitle} />
      <div style={{ position: "relative", overflow: "hidden", marginBottom: 0 }}>
        <img src={PARKING_IMGS[4]} alt="" style={{ width: "100%", height: 120, objectFit: "cover", filter: "blur(2px) brightness(0.4)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(37,99,235,0.6),rgba(59,130,246,0.4))" }} />
        <div style={{ position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ width: "clamp(68px,18vw,84px)", height: "clamp(68px,18vw,84px)", borderRadius: "50%", margin: "0 auto", background: "linear-gradient(135deg,#bfdbfe,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(28px,8vw,34px)", boxShadow: "0 8px 28px rgba(59,130,246,0.5)", border: "3px solid #fff" }}>👤</div>
        </div>
      </div>
      <div style={{ padding: "clamp(14px,4vw,20px)", paddingTop: "clamp(48px,14vw,60px)" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 900, fontSize: "clamp(16px,4.5vw,20px)", color: T.text, fontFamily: "'Poppins',sans-serif" }}>{user?.name || "المستخدم"}</div>
          <div style={{ fontSize: "clamp(11px,3vw,13px)", color: T.sub, marginTop: 4, fontWeight: 600 }}>{user?.email}</div>
          <div style={{ marginTop: 12 }}><Badge label={t.verified} color={T.accent} bg="#dbeafe" /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "clamp(10px,3vw,14px)", marginBottom: 16 }}>
          {stats.map((s, i) => (
            <Card key={s.labelKey} style={{ textAlign: "center", background: s.bg, border: `1.5px solid ${s.color}22`, animation: `fadeIn .4s ease ${i * .08}s both` }}>
              <div style={{ fontSize: "clamp(22px,6vw,26px)", marginBottom: 6, animation: `bounce 2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>{s.icon}</div>
              <div style={{ fontSize: "clamp(18px,5vw,22px)", fontWeight: 900, color: s.color, fontFamily: "'Poppins',sans-serif" }}>{s.val}</div>
              <div style={{ fontSize: "clamp(10px,2.8vw,12px)", color: T.sub, fontWeight: 700 }}>{t[s.labelKey]}</div>
            </Card>
          ))}
        </div>
        <Card style={{ animation: "fadeIn .4s ease .15s both" }}>
          {menu.map((item, i, arr) => (
            <div key={item.page} onClick={() => setPage(item.page)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px,3.5vw,15px) 0", cursor: "pointer", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none", transition: "all .2s" }}>
              <span style={{ fontSize: "clamp(18px,5vw,22px)" }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 700, color: T.text }}>{t[item.labelKey]}</span>
              <span style={{ color: T.muted, fontSize: 18 }}>›</span>
            </div>
          ))}
        </Card>
        <Btn variant="danger" onClick={() => setPage("login")} icon="🚪" style={{ marginTop: 16 }}>{t.logout}</Btn>
      </div>
    </div>
  );
}

/* ─── EDIT PROFILE ─── */
export function EditProfilePage({ setPage, user, setUser }) {
  const { t } = useLang();
  const [form, setForm] = useState({ 
    name: user?.name || "", 
    email: user?.email || "", 
    phone: user?.phone || "+966 501 234 567", 
    city: user?.city || "Dammam" 
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveChanges = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: form.name,
        phone: form.phone,
        city: form.city
      });
      
      setUser(prev => ({ ...prev, name: form.name, phone: form.phone, city: form.city }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.editProfileTitle} back onBack={() => setPage("profile")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: "clamp(72px,18vw,88px)", height: "clamp(72px,18vw,88px)", borderRadius: "50%", margin: "0 auto 12px", background: "linear-gradient(135deg,#bfdbfe,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(30px,8vw,36px)", boxShadow: "0 8px 28px rgba(59,130,246,0.3)", animation: "floatY 4s ease-in-out infinite" }}>👤</div>
          <div style={{ fontSize: 12, color: T.accent, cursor: "pointer", fontWeight: 700 }}>{t.changePhoto}</div>
        </div>
        <Card>
          <Field label={t.fullName} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} icon="👤" />
          <Field label={t.email} type="email" value={form.email} disabled icon="📧" style={{ opacity: 0.7 }} />
          <Field label={t.phone} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} icon="📱" />
          <Field label={t.city} value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} icon="🏙️" />
          {saved ? (
            <div style={{ textAlign: "center", color: T.green, fontWeight: 800, padding: 12, animation: "popIn .3s ease" }}>{t.saved}</div>
          ) : (
            <Btn onClick={handleSaveChanges} disabled={loading} icon="💾">
              {loading ? "جاري الحفظ..." : t.saveChanges}
            </Btn>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ─── VEHICLES ─── */
export function VehiclesPage({ setPage, user, setUser }) {
  const { t } = useLang();
  
  // التعديل السحري: التحقق أولاً من وجود مصفوفة vehicles، وإذا لم توجد يتحقق من وجود كائن vehicle المفرد ويحوله لمصفوفة
  const initialVehicles = user?.vehicles?.length > 0 
    ? user.vehicles 
    : (user?.vehicle?.model ? [{ id: 1, ...user.vehicle, active: true }] : []);

  const [vehicles, setVehicles] = useState(initialVehicles);
  const [adding, setAdding] = useState(false);
  const [newCar, setNewCar] = useState({ plate: "", model: "", color: "" });
  const [loading, setLoading] = useState(false);

  const updateFirebaseVehicles = async (updatedList) => {
    if (!user?.uid) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { vehicles: updatedList });
      setUser(prev => ({ ...prev, vehicles: updatedList }));
    } catch (error) {
      console.error("Error updating vehicles in database:", error);
    }
  };

  const handleAddVehicle = async () => {
    if (!newCar.plate || !newCar.model) {
      alert("الرجاء إدخال موديل السيارة ورقم اللوحة");
      return;
    }
    setLoading(true);
    const addedCar = {
      id: Date.now(),
      plate: newCar.plate,
      model: newCar.model,
      color: newCar.color || "White",
      tagId: `VH-${Math.floor(Math.random() * 9000 + 1000)}`,
      active: vehicles.length === 0 ? true : false
    };

    const updatedList = [...vehicles, addedCar];
    setVehicles(updatedList);
    await updateFirebaseVehicles(updatedList);
    
    setAdding(false);
    setNewCar({ plate: "", model: "", color: "" });
    setLoading(false);
  };

  const handleDeleteVehicle = async (id) => {
    const updatedList = vehicles.filter(x => x.id !== id);
    setVehicles(updatedList);
    await updateFirebaseVehicles(updatedList);
  };

  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.vehiclesTitle} back onBack={() => setPage("profile")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>
        {vehicles.map((v, i) => (
          <Card key={v.id} style={{ marginBottom: 12, animation: `fadeIn .4s ease ${i * .08}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: "clamp(44px,12vw,56px)", height: "clamp(44px,12vw,56px)", borderRadius: 14, background: v.active ? "linear-gradient(135deg,#dbeafe,#bfdbfe)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(20px,5.5vw,26px)", animation: v.active ? "bounce 3s ease-in-out infinite" : "none" }}>🚗</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "clamp(13px,3.5vw,15px)", color: T.text }}>{v.model}</div>
                  <div style={{ fontSize: 12, color: T.sub, fontWeight: 600 }}>{v.plate} · {v.color}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Tag: <span style={{ color: T.accent, fontWeight: 700 }}>{v.tagId}</span></div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <Badge label={v.active ? t.active : t.inactive} color={v.active ? T.green : T.muted} />
                <span style={{ fontSize: 11, color: T.red, cursor: "pointer", fontWeight: 700 }} onClick={() => handleDeleteVehicle(v.id)}>{t.delete}</span>
              </div>
            </div>
          </Card>
        ))}
        {adding ? (
          <Card style={{ marginBottom: 12, animation: "slideUp .35s ease" }}>
            <div style={{ fontWeight: 800, marginBottom: 16, color: T.text }}>{t.addNewVehicle}</div>
            <Field label={t.plateNum} placeholder="ABC-1234" value={newCar.plate} onChange={e => setNewCar(p => ({ ...p, plate: e.target.value }))} />
            <Field label={t.model} placeholder="Toyota Camry" value={newCar.model} onChange={e => setNewCar(p => ({ ...p, model: e.target.value }))} />
            <Field label={t.color} placeholder="White" value={newCar.color} onChange={e => setNewCar(p => ({ ...p, color: e.target.value }))} />
            <Btn onClick={handleAddVehicle} disabled={loading} icon="✅" style={{ marginBottom: 10 }}>
              {loading ? "جاري الإضافة..." : t.addBtn}
            </Btn>
            <Btn variant="ghost" onClick={() => setAdding(false)}>{t.cancel}</Btn>
          </Card>
        ) : (
          <Btn variant="ghost" onClick={() => setAdding(true)} icon="➕">{t.addVehicle}</Btn>
        )}
      </div>
    </div>
  );
}

/* ─── SUPPORT ─── */
export function SupportPage({ setPage }) {
  const { t } = useLang();
  const [msg, setMsg] = useState(""); const [sent, setSent] = useState(false); const [open, setOpen] = useState(null);
  const faqs = [
    { q: "How do I book a spot?",    a: "Tap 'Book a Spot' from home and follow the 3 steps: time, spot, confirm." },
    { q: "How does Tag ID work?",    a: "Tag ID is an RFID card unique to your vehicle for auto-detection on entry/exit." },
    { q: "What if I'm late?",        a: "You get a 10-min grace period before extra charges apply." },
    { q: "How does Find My Car work?", a: "The system uses Tag ID + IoT sensors to locate your car then guides you to it." },
  ];
  const contacts = [{ icon: "📞", label: "Call Us", sub: "920-000-111" }, { icon: "💬", label: "WhatsApp", sub: "+966 55 000 0000" }, { icon: "📧", label: "Email", sub: "help@sparkpark.sa" }, { icon: "🗺️", label: "Location", sub: "Dammam, Eastern Province" }];
  return (
    <div style={{ paddingBottom: "clamp(70px,18vw,88px)" }}>
      <TopBar title={t.supportTitle} back onBack={() => setPage("profile")} />
      <div style={{ padding: "clamp(14px,4vw,20px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(10px,3vw,14px)", marginBottom: 16 }}>
          {contacts.map((c, i) => (
            <Card key={c.label} style={{ textAlign: "center", cursor: "pointer", animation: `fadeIn .4s ease ${i * .07}s both` }}>
              <div style={{ fontSize: "clamp(24px,6.5vw,30px)", marginBottom: 6, animation: `bounce 2s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}>{c.icon}</div>
              <div style={{ fontWeight: 800, fontSize: "clamp(12px,3.5vw,14px)", color: T.text }}>{c.label}</div>
              <div style={{ fontSize: "clamp(10px,2.8vw,11px)", color: T.sub, fontWeight: 600 }}>{c.sub}</div>
            </Card>
          ))}
        </div>
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 14, color: T.text }}>{t.faq}</div>
          {faqs.map((f, i) => (
            <div key={i}>
              <div onClick={() => setOpen(open === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", cursor: "pointer", padding: "10px 0", borderBottom: open === i ? "none" : `1px solid ${T.border}` }}>
                <span style={{ fontSize: "clamp(12px,3.5vw,14px)", fontWeight: 600, color: T.text }}>{f.q}</span>
                <span style={{ color: T.muted, transition: "transform .2s", transform: open === i ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
              </div>
              {open === i && <div style={{ padding: "10px 0 4px", fontSize: "clamp(12px,3.5vw,13px)", color: T.sub, fontWeight: 600, lineHeight: 1.6, borderBottom: `1px solid ${T.border}` }}>{f.a}</div>}
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontWeight: 800, marginBottom: 14, color: T.text }}>{t.sendMessage}</div>
          {sent ? (
            <div style={{ textAlign: "center", padding: "clamp(16px,5vw,20px) 0", animation: "popIn .4s ease" }}>
              <div style={{ fontSize: "clamp(36px,10vw,48px)", marginBottom: 8 }}>🎉</div>
              <div style={{ fontWeight: 800, color: T.green, fontSize: 16 }}>{t.messageSent}</div>
              <div style={{ fontSize: 12, color: T.sub, marginTop: 4, fontWeight: 600 }}>{t.replyTime}</div>
            </div>
          ) : (
            <>
              <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder={t.messagePlaceholder} style={{ width: "100%", boxSizing: "border-box", minHeight: 100, background: "#f7faff", border: `1.5px solid rgba(99,160,255,0.18)`, borderRadius: 14, padding: 14, color: T.text, fontSize: 13, outline: "none", fontFamily: "inherit", resize: "none" }} />
              <Btn onClick={() => setSent(true)} style={{ marginTop: 12 }} icon="📤">{t.sendBtn}</Btn>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}