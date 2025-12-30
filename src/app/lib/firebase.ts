import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByd5sxYgZV1kYygpNbx0ADFKVBDRnLZMk",
  authDomain: "quick-mart-52e86.firebaseapp.com",
  projectId: "quick-mart-52e86",
  storageBucket: "quick-mart-52e86.appspot.com",
  messagingSenderId: "1002359745586",
  appId: "1:1002359745586:web:8258819c91cc427bb1e02b",
  measurementId: "G-7XNMWBSN07"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Persistence not supported by browser');
  } else {
    console.error('Persistence error:', err);
  }
});

