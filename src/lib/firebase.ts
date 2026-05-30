import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function hasValue(value?: string) {
  return !!value && value !== 'undefined' && !value.includes('your_');
}

// Check if credentials exist and are not placeholders.
export const isFirebaseConfigured = !!(
  hasValue(firebaseConfig.apiKey) &&
  hasValue(firebaseConfig.authDomain) &&
  hasValue(firebaseConfig.projectId) &&
  hasValue(firebaseConfig.appId)
);

let app: ReturnType<typeof initializeApp> | null = null;
let db: any = null;
let auth: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase failed to initialize:', error);
  }
} else {
  console.log('Firebase credentials not detected. Falling back to secure in-memory local state simulation.');
}

export { app, db, auth, firebaseConfig };
