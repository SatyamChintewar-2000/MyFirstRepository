import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAquHOs6Bt21Minwvocbb5DixlQLJ0P4E",
  authDomain: "first-firebase-p-6a448.firebaseapp.com",
  databaseURL: "https://first-firebase-p-6a448-default-rtdb.firebaseio.com",
  projectId: "first-firebase-p-6a448",
  storageBucket: "first-firebase-p-6a448.firebasestorage.app",
  messagingSenderId: "671048888169",
  appId: "1:671048888169:web:f9c318184ce939e19397f8",
  measurementId: "G-SZKQN4YSZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Check if we are in testing mode and disable app verification
if (window.location.hostname === "https://9e7c-183-82-100-26.ngrok-free.app") {
    console.log("it's ngrccok")
  // Add this guard to ensure `auth.settings` exists
  if (auth.settings) {
    auth.settings.appVerificationDisabledForTesting = true;
    console.log("App verification disabled for testing.");
  } else {
    console.warn("auth.settings is not available.");
  }
}

// Export required instances
export { app, auth, RecaptchaVerifier, db };
