import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDB90lm9yKDm32o2IidFbP2pOMMVGJK2P0",
    authDomain: "game-store-9db7d.firebaseapp.com",
    databaseURL: "https://game-store-9db7d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "game-store-9db7d",
    storageBucket: "game-store-9db7d.firebasestorage.app",
    messagingSenderId: "851197484672",
    appId: "1:851197484672:web:96ad306d39fd2297865065",
    measurementId: "G-GZB1ZFL9RM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };