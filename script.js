
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-analytics.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEN3OTrYgecGvqZzIvjuGx4IVFinc3MJI",
  authDomain: "second-database-2a9f4.firebaseapp.com",
  databaseURL: "https://second-database-2a9f4-default-rtdb.firebaseio.com",
  projectId: "second-database-2a9f4",
  storageBucket: "second-database-2a9f4.appspot.com",
  messagingSenderId: "802036760379",
  appId: "1:802036760379:web:087e928398138695ba011e",
  measurementId: "G-RTZVYWX0CV"
};

// Initialize Firebase and DOM
const app = initializeApp(firebaseConfig);
let auth = fbauth.getAuth(app);
const analytics = getAnalytics(app);

let db = rtdb.getDatabase(app);
let titleRef = rtdb.ref(db, "/");
let chatsRef = rtdb.child(titleRef, 'chats');


let inputMessage = document.getElementById('inputMessage')
let submitChat = document.getElementById('button')
let deleteButton = document.getElementById('clearChats')
let listOfChats = document.getElementById('list-of-chats')
let username = document.getElementById('username')

let email = '';


/////////////////////////////////////////////////////


let renderUser = function (userObj) {
  //$("#app").html(JSON.stringify(userObj));
  $("#app").append(`<button type="button" class='btn btn-secondary' id="logout">Logout</button>`);
  $("#logout").on("click", () => {
    fbauth.signOut(auth);
    console.log('signed out')
  })
}

fbauth.onAuthStateChanged(auth, user => {
  if (user) {
    email = user.email;
    console.log(email, 'is signed in')
    $("#login-box").hide();
    $("#app").show();
    renderUser(user);
  } else {
    $("#login-box").show();
    $("#app").hide();
    console.log('no user detected')
  }
});




$(`#register`).on(`click`, () => {
  let email = $(`#email`).val()
  let password = $(`#password`).val()

  fbauth.createUserWithEmailAndPassword(auth, email, password).then(somedata => {
    let uid = somedata.user.uid;
    let userRoleRef = rtdb.ref(db, `/users/${uid}/roles/user`);
    rtdb.set(userRoleRef, true);
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });

})


$('#sign-in').on('click', () => {
  let email = $(`#email`).val()
  let password = $(`#password`).val()

  fbauth.signInWithEmailAndPassword(auth, email, password).then(
    somedata => {
      console.log(somedata);
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });

})





//Get all chats and update window
rtdb.onValue(chatsRef, ss => {
  let allChats = ss.val();
  listOfChats.innerHTML = '';
  //Loop through chats and append them  
  for (const chat in allChats) {
    let displayedMessage = document.createElement('li');
    let username = document.createElement('span');
    listOfChats.appendChild(displayedMessage)
    displayedMessage.innerText = allChats[chat].message

    // console.log(allChats[chat].user)
    username.innerText = allChats[chat].user
    username.classList.add('chatter')
    displayedMessage.appendChild(username)

    displayedMessage.id = chat;
    displayedMessage.addEventListener('dblclick', function () { testFunction(displayedMessage.id) }

    );
  }
});

//rtdb.set(peopleRef, 'tacoo');

//rtdb.update(peopleRef,newGuy);

const editDatabase = (chatID, editedMessage) => {
  let messageRef = rtdb.child(chatsRef, `${chatID}`);
  rtdb.update(messageRef, { 'message': editedMessage });
  //rtdb.push(chatsRef, 'hi');
}

const testFunction = (chatID) => {
  openEditWindow(chatID)
  //editDatabase(chatID)
};


const openEditWindow = (chatID) => {
  const chatElement = document.getElementById(`${chatID}`);
  let editWindow = document.createElement('input');
  let editSumbitButton = document.createElement('button');
  editSumbitButton.innerText = 'Edit You Coward'
  editSumbitButton.addEventListener('click', function () { editDatabase(chatID, editWindow.value) });
  chatElement.appendChild(editWindow);
  chatElement.appendChild(editSumbitButton);
}


//Functions

const sendChat = () => {
  //let sender = username.value;

  let chatObject = {
    'message': inputMessage.value,
    'user': email
  }
  rtdb.push(chatsRef, chatObject);

  //let's just try and push and object
  //rtdb.push(chatsRef, { 'hi': 'hey', 'sup': 'bro' })

  //Then clear the box
  inputMessage.value = '';
}

const deleteChat = () => {
  rtdb.set(chatsRef, '')

}

submitChat.addEventListener("click", sendChat);
deleteButton.addEventListener("click", deleteChat);

