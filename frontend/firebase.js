// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "sakeena-eca79.firebaseapp.com",
    projectId: "sakeena-eca79",
    storageBucket: "sakeena-eca79.firebasestorage.app",
    messagingSenderId: "662513982813",
    appId: "1:662513982813:web:098c9f24c8de359a4d1cb4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {app, auth}
