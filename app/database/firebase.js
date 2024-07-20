// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCY1ZiT5Ks3PgqDH0GQfficLZGhtm_sb98",
  authDomain: "pbl-cal-7b0e8.firebaseapp.com",
  projectId: "pbl-cal-7b0e8",
  storageBucket: "pbl-cal-7b0e8.appspot.com",
  messagingSenderId: "491439353418",
  appId: "1:491439353418:web:06e9e5669a7a054c0440b3",
  measurementId: "G-3SRDRM1028"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);


export { db };