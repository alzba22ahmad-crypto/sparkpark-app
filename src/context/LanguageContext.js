import { createContext, useContext, useState } from "react";

const translations = {
  ar: {
    dir: "rtl",
    appName: "SparkPark",
    appSub: "نظام إدارة المواقف الذكي",
    welcome: "مرحباً بك",
    availableNow: "مواقف متاحة الآن",
    ourParking: "🏙️ مواقفنا",

    // Nav
    home: "الرئيسية",
    park: "موقف",
    history: "السجل",
    profile: "حسابي",

    // Login
    welcomeBack: "مرحباً بعودتك 👋",
    loginSub: "سجّل دخولك للمتابعة",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    login: "تسجيل الدخول",
    noAccount: "ليس لديك حساب؟",
    createAccount: "إنشاء حساب",

    // Signup
    createNewAccount: "إنشاء حساب جديد 🎉",
    step1: "الخطوة 1: المعلومات الشخصية",
    step2: "الخطوة 2: كلمة المرور",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    next: "التالي",
    back: "← رجوع",
    confirmPassword: "تأكيد كلمة المرور",
    createBtn: "إنشاء الحساب",
    haveAccount: "لديك حساب؟",
    signIn: "تسجيل الدخول",

    // Home
    parkingMap: "🗺️ خريطة المواقف",
    live: "مباشر",
    activeBooking: "🎯 حجزي النشط",
    zoneB: "المنطقة B",
    reserved: "محجوز",
    timeLeft: "الوقت المتبقي",
    checkout: "تسجيل الخروج",
    available: "متاح",
    occupied: "مشغول",

    // Quick actions
    bookSpot: "احجز موقفاً",
    bookSub: "حجز مسبق",
    instantPark: "موقف فوري",
    instantSub: "الآن",
    findCar: "ابحث عن سيارتك",
    findCarSub: "GPS ذكي",
    notifications: "الإشعارات",
    notifSub: "3 تنبيهات",

    // Sensor / IoT
    sensorTitle: "🔬 حساس الدخول - IoT",
    sensorSub: "محاكاة قراءة RFID عند دخول الموقف",
    vehicleApproaching: "مركبة تقترب...",
    readingTag: "جاري قراءة Tag ID...",
    matchFound: "✅ تطابق ناجح!",
    matchFail: "❌ لا يوجد تطابق",
    simulateEntry: "محاكاة دخول سيارة",
    tagRead: "Tag ID المقروء",
    registeredTag: "Tag ID المسجل",
    spotStatus: "حالة الموقف",
    accessGranted: "مسموح بالدخول",
    accessDenied: "غير مسموح",
    sensorIdle: "الحساس في وضع الانتظار...",
    scanAgain: "محاكاة مجددًا",
    access: "الوصول",

    // Occupancy Timer
    occupancyTimer: "عداد الإشغال",
    timeOccupied: "مدة الإشغال",
    currentCost: "التكلفة المتراكمة",

    // Wrong Car Alert
    wrongCarTitle: "⚠️ سيارة غير مصرح لها",
    moveCarAlert: "يجب تحريك السيارة خلال",
    moveCarMin: "دقيقة",
    moveCarNow: "🚨 انتهت مهلة التحريك! تصرف فوراً",
    wrongCarTag: "Tag ID للسيارة المتعدية",
    timeRemaining: "الوقت المتبقي",
    clearAlert: "إغلاق التنبيه",

    // AdHoc
    parkNow: "ركن الآن بدون حجز",
    parkNowSub: "اختر موقفاً واركن فوراً",
    availableSpots: "المواقف المتاحة",
    spotDetails: "تفاصيل الموقف",
    zone: "المنطقة",
    price: "السعر",
    priceVal: "2 ريال / ساعة",
    maxTime: "الحد الأقصى",
    maxTimeVal: "4 ساعات",
    parkHere: "ركن هنا",

    // Reserve
    bookSpotTitle: "🅿️ احجز موقفاً",
    chooseTime: "📅 اختر الوقت",
    date: "التاريخ",
    time: "الوقت",
    duration: "المدة",
    chooseSpot: "🗺️ اختر الموقف",
    confirmBooking: "✅ تأكيد الحجز",
    spot: "الموقف",
    expectedCost: "التكلفة المتوقعة",
    confirmBtn: "تأكيد الحجز",
    hour: "ساعة",

    // Reservation Info
    bookingDetails: "تفاصيل الحجز",
    booked: "✓ محجوز",
    bookedReady: "موقفك محجوز وجاهز",
    bookingSummary: "ملخص الحجز",
    bookingNum: "رقم الحجز",
    bookingDate: "التاريخ",
    start: "البداية",
    end: "النهاية",
    totalCost: "الإجمالي",
    checkoutBtn: "تسجيل الخروج",
    backHome: "العودة للرئيسية",

    // Checkout
    checkoutTitle: "🚪 تسجيل الخروج",
    goodbye: "إلى اللقاء!",
    thankYou: "شكراً لاستخدامك SparkPark",
    sessionSummary: "ملخص الجلسة",
    entryTime: "الدخول",
    now: "الآن",
    totalDuration: "المدة",
    total: "الإجمالي",
    payMethod: "💳 طريقة الدفع",
    payBtn: "ادفع",
    paySuccess: "تم الدفع بنجاح!",
    paySuccessSub: "شكراً لاستخدامك SparkPark 🚗",
    actualDuration: "المدة الفعلية",
    amountPaid: "المبلغ المدفوع",
    timeSaved: "الوقت الموفّر",

    // Find Car
    findCarTitle: "🔍 ابحث عن سيارتك",
    whereIsMyCar: "أين سيارتي؟",
    findCarDesc: "نستخدم Tag ID + GPS لتحديد موقعها",
    findBtn: "ابحث عن سيارتي",
    locating: "جاري البحث...",
    carFound: "تم العثور على سيارتك!",
    navigateToMyCar: "التنقل إلى سيارتي",
    searchAgain: "🔄 بحث مجدد",
    navigating: "جاري التنقل",
    done: "✓ تم",
    distance: "المسافة التقريبية",
    enableGPS: "فعّل GPS للمسافة",

    // Notifications
    notifTitle: "🔔 الإشعارات",
    readAll: "قراءة الكل",

    // History
    historyTitle: "📋 السجل",
    all: "الكل",
    completed: "مكتمل",
    cancelled: "ملغي",

    // Profile
    profileTitle: "👤 ملفي الشخصي",
    verified: "✓ عضو موثّق",
    bookings: "الحجوزات",
    hours: "ساعات",
    sarSaved: "ريال موفّر",
    kmLess: "كم أقل",
    editProfile: "تعديل الملف الشخصي",
    myCars: "سياراتي",
    support: "الدعم والمساعدة",
    logout: "تسجيل الخروج",

    // Edit Profile
    editProfileTitle: "✏️ تعديل الملف",
    changePhoto: "تغيير الصورة",
    city: "المدينة",
    saveChanges: "حفظ التغييرات",
    saved: "✅ تم الحفظ!",

    // Vehicles
    vehiclesTitle: "🚗 سياراتي",
    active: "✓ نشطة",
    inactive: "غير نشطة",
    delete: "حذف",
    addVehicle: "إضافة سيارة",
    addNewVehicle: "إضافة سيارة جديدة 🚗",
    plateNum: "رقم اللوحة",
    model: "الموديل",
    color: "اللون",
    addBtn: "إضافة السيارة",
    cancel: "إلغاء",

    // Support
    supportTitle: "🎧 الدعم والمساعدة",
    faq: "❓ الأسئلة الشائعة",
    sendMessage: "✉️ أرسل رسالة",
    messagePlaceholder: "اكتب رسالتك هنا...",
    sendBtn: "إرسال",
    messageSent: "تم الإرسال!",
    replyTime: "سنرد خلال 24 ساعة",

    // Slider
    slide1Title: "احجز في ثوانٍ!",
    slide1Tag: "حجز ذكي",
    slide1Sub: "اختر موقفك المفضل وادفع لاحقاً بكل سهولة",
    slide2Title: "ابحث عن سيارتك",
    slide2Tag: "GPS ذكي",
    slide2Sub: "تقنية Tag ID تحدد موقع سيارتك فوراً",
    slide3Title: "موقف فوري",
    slide3Tag: "Ad-Hoc",
    slide3Sub: "اركن الآن بدون حجز مسبق",
    slide4Title: "مدعوم بـ IoT",
    slide4Tag: "تقنية حديثة",
    slide4Sub: "حساسات ذكية تراقب كل موقف لحظة بلحظة",
    slide5Title: "وفّر وقتك",
    slide5Tag: "كفاءة عالية",
    slide5Sub: "تقليل وقت البحث عن موقف بنسبة 70%",
  },
  en: {
    dir: "ltr",
    appName: "SparkPark",
    appSub: "Smart Parking Management System",
    welcome: "Welcome",
    availableNow: "spots available now",
    ourParking: "🏙️ Our Parking Lots",

    // Nav
    home: "Home",
    park: "Park",
    history: "History",
    profile: "Profile",

    // Login
    welcomeBack: "Welcome Back 👋",
    loginSub: "Sign in to continue",
    email: "Email Address",
    password: "Password",
    forgotPassword: "Forgot Password?",
    login: "Sign In",
    noAccount: "Don't have an account?",
    createAccount: "Create Account",

    // Signup
    createNewAccount: "Create New Account 🎉",
    step1: "Step 1: Personal Info",
    step2: "Step 2: Password",
    fullName: "Full Name",
    phone: "Phone Number",
    next: "Next",
    back: "← Back",
    confirmPassword: "Confirm Password",
    createBtn: "Create Account",
    haveAccount: "Have an account?",
    signIn: "Sign In",

    // Home
    parkingMap: "🗺️ Parking Map",
    live: "Live",
    activeBooking: "🎯 My Active Booking",
    zoneB: "Zone B",
    reserved: "Reserved",
    timeLeft: "Time Remaining",
    checkout: "Check Out",
    available: "Available",
    occupied: "Occupied",

    // Quick actions
    bookSpot: "Book a Spot",
    bookSub: "Pre-booking",
    instantPark: "Instant Park",
    instantSub: "Right Now",
    findCar: "Find My Car",
    findCarSub: "Smart GPS",
    notifications: "Notifications",
    notifSub: "3 alerts",

    // Sensor / IoT
    sensorTitle: "🔬 Entry Sensor - IoT",
    sensorSub: "Simulating RFID scan on parking entry",
    vehicleApproaching: "Vehicle approaching...",
    readingTag: "Reading Tag ID...",
    matchFound: "✅ Match Successful!",
    matchFail: "❌ No Match Found",
    simulateEntry: "Simulate Vehicle Entry",
    tagRead: "Scanned Tag ID",
    registeredTag: "Registered Tag ID",
    spotStatus: "Spot Status",
    accessGranted: "Access Granted",
    accessDenied: "Access Denied",
    sensorIdle: "Sensor in standby mode...",
    scanAgain: "Simulate Again",
    access: "Access",

    // Occupancy Timer
    occupancyTimer: "Occupancy Timer",
    timeOccupied: "Time Occupied",
    currentCost: "Accumulated Cost",

    // Wrong Car Alert
    wrongCarTitle: "⚠️ Unauthorized Vehicle Detected",
    moveCarAlert: "Please move your car within",
    moveCarMin: "min",
    moveCarNow: "🚨 Move deadline expired! Act now",
    wrongCarTag: "Unauthorized Car Tag",
    timeRemaining: "Time Remaining",
    clearAlert: "Dismiss Alert",

    // AdHoc
    parkNow: "Park Without Booking",
    parkNowSub: "Choose a spot and park right away",
    availableSpots: "Available Spots",
    spotDetails: "Spot Details",
    zone: "Zone",
    price: "Price",
    priceVal: "2 SAR / hour",
    maxTime: "Max Time",
    maxTimeVal: "4 hours",
    parkHere: "Park Here",

    // Reserve
    bookSpotTitle: "🅿️ Book a Spot",
    chooseTime: "📅 Choose Time",
    date: "Date",
    time: "Time",
    duration: "Duration",
    chooseSpot: "🗺️ Choose Spot",
    confirmBooking: "✅ Confirm Booking",
    spot: "Spot",
    expectedCost: "Expected Cost",
    confirmBtn: "Confirm Booking",
    hour: "hour",

    // Reservation Info
    bookingDetails: "Booking Details",
    booked: "✓ Booked",
    bookedReady: "Your spot is booked and ready",
    bookingSummary: "Booking Summary",
    bookingNum: "Booking No.",
    bookingDate: "Date",
    start: "Start",
    end: "End",
    totalCost: "Total",
    checkoutBtn: "Check Out",
    backHome: "Back to Home",

    // Checkout
    checkoutTitle: "🚪 Check Out",
    goodbye: "See You Soon!",
    thankYou: "Thanks for using SparkPark",
    sessionSummary: "Session Summary",
    entryTime: "Entry",
    now: "Now",
    totalDuration: "Duration",
    total: "Total",
    payMethod: "💳 Payment Method",
    payBtn: "Pay",
    paySuccess: "Payment Successful!",
    paySuccessSub: "Thanks for using SparkPark 🚗",
    actualDuration: "Actual Duration",
    amountPaid: "Amount Paid",
    timeSaved: "Time Saved",

    // Find Car
    findCarTitle: "🔍 Find My Car",
    whereIsMyCar: "Where's My Car?",
    findCarDesc: "We use Tag ID + GPS to locate it",
    findBtn: "Find My Car",
    locating: "Searching...",
    carFound: "Your car has been found!",
    navigateToMyCar: "Navigate to My Car",
    searchAgain: "🔄 Search Again",
    navigating: "Navigating",
    done: "✓ Done",
    distance: "Approx. Distance",
    enableGPS: "Enable GPS for distance",

    // Notifications
    notifTitle: "🔔 Notifications",
    readAll: "Mark All Read",

    // History
    historyTitle: "📋 History",
    all: "All",
    completed: "Completed",
    cancelled: "Cancelled",

    // Profile
    profileTitle: "👤 My Profile",
    verified: "✓ Verified Member",
    bookings: "Bookings",
    hours: "Hours",
    sarSaved: "SAR Saved",
    kmLess: "Less KM",
    editProfile: "Edit Profile",
    myCars: "My Vehicles",
    support: "Support & Help",
    logout: "Sign Out",

    // Edit Profile
    editProfileTitle: "✏️ Edit Profile",
    changePhoto: "Change Photo",
    city: "City",
    saveChanges: "Save Changes",
    saved: "✅ Saved!",

    // Vehicles
    vehiclesTitle: "🚗 My Vehicles",
    active: "✓ Active",
    inactive: "Inactive",
    delete: "Delete",
    addVehicle: "Add Vehicle",
    addNewVehicle: "Add New Vehicle 🚗",
    plateNum: "Plate Number",
    model: "Model",
    color: "Color",
    addBtn: "Add Vehicle",
    cancel: "Cancel",

    // Support
    supportTitle: "🎧 Support & Help",
    faq: "❓ FAQ",
    sendMessage: "✉️ Send Message",
    messagePlaceholder: "Write your message here...",
    sendBtn: "Send",
    messageSent: "Sent!",
    replyTime: "We'll reply within 24 hours",

    // Slider
    slide1Title: "Book in Seconds!",
    slide1Tag: "Smart Booking",
    slide1Sub: "Choose your preferred spot and pay later easily",
    slide2Title: "Find Your Car",
    slide2Tag: "Smart GPS",
    slide2Sub: "Tag ID technology locates your car instantly",
    slide3Title: "Instant Parking",
    slide3Tag: "Ad-Hoc",
    slide3Sub: "Park now without pre-booking",
    slide4Title: "IoT Powered",
    slide4Tag: "Modern Tech",
    slide4Sub: "Smart sensors monitor every spot in real time",
    slide5Title: "Save Your Time",
    slide5Tag: "High Efficiency",
    slide5Sub: "Reduce parking search time by 70%",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("ar");
  const t = translations[lang];
  const toggleLang = () => setLang((l) => (l === "ar" ? "en" : "ar"));
  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      <div dir={t.dir} style={{ fontFamily: "inherit" }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}