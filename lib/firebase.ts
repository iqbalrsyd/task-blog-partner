import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoKey',
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mochi-house.firebaseapp.com',
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mochi-house',
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mochi-house.appspot.com',
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456'
};

// Initialize Firebase only if not already initialized
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const firebaseApp = app;
export const db = getFirestore(app);
export const storage = getStorage(app);

// Cloud Messaging is intentionally optional here so the app can build
// even before browser notification setup is configured.
export const messaging = async () => null;

export default app;
