import firebase from 'firebase';
require('firebase/auth')

// Retrieve api key from .env
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "eventscope-1d074.firebaseapp.com",
  databaseURL: "https://eventscope-1d074-default-rtdb.firebaseio.com",
  projectId: "eventscope-1d074",
  storageBucket: "eventscope-1d074.appspot.com",
  messagingSenderId: "113299127865",
  appId: "1:113299127865:web:b737850a295e7db9a0d7e8",
  measurementId: "G-ZK1SWLQ2LX"
};

// Initialize the Firebase App 
const firebaseApp=firebase.initializeApp(firebaseConfig);

// Get the Firestore database.
// If you want to use the realtime database, this has to be changed
const db=firebase.firestore();

export default db;