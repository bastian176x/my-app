// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBua2tnO4v8nz4_nf0LPbGSYHnvzZQ4h9o",
  authDomain: "ciudadactiva-b8d5b.firebaseapp.com",
  projectId: "ciudadactiva-b8d5b",
  storageBucket: "ciudadactiva-b8d5b.firebasestorage.app",
  messagingSenderId: "134101858396",
  appId: "1:134101858396:web:3dc84af3d0b4824a3e8e99",
  measurementId: "G-9DP3P4580E"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
 const auth = getAuth(app);
 export { app, auth, db };
