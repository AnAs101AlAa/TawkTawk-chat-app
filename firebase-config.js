// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBQwkL4KQMUKk96b2vCa6SiNIOKbF-91eE",
  authDomain: "chat-app-6908c.firebaseapp.com",
  projectId: "chat-app-6908c",
  storageBucket: "chat-app-6908c.appspot.com",
  messagingSenderId: "657013227268",
  appId: "1:657013227268:web:9edcab219da21d0a439a51",
  measurementId: "G-4MWZMBM1GQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);