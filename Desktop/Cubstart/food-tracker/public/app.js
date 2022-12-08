import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { getFirestore, addDoc, collection, query, where, getDocs, Timestamp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

// does this show up

//////// QUESTION 1: Configuring your Firebase Project ////////
const firebaseConfig = {
    apiKey: "AIzaSyB6VQl_VsqpIxWTkAR74bEa8NcTw24tyy0",
    authDomain: "foodaily-fa6cd.firebaseapp.com",
    projectId: "foodaily-fa6cd",
    storageBucket: "foodaily-fa6cd.appspot.com",
    messagingSenderId: "672709451827",
    appId: "1:672709451827:web:6c7b6d1c50e8598a628346"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

signInBtn.onclick = () => signInWithPopup(auth, provider);

signOutBtn.onclick = () => {
    signOut(auth, provider);
    location.reload()
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

///// Firestore /////

const db = getFirestore(app);

const createEntry = document.getElementById('createEntry');
const entryList = document.getElementById('entryList');
// const entryText = document.getElementById('entryText');
// added new text fields
const nameText = document.getElementById('nameText');
const typeText = document.getElementById('typeText');
const calText = document.getElementById('calText');


let entryRef = collection(db, "entries")

let findEntries  = async (user) => {
    const q = query(entryRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    // Code for Testing: This prints all the documents/entries you found and their IDs in the console (Browser Developer Tools)
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });


    const items = querySnapshot.docs.map(doc => {
        return `<li>${doc.data().timestamp.toDate().toDateString()}: ${doc.data().name} ${doc.data().type} ${doc.data().calories}</li>`
    });

    entryList.innerHTML = items.join('');
}

onAuthStateChanged(auth, (user) => {
    if (user) {

        findEntries(user)

        createEntry.onclick = async () => {
            let timestamp = Timestamp.now()
            console.log(timestamp)
            const newEntryRef = await addDoc(entryRef, {
                uid: user.uid,
                // entry: entryText.value,
                timestamp: timestamp,
                name: nameText.value,
                type: typeText.value,
                calories: calText.value,
            });

            // entryText.value = ""
            console.log("Document written at", newEntryRef.timestamp);
            findEntries(user)
        }

        //clearEntries.onclick = async () {
        //    entryList = []
        // }
    }
});