
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-analytics.js";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let db = rtdb.getDatabase(app);
let titleRef = rtdb.ref(db, "/");
let chatsRef = rtdb.child(titleRef, 'chats');

let inputMessage = document.getElementById('inputMessage')
let submitChat = document.getElementById('button')
let deleteButton = document.getElementById('clearChats')
let listOfChats = document.getElementById('list-of-chats')
let username = document.getElementById('username')




//Get all chats and update window
rtdb.onValue(chatsRef, ss => {
  let allChats = ss.val();
  listOfChats.innerHTML = '';
  //Loop through chats and append them
  for (const chat in allChats) {
    let displayedMessage = document.createElement('li');
    listOfChats.appendChild(displayedMessage)
    displayedMessage.innerText = allChats[chat].message
    displayedMessage.id = chat;
    displayedMessage.addEventListener('dblclick', function () { testFunction(displayedMessage.id) }

    );
  }
});

//rtdb.set(peopleRef, 'tacoo');

//rtdb.update(peopleRef,newGuy);

const editDatabase = (chatID, editedMessage) => {
  let newMessage = `{${chatID}:heyyyyo}`;
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
    'message': inputMessage.value
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

