/*
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
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIEU6LW4wFbStDN8VVKROkx1R2CBVXCyo",
  authDomain: "blog-a48ef.firebaseapp.com",
  projectId: "blog-a48ef",
  storageBucket: "blog-a48ef.appspot.com",
  messagingSenderId: "686096451956",
  appId: "1:686096451956:web:0ecb83145e1bda21720421"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const clname = firebaseConfig.collection_name
export {app,auth,provider,db,clname}