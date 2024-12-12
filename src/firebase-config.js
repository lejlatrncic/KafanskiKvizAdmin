// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tvoje Firebase konfiguracije
const firebaseConfig = {
  apiKey: "AIzaSyBmO1GEOlc-68uPcn4u48nckSoVkjZqFRY",
  authDomain: "kafanski-kviz.firebaseapp.com",
  projectId: "kafanski-kviz",
  storageBucket: "kafanski-kviz.firebasestorage.app",
  messagingSenderId: "301379407726",
  appId: "1:301379407726:web:066628b95ffdf85c85fb7f",
  measurementId: "G-50X26XCZ81"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
