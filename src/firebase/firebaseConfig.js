// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvVepKhzHurvG8sZJBE13Ed21Du--_PVY",
  authDomain: "webapp3-17109.firebaseapp.com",
  projectId: "webapp3-17109",
  storageBucket: "webapp3-17109.firebasestorage.app",
  messagingSenderId: "27932408909",
  appId: "1:27932408909:web:3b63fe1cc1015725fb7004",
  measurementId: "G-1FWEZWVTJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const  auth= getAuth(app);
const db = getFirestore(app); // ← Firestoreを初期化
export {auth,db};// ← db をエクスポート