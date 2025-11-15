// Firebase configuration and initialization
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern with lazy initialization)
let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;
let _storage: FirebaseStorage | undefined;

function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Server-side: always create new instances for each request
    const serverApp = initializeApp(firebaseConfig, `server-${Date.now()}`);
    return {
      app: serverApp,
      auth: getAuth(serverApp),
      db: getFirestore(serverApp),
      storage: getStorage(serverApp),
    };
  }

  // Client-side: use singleton pattern
  if (!_app) {
    if (!getApps().length) {
      _app = initializeApp(firebaseConfig);
    } else {
      _app = getApps()[0];
    }
    _auth = getAuth(_app);
    _db = getFirestore(_app);
    _storage = getStorage(_app);
  }

  return { app: _app, auth: _auth, db: _db, storage: _storage };
}

// For backward compatibility, export as before but with lazy initialization
export const db = new Proxy({} as Firestore, {
  get: (target, prop) => {
    return (initializeFirebase().db as any)[prop];
  }
});

export const auth = new Proxy({} as Auth, {
  get: (target, prop) => {
    return (initializeFirebase().auth as any)[prop];
  }
});

export const storage = new Proxy({} as FirebaseStorage, {
  get: (target, prop) => {
    return (initializeFirebase().storage as any)[prop];
  }
});

export const app = new Proxy({} as FirebaseApp, {
  get: (target, prop) => {
    return (initializeFirebase().app as any)[prop];
  }
});


