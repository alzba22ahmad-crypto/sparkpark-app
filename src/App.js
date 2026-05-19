import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { T, GLOBAL_CSS } from './data/constants';

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
  const [spots, setSpots] = useState([]); // هنا بنخزن المواقف اللي جاية لايف من الفايربيز
  
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

    // أ) بناء الداتا بيز تلقائياً بجميع الجداول المطلوبة
    const initializeDatabase = async () => {
      try {
        // 1. جدول المواقف (spots)
        const spotsRef = collection(db, "spots");
        await setDoc(doc(spotsRef, "A1"), { id: "A1", status: "available", dist: 2, lat: 26.3927, lng: 50.1917, zone: "A" });
        await setDoc(doc(spotsRef, "A2"), { id: "A2", status: "occupied", dist: 3, lat: 26.3928, lng: 50.1918, zone: "A" });
        await setDoc(doc(spotsRef, "B3"), { id: "B3", status: "available", dist: 5, lat: 26.3930, lng: 50.1920, zone: "B" });
        await setDoc(doc(spotsRef, "B4"), { id: "B4", status: "available", dist: 12, lat: 26.3935, lng: 50.1925, zone: "B" });

        // 2. جدول الحساسات (sensors) للـ IoT
        const sensorsRef = collection(db, "sensors");
        await setDoc(doc(sensorsRef, "SN-001"), { sensorId: "SN-001", spotId: "A1", type: "Ultrasonic", lastReading: 0, batteryStatus: "95%", updatedAt: "2026-05-19" });
        await setDoc(doc(sensorsRef, "SN-002"), { sensorId: "SN-002", spotId: "B3", type: "Ultrasonic", lastReading: 1, batteryStatus: "88%", updatedAt: "2026-05-19" });

        // 3. جدول الحجوزات (bookings)
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
        });

        // 4. جدول السجلات (parking_logs)
        const logsRef = collection(db, "parking_logs");
        await setDoc(doc(logsRef, "LOG-9901"), {
          logId: "LOG-9901",
          spotId: "A1",
          action: "Status changed to available",
          timestamp: "2026-05-19 12:00:00"
        });

        console.log("🚀 تم بناء وتحديث جميع الجداول تلقائياً في الفايربيز!");
      } catch (error) {
        console.error("خطأ في تهيئة قاعدة البيانات تلقائياً:", error);
      }
    };

    initializeDatabase();

    // ب) الاستماع للبث المباشر للمواقف (Real-time Listener)
    const unsubscribe = onSnapshot(collection(db, "spots"), (snapshot) => {
      const spotsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSpots(spotsData); // تحديث الـ State لايف
      console.log("Updated spots from Firebase live:", spotsData);
    }, (error) => {
      console.error("Error fetching live spots:", error);
    });

    return () => unsubscribe(); // تنظيف المستمع عند إغلاق التطبيق
  }, []);
  // ==================================================================================

  const renderPage = () => {
    switch (page) {
      case 'home':          
        return <HomePage spots={spots} setPage={setPage} user={user} />; 
      
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
        return <CheckoutPage setPage={setPage} />;

      case 'notifications': 
        return <NotificationsPage setPage={setPage} />;

      case 'support':       
        return <SupportPage setPage={setPage} />;

      default:              
        return <HomePage spots={spots} setPage={setPage} user={user} />;
    }
  };

  return (
    <LanguageProvider>
      <style>{GLOBAL_CSS}</style>
      
      <div style={{ 
        backgroundColor: T.bg, 
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