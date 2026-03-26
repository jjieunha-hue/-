// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAH0AkmVq29wZaZyYIUmup81obcPzitkow",
  authDomain: "hajieun-7efb2.firebaseapp.com",
  projectId: "hajieun-7efb2",
  storageBucket: "hajieun-7efb2.firebasestorage.app",
  messagingSenderId: "535253584177",
  appId: "1:535253584177:web:45fcb66a4ece58486fc810",
  measurementId: "G-1Q0GVCQ66T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
