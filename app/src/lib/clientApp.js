// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE,
  authDomain: "heyo-prod.firebaseapp.com",
  projectId: "heyo-prod",
  storageBucket: "heyo-prod.appspot.com",
  messagingSenderId: "933402447812",
  appId: "1:933402447812:web:adbd943bc92e9573a2de91",
  measurementId: "G-FGL90N3534"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);