import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { T, GLOBAL_CSS, MOCK_SPOTS } from './data/constants';

// ====================== Firebase ======================
import { db, auth } from './firebase/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
// =====================================================

// 1. استيراد الصفحات
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import FindMyCarPage from './pages/FindMyCarPage';
import CheckoutPage from './pages/CheckoutPage';

// استيراد المجموعات (Named Exports)
import { ReservePage, AdHocPage, ReservationInfoPage } from './pages/ParkingPages';
import { ProfilePage, EditProfilePage, VehiclesPage, SupportPage } from './pages/ProfilePages';
import { NotificationsPage } from './pages/InfoPages';

// استيراد المكونات
import { BottomNav, TopBar } from './components/UI';
import { DrivingCar, BlobBg } from './components/Visuals';

function App() {
  const [page, setPage] = useState('login');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [spots, setSpots] = useState([]);
  const [sensors, setSensors] = useState([]);

  // بيانات المستخدم
  const [user, setUser] = useState({
    name: "Marwah",
    email: "marwah@sparkpark.com",
    vehicle: {
      model: "Tesla Model 3",
      plate: "ABC-123",
      color: "White",
      tagId: "VH-9921"
    }
  });

  // ====================== Firebase Real-time & Initialization ======================
  useEffect(() => {
    console.log("🔥 Firebase Connected Successfully!");
    console.log("Firestore DB:", db);
    console.log("Auth Service:", auth);

    // أ) بناء الداتا بيز تلقائياً
    const initializeDatabase = async () => {
      try {
        const spotsRef = collection(db, "spots");
        const sensorsRef = collection(db, "sensors");

        // تهيئة المواقف — نستخدم destructuring لتجنب أخطاء النسخ
        for (let i = 0; i < MOCK_SPOTS.length; i++) {
          const { id, zone, status, tagId, lat, lng } = MOCK_SPOTS[i];
          await setDoc(doc(spotsRef, id), {
            id,
            zone,
            status,
            tagId,
            reservedTagId: tagId,
            lat,
            lng,
            dist: 0.1,
          }, { merge: true });

          // حساس ESP32 لكل موقف
          const sid = "SN-" + id;
          await setDoc(doc(sensorsRef, sid), {
            sensorId: sid,
            spotId: id,
            type: "Ultrasonic+RFID",
            lastReading: 0,
            batteryStatus: "95%",
            updatedAt: new Date().toISOString().split("T")[0],
          }, { merge: true });
        }

        // جدول الحجوزات (bookings)
        const bookingsRef = collection(db, "bookings");
        await setDoc(doc(bookingsRef, "BK-7721"), {
          bookingId: "BK-7721",
          spotId: "B3",
          userId: "pa3YnRAjbJOAxZZiPTTj",
          userName: "Marwah",
          date: "2026-05-19",
          time: "10:30 AM",
          duration: "2h",
          status: "confirmed"
        }, { merge: true });

        // جدول السجلات (parking_logs)
        const logsRef = collection(db, "parking_logs");
        await setDoc(doc(logsRef, "LOG-9901"), {
          logId: "LOG-9901",
          spotId: "A1",
          action: "Status changed to available",
          timestamp: "2026-05-19 12:00:00"
        }, { merge: true });

        console.log("🚀 تم بناء وتحديث جميع الجداول في الفايربيز!");
      } catch (error) {
        console.error("خطأ في تهيئة قاعدة البيانات:", error);
      }
    };

    initializeDatabase();

    // ب) الاستماع للبث المباشر للمواقف (Real-time Listener)
    const unsubSpots = onSnapshot(collection(db, "spots"), (snapshot) => {
      const spotsData = snapshot.docs.map(function(snap) { return Object.assign({ id: snap.id }, snap.data()); });
      setSpots(spotsData);
      console.log("Updated spots from Firebase live:", spotsData);
    }, (error) => {
      console.error("Error fetching live spots:", error);
    });

    // ج) الاستماع للحساسات (Real-time Listener)
    const unsubSensors = onSnapshot(collection(db, "sensors"), (snapshot) => {
      const sensorsData = snapshot.docs.map(function(snap) { return Object.assign({ id: snap.id }, snap.data()); });
      setSensors(sensorsData);
    }, (error) => {
      console.error("Error fetching live sensors:", error);
    });

    return () => { unsubSpots(); unsubSensors(); };
  }, []);
  // ==================================================================================

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage spots={spots} sensors={sensors} setPage={setPage} user={user} />;

      case 'login':
        return <LoginPage setUser={setUser} onLogin={() => setPage('home')} setPage={setPage} />;

      case 'signup':
        return <SignupPage setPage={setPage} />;

      case 'reserve':
        return <ReservePage spots={spots} setPage={setPage} setSelectedSpot={setSelectedSpot} />;

      case 'adhoc':
        return <AdHocPage spots={spots} setPage={setPage} setSelectedSpot={setSelectedSpot} />;

      case 'res-info':
        return <ReservationInfoPage setPage={setPage} selectedSpot={selectedSpot} />;

      case 'find':
        return <FindMyCarPage user={user} spots={spots} setPage={setPage} />;

      case 'profile':
        return <ProfilePage user={user} setPage={setPage} />;

      case 'edit-profile':
        return <EditProfilePage user={user} setUser={setUser} setPage={setPage} />;

      case 'vehicles':
        return <VehiclesPage user={user} setPage={setPage} />;

      case 'checkout':
        return <CheckoutPage setPage={setPage} selectedSpot={selectedSpot} user={user} />;

      case 'notifications':
        return <NotificationsPage setPage={setPage} />;

      case 'support':
        return <SupportPage setPage={setPage} />;

      default:
        return <HomePage spots={spots} sensors={sensors} setPage={setPage} user={user} />;
    }
  };

  return (
    <LanguageProvider>
      <style>{GLOBAL_CSS}</style>

      <div style={{
        backgroundColor: T["bg"],
        minHeight: '100vh',
        position: 'relative',
        paddingBottom: (page === 'login' || page === 'signup') ? 0 : '90px'
      }}>
        <BlobBg />

        {page !== 'login' && page !== 'signup' && (
          <TopBar title="SparkPark" setPage={setPage} />
        )}

        <div className="main-content">
          {renderPage()}
        </div>

        <DrivingCar />

        {page !== 'login' && page !== 'signup' && (
          <BottomNav active={page} setPage={setPage} />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
