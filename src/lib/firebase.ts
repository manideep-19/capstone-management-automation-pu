// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCHg70KudIHyn5fBXrHd5We8U9axRpugxU",
    authDomain: "capstone-590a2.firebaseapp.com",
    databaseURL: "https://capstone-590a2-default-rtdb.firebaseio.com",
    projectId: "capstone-590a2",
    storageBucket: "capstone-590a2.firebasestorage.app",
    messagingSenderId: "421069122404",
    appId: "1:421069122404:web:8937312e7098ac09de6871",
    measurementId: "G-FKGBCJWBFS"
};

// Initialize Firebase (avoid re-init during HMR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Optional: initialize analytics only in browser
if (typeof window !== 'undefined') {
    try {
        getAnalytics(app);
    } catch (error) {
        // Analytics initialization failed, ignore
        console.debug('Analytics not initialized');
    }
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;