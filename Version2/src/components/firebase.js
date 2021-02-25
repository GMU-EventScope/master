import firebase from 'firebase';
require('firebase/auth')
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbU6ceoa4vDnNSoOSI5DLdVEpV8jm_cZ4",
  authDomain: "eventscope-1d074.firebaseapp.com",
  databaseURL: "https://eventscope-1d074-default-rtdb.firebaseio.com",
  projectId: "eventscope-1d074",
  storageBucket: "eventscope-1d074.appspot.com",
  messagingSenderId: "113299127865",
  appId: "1:113299127865:web:b737850a295e7db9a0d7e8",
  measurementId: "G-ZK1SWLQ2LX"
};
const firebaseApp=firebase.initializeApp(firebaseConfig);
const db=firebase.firestore();

export default db;