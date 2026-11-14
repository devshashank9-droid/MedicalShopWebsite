import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  setLogLevel,
  Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let db: Firestore | null = null;

if (isFirebaseConfigured) {
  const isNewApp = !getApps().length;
  const app = isNewApp ? initializeApp(firebaseConfig) : getApp();

  // Prevent Next.js dev overlay from popping up on brief Wi-Fi drops
  setLogLevel("silent");

  if (isNewApp) {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } else {
    db = getFirestore(app);
  }
}

export { db };