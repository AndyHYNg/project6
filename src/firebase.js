import firebase from "firebase";

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDSS11EpFBkitxkVvyw6mFANsNgvCHssyo",
    authDomain: "cinemacrew-300cf.firebaseapp.com",
    databaseURL: "https://cinemacrew-300cf.firebaseio.com",
    projectId: "cinemacrew-300cf",
    storageBucket: "cinemacrew-300cf.appspot.com",
    messagingSenderId: "93148126876"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
