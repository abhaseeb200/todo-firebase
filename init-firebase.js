const firebaseConfig = {
    apiKey: "AIzaSyAJ-xJ3eN860BVKkfi9NQMxApCapplD550",
    authDomain: "todo-app-3533d.firebaseapp.com",
    projectId: "todo-app-3533d",
    storageBucket: "todo-app-3533d.appspot.com",
    messagingSenderId: "1036734789803",
    appId: "1:1036734789803:web:395f03ce161638b4729fee",
    measurementId: "G-H4KF5LGHKQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();