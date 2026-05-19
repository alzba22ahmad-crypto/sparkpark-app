// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtdvAdBMttI7vTndG3bG7j6Ja1H-kyeys",
  authDomain: "sparkpark-app.firebaseapp.com",
  projectId: "sparkpark-app",
  storageBucket: "sparkpark-app.firebasestorage.app",
  messagingSenderId: "558656594078",
  appId: "1:558656594078:web:beaadf6db322a1c472db8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services we need
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;