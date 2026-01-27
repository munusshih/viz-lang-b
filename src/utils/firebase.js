import { getAnalytics, isSupported } from "firebase/analytics";
import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.PUBLIC_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const db = getDatabase(app);

let analyticsPromise = null;

export function getFirebaseApp() {
  return app;
}

export function getFirebaseDb() {
  return db;
}

export async function getFirebaseAnalytics() {
  if (typeof window === "undefined") return null;
  if (!analyticsPromise) {
    analyticsPromise = isSupported().then((ok) => (ok ? getAnalytics(app) : null));
  }
  return analyticsPromise;
}
