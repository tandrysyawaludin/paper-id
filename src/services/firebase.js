import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyBGsci3c-JdsYhJ7ZcqieHx_qamYcthY-A",
  authDomain: "paper-id-96d8e.firebaseapp.com",
  databaseURL: "https://paper-id-96d8e.firebaseio.com",
  projectId: "paper-id-96d8e",
  storageBucket: "paper-id-96d8e.appspot.com",
  messagingSenderId: "1060161130270",
  appId: "1:1060161130270:web:64967f954dddcf6006830f",
  measurementId: "G-Y3KDRHE9JC",
};
// Initialize Firebase
firebase.initializeApp(config);

export default firebase;
