// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFlyGmRQlX3Er8Rt3PacVeKJ3JiHn3cu8",
  authDomain: "householddb-38a23.firebaseapp.com",
  projectId: "householddb-38a23",
  storageBucket: "householddb-38a23.appspot.com",
  messagingSenderId: "605714323759",
  appId: "1:605714323759:web:cbc2e996030c560a68a9da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};