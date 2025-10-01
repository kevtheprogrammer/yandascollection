import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import  "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAdrDytEUhNyZIZMuVFfGJHaOrxARqfJAw" , 
    authDomain: process.env.AUTH_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
    storageBucket: process.env.AUTH_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:process.env.AUTH_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.AUTH_FIREBASE_APP_ID,
    measurementId: process.env.AUTH_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp() ; 
const db = getFirestore(app)
export { db  }
const storage = getStorage(app);

export { storage };
export default app