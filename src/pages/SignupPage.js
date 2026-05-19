import { useState } from "react";
import { PARKING_IMGS } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Field, Card } from "../components/UI";

// ====================== Firebase Imports ======================
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
// =============================================================

export default function SignupPage({ setPage }) {
  const { t, lang, toggleLang } = useLang();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // لحالة التحميل أثناء التسجيل
  
  // تحديث الـ Form ليشمل بيانات السيارة
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    pass: "",
    carModel: "", // موديل السيارة (مثلاً: Tesla Model 3)
    carPlate: ""  // رقم اللوحة (مثلاً: ABC-123)
  });

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  // دالة التسجيل الفعلية وربطها بالفايربيز
  const handleSignup = async () => {
    if (!form.email || !form.pass || !form.carModel || !form.carPlate) {
      alert("الرجاء تعبئة جميع الحقول المطلوبة معلومات الحساب والسيارة");
      return;
    }

    setLoading(true);
    try {
      // 1. إنشاء الحساب في Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.pass);
      const firebaseUser = userCredential.user;

      // 2. حفظ بيانات المستخدم وسيارتة في Firestore Database بنفس الـ ID
      await setDoc(doc(db, "users", firebaseUser.uid), {
        uid: firebaseUser.uid,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: "user",
        createdAt: new Date().toISOString(),
        // تفاصيل السيارة اللي بتنعكس بصفحة سياراتي والبروفايل
        vehicle: {
          model: form.carModel,
          plate: form.carPlate,
          color: "White", // قيمة افتراضية ويمكن تعديلها من البروفايل لاحقاً
          tagId: `VH-${Math.floor(1000 + Math.random() * 9000)}` // توليد رقم تاق تلقائي للحساس
        }
      });

      console.log("🎉 User and Vehicle registered successfully in Firebase!");
      alert("تم إنشاء الحساب بنجاح!");
      setPage("login"); // توجيهه لصفحة تسجيل الدخول

    } catch (error) {
      console.error("Error during signup:", error);
      alert(error.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "clamp(16px,5vw,24px)", paddingTop: "clamp(40px,12vw,60px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <img src={PARKING_IMGS[1]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(3px) brightness(0.35)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg,rgba(37,99,235,0.7),rgba(15,23,42,0.8))" }} />
      </div>
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 20 }}>
        <button onClick={toggleLang} style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 12, padding: "6px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
          {lang === "ar" ? "🌐 EN" : "🌐 عر"}
        </button>
      </div>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: "clamp(20px,5.5vw,24px)", fontWeight: 900, color: "#fff", fontFamily: "'Poppins',sans-serif" }}>{t.createNewAccount}</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
            {[1, 2].map(i => (<div key={i} style={{ height: 6, borderRadius: 6, width: i === step ? "clamp(28px,8vw,36px)" : "clamp(20px,6vw,26px)", background: i === step ? "#3b82f6" : "rgba(255,255,255,0.4)", transition: "all .3s" }} />))}
          </div>
        </div>
        <Card style={{ animation: "slideUp .4s ease", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)" }}>
          {step === 1 ? (
            <>
              <div style={{ fontWeight: 800, marginBottom: 20, fontSize: 16 }}>{t.step1} (البيانات الشخصية)</div>
              <Field label={t.fullName} placeholder="اسمك الكامل" value={form.name} onChange={f("name")} icon="👤" />
              <Field label={t.email} type="email" placeholder="email@example.com" value={form.email} onChange={f("email")} icon="📧" />
              <Field label={t.phone} type="tel" placeholder="+966 5X XXX XXXX" value={form.phone} onChange={f("phone")} icon="📱" />
              <Btn onClick={() => setStep(2)} icon="→">{t.next}</Btn>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 800, marginBottom: 20, fontSize: 16 }}>{t.step2} (الأمان والسيارة)</div>
              <Field label={t.password} type="password" placeholder="8+ حروف أو أرقام" value={form.pass} onChange={f("pass")} icon="🔒" />
              
              {/* حقول السيارة المضافة حديثاً والربط مع الداتابيس */}
              <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 15, paddingTop: 15, marginBottom: 15 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#2563eb", marginBottom: 10 }}>🚗 معلومات سيارتك:</div>
                <Field label="موديل السيارة" placeholder="مثال: Tesla Model 3" value={form.carModel} onChange={f("carModel")} icon="🚘" />
                <Field label="رقم اللوحة" placeholder="مثال: أ ب ج 1234" value={form.carPlate} onChange={f("carPlate")} icon="🔢" />
              </div>

              <Btn onClick={handleSignup} disabled={loading} icon="🎉" style={{ marginBottom: 10 }}>
                {loading ? "جاري إنشاء الحساب..." : t.createBtn}
              </Btn>
              <Btn variant="ghost" onClick={() => setStep(1)}>{t.back}</Btn>
            </>
          )}
        </Card>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
          {t.haveAccount}{" "}<span style={{ color: "#7dd3fc", cursor: "pointer", fontWeight: 800 }} onClick={() => setPage("login")}>{t.signIn}</span>
        </div>
      </div>
    </div>
  );
}