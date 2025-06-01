import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDY6qb4Vib1W1RjIHcLLfFsydkaEAxGOhY",
  authDomain: "copla-2450e.firebaseapp.com",
  projectId: "copla-2450e",
  storageBucket: "copla-2450e.firebasestorage.app",
  messagingSenderId: "1001302798278",
  appId: "1:1001302798278:web:5addbc4261d532a8fe8cc7",
  measurementId: "G-NEJYM688DT"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);