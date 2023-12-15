// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgwukU84Mbtz0PdTij-0thGeIB3lTG8LU",
  authDomain: "heyo-2f437.firebaseapp.com",
  databaseURL: "https://heyo-2f437-default-rtdb.firebaseio.com",
  projectId: "heyo-2f437",
  storageBucket: "heyo-2f437.appspot.com",
  messagingSenderId: "425354262237",
  appId: "1:425354262237:web:3e8b4ba1548d2769858d34",
  measurementId: "G-N87K6RMXPP"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);