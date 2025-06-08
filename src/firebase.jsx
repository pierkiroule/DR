// firebase.jsx
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Ta config Firebase RTDB (remplace par ta config exacte si besoin)
const firebaseConfig = {
  apiKey: "AIzaSyCczdBoTbwcJlUVZPNocc0UlHUmaN0DMHY",
  authDomain: "bubblemapar.firebaseapp.com",
  databaseURL: "https://bubblemapar-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bubblemapar",
  storageBucket: "bubblemapar.appspot.com",
  messagingSenderId: "86688271888",
  appId: "1:86688271888:web:268324fec2a13881bca453"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Exporte la RTDB (Realtime Database)
export const db = getDatabase(app); // <-- correspond à l'import dans ARProvider