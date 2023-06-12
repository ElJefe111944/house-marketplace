import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbl-tsOJfWQUcewa0Fwb94kBYvOYBrwHM",
  authDomain: "house-market-place-app-57e96.firebaseapp.com",
  projectId: "house-market-place-app-57e96",
  storageBucket: "house-market-place-app-57e96.appspot.com",
  messagingSenderId: "971355605515",
  appId: "1:971355605515:web:9c442688bfb79a6826550e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();