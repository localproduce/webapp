import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAbabxzRptk1SNQ6evg_4GSO08E_QwxVRs",
  authDomain: "localproduce-1.firebaseapp.com",
  databaseURL: "https://localproduce-1.firebaseio.com",
  projectId: "localproduce-1",
  storageBucket: "localproduce-1.appspot.com",
  messagingSenderId: "231685879926",
  appId: "1:231685879926:web:2e8a8bf70d3b3fd6998757"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
