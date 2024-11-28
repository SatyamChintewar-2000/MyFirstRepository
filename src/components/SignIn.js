import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../util/firebase"; // Import Firebase configuration

const db = getFirestore(app);
const auth = getAuth(app);
auth.languageCode = "en";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(null); // Store mobile number here

  // Login with email and password
  const loginWithEmailPassword = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const usersCollection = collection(db, "users");

      const q = query(usersCollection, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          console.log("User data:", userData);

          const fetchedMobileNumber = userData.mobilenumber; // Retrieve the mobile number
          if (fetchedMobileNumber) {
            setMobileNumber(fetchedMobileNumber); // Save the mobile number in the state
            setMessage(`Phone number retrieved: ${fetchedMobileNumber}. Click to send OTP.`);
          } else {
            setMessage("No phone number found for this user.");
          }
        });
      } else {
        setMessage("User data not found in the database.");
      }
    } catch (error) {
      setMessage(`Error during login: ${error.message}`);
    }
  };

  // Send OTP after user logs in
  const sendPhoneOTP = () => {
    if (!mobileNumber) {
      setMessage("No phone number available to send OTP.");
      return;
    }

    // Initialize the reCAPTCHA verifier
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible", // or 'normal'
          callback: (response) => {
            console.log("Recaptcha Verified first");
          },
          "expired-callback": () => {
            console.log("Recaptcha expired. Solve again.");
          },
        },
        auth
      );
    }

    // Trigger OTP sending to the phone number
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, mobileNumber, appVerifier)
      .then((confirmationResult) => {
        console.log("OTP sent successfully to: " + mobileNumber);
        setConfirmationResult(confirmationResult);
        setOtpStep(true); // Change app state to OTP input step
        setMessage("OTP sent successfully. Please check your phone.");
      })
      .catch((error) => {
        console.error("Error sending OTP:", error.message);
        setMessage(`Error sending OTP: ${error.message}`);
      });
  };

  // Verify OTP
  const verifyOTP = async () => {
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otp);
        setMessage(`Phone number verified. Welcome, ${result.user.email}`);
      } else {
        setMessage("Please request an OTP first.");
      }
    } catch (error) {
      setMessage(`Error verifying OTP: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Login with Email/Password & Phone OTP</h1>
      {!otpStep ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={loginWithEmailPassword}>Login</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </>
      )}

      <button onClick={sendPhoneOTP} disabled={!mobileNumber || otpStep}>
        Send OTP
      </button>

      <div id="recaptcha-container"></div> {/* Firebase will render the invisible reCAPTCHA here */}
      <p>{message}</p>
    </div>
  );
}

export default SignIn;
