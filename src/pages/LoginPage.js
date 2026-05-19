import { useState } from "react";
import { PARKING_IMGS } from "../data/constants";
import { useLang } from "../context/LanguageContext";
import { Btn, Field, Card, WaveLoader } from "../components/UI";
import { BlobBg } from "../components/Visuals";
import { T } from "../data/constants";

// ====================== Firebase Imports ======================
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
// =============================================================

export default function LoginPage({ setPage, setUser }) {
  const { t, lang, toggleLang } = useLang();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  // دالة تسجيل الدخول الفعلية المرتبطة بالفايربيز
  const handleLogin = async () => {
    if (!email || !pass) {
      alert("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      // 1. تسجيل الدخول عبر واجهة الـ Authentication بالفايربيز
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      // 2. جلب مستند اليوزر الحقيقي من الـ Firestore لجمع معلومات البروفايل والسيارة
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        
        // حفظ البيانات الحقيقية في الـ State العامة للتطبيق لتشغيل البروفايل وصفحة سياراتي
        setUser({
          uid: firebaseUser.uid,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "",
          city: userData.city || "Dammam",
          vehicle: userData.vehicle || null,   // بيانات السيارة الأساسية بالـ Signup
          vehicles: userData.vehicles || []     // مصفوفة السيارات الإضافية لو وجدت
        });

        console.log("🔒 Logged in successfully! User data loaded from Firestore.");
        setPage("home"); // توجيهه لصفحة الهوم بعد نجاح العملية
      } else {
        console.error("No such user document in Firestore!");
        alert("لم يتم العثور على بيانات الملف الشخصي في قاعدة البيانات");
      }

    } catch (error) {
      console.error("Error during login:", error);
      // رسائل تنبيه واضحة لليوزر إذا كلمة السر غلط أو الحساب مو موجود
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        alert("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        alert("حدث خطأ أثناء تسجيل الدخول، الرجاء المحاولة مرة أخرى");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(16px,5vw,24px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <img src={PARKING_IMGS[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(3px) brightness(0.35)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg,rgba(37,99,235,0.7),rgba(15,23,42,0.8))" }} />
      </div>
      <BlobBg />
      {/* Lang toggle */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 20 }}>
        <button onClick={toggleLang} style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 12, padding: "6px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
          {lang === "ar" ? "🌐 EN" : "🌐 عر"}
        </button>
      </div>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: "clamp(72px,18vw,88px)", height: "clamp(72px,18vw,88px)", borderRadius: 28, margin: "0 auto 16px", background: "linear-gradient(135deg,rgba(59,130,246,0.9),rgba(125,211,252,0.9))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(32px,8vw,40px)", boxShadow: "0 16px 48px rgba(59,130,246,0.5)", animation: "floatY 4s ease-in-out infinite", backdropFilter: "blur(8px)" }}>🚗</div>
          <div style={{ fontSize: "clamp(26px,7vw,34px)", fontWeight: 900, color: "#fff", fontFamily: "'Poppins',sans-serif", textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>SparkPark</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4, fontWeight: 600 }}>{t.appSub}</div>
        </div>
        <Card style={{ animation: "slideUp .5s ease", backdropFilter: "blur(16px)", background: "rgba(255,255,255,0.92)" }}>
          <div style={{ fontSize: "clamp(17px,4.5vw,21px)", fontWeight: 900, marginBottom: 2, color: T.text }}>{t.welcomeBack}</div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 24, fontWeight: 600 }}>{t.loginSub}</div>
          <Field label={t.email} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} icon="📧" />
          <Field label={t.password} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} icon="🔒" />
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: T.accent, cursor: "pointer", fontWeight: 700 }}>{t.forgotPassword}</span>
          </div>
          {loading ? <WaveLoader /> : <Btn onClick={handleLogin} icon="→">{t.login}</Btn>}
          <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: T.sub }}>
            {t.noAccount}{" "}<span style={{ color: T.accent, cursor: "pointer", fontWeight: 800 }} onClick={() => setPage("signup")}>{t.createAccount}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}