import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCY1ZiT5Ks3PgqDH0GQfficLZGhtm_sb98",
  authDomain: "pbl-cal-7b0e8.firebaseapp.com",
  projectId: "pbl-cal-7b0e8",
  storageBucket: "pbl-cal-7b0e8.appspot.com",
  messagingSenderId: "491439353418",
  appId: "1:491439353418:web:06e9e5669a7a054c0440b3",
  measurementId: "G-3SRDRM1028"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, signInWithEmailAndPassword };
