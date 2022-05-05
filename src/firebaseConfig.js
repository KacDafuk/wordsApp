// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//
console.log(process.env);
const firebaseConfig = {
  apiKey: "AIzaSyAD550KcR1NxmFxdjXWpUhu3gPYDJ153w4",
  authDomain: "learnwords-d7813.firebaseapp.com",
  projectId: "learnwords-d7813",
  storageBucket: "learnwords-d7813.appspot.com",
  messagingSenderId: "34764614129",
  appId: "1:34764614129:web:a6db7b0066dee0c96f3c50",
  measurementId: "G-5SG4QQR2VB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
