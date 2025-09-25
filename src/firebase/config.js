// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTPmvRsLXFjfYCjthYEsgQABoBhtTePVo",
  authDomain: "ibd-for-livet-recipes.firebaseapp.com",
  projectId: "ibd-for-livet-recipes",
  storageBucket: "ibd-for-livet-recipes.firebasestorage.app",
  messagingSenderId: "795237428583",
  appId: "1:795237428583:web:a4f7935f59c863579253c2",
  measurementId: "G-W3DMNR0PG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;