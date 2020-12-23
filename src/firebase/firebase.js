import * as firebase from "firebase";
import "firebase/firestore";

let config = {
  apiKey: "AIzaSyCuqeVdBEEYxmGCQroAi1q22CKF0V6ovHA",
  authDomain: "controller1-67261.firebaseapp.com",
  databaseURL: "https://controller1-67261.firebaseio.com",
  projectId: "controller1-67261",
  storageBucket: "controller1-67261.appspot.com",
  messagingSenderId: "12619974109",
  appId: "1:12619974109:web:c5b43ae73b84080507a234"
};

firebase.initializeApp(config);

export default firebase.firestore();
