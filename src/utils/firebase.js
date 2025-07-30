// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAE0lbBhXVBZOn03ZQnYhpVqx_YdJ22474",
  authDomain: "mayrahkee-third-party-service.firebaseapp.com",
  projectId: "mayrahkee-third-party-service",
  storageBucket: "mayrahkee-third-party-service.appspot.com",
  messagingSenderId: "593408440155",
  appId: "1:593408440155:web:334514b19379889c3b8c7e",
  databaseUrl:
    "https://console.firebase.google.com/u/0/project/mayrahkee-third-party-service/database/mayrahkee-third-party-service-default-rtdb/data/~2F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
