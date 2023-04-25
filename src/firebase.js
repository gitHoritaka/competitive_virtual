
import { initializeApp } from 'firebase/app';
import { getAuth,GoogleAuthProvider } from 'firebase/auth';
import {getFirestore} from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  collection_name:process.env.REACT_APP_FIREBASE_COLLECTION_NAME,
};
//
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const clname = firebaseConfig.collection_name
export {app,auth,provider,db,clname}
