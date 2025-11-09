// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-IM_19jiDdZo-D9acm40ag9QIx0irrwA",
  authDomain: "t-mobile-2bf96.firebaseapp.com",
  projectId: "t-mobile-2bf96",
  storageBucket: "t-mobile-2bf96.firebasestorage.app",
  messagingSenderId: "322282362767",
  appId: "1:322282362767:web:b02de58b465e2a7d979dfa",
  measurementId: "G-7C46FKS46G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
