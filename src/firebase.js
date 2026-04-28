// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsyWRS_TRjv-TZ2xm118fBL6ULvqhPTwA",
  authDomain: "hrsomachicken.firebaseapp.com",
  projectId: "hrsomachicken",
  storageBucket: "hrsomachicken.firebasestorage.app",
  messagingSenderId: "486459712654",
  appId: "1:486459712654:web:8348295718611ec17dd5df"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);