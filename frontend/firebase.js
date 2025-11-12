// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "encore-luxe.firebaseapp.com",
    projectId: "encore-luxe",
    storageBucket: "encore-luxe.firebasestorage.app",
    messagingSenderId: "12718744083",
    appId: "1:12718744083:web:48cebf60c31246a9cad5e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {app, auth}