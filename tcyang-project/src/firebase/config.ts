// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 您的 Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyAQDKgv2eMgd_p-DOk1qbIqDG8xDvWcG94",
  authDomain: "class424-449f5.firebaseapp.com",
  projectId: "class424-449f5",
  storageBucket: "class424-449f5.appspot.com",
  messagingSenderId: "1027615582021",
  appId: "1:1027615582021:web:36d659e1e1d18ff0e30b91"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 