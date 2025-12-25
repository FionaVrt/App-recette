import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCJlNtN2odR1yvvSJ5NMAPYH53b7i46i6s",
    authDomain: "bouffe-62d9c.firebaseapp.com",
    projectId: "bouffe-62d9c",
    storageBucket: "bouffe-62d9c.firebasestorage.app",
    messagingSenderId: "438626732442",
    appId: "1:438626732442:web:58286529365ce8d2a41223",
    measurementId: "G-5RV1WT0S28"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
