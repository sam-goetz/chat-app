
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
let usersRef = rtdb.child(titleRef, 'users');


let inputMessage = document.getElementById('inputMessage')
let submitChat = document.getElementById('button')
let deleteButton = document.getElementById('clearChats')
let listOfChats = document.getElementById('list-of-chats')
let username = document.getElementById('username')

let email = '';
let userID = '';


/////////////////////////////////////////////////////


let renderUser = function (userObj) {
  //$("#app").html(JSON.stringify(userObj));
  $("#app").append(`<button type="button" class='btn btn-secondary' id="logout">Logout</button>`);
  $("#logout").on("click", () => {
    fbauth.signOut(auth);
    location.reload();
    console.log('signed out')
  })
}

fbauth.onAuthStateChanged(auth, user => {
  if (user) {
    email = user.email;
    userID = user.uid;
    console.log(email, 'is signed in', userID)
    $("#login-box").hide();
    $("#app").show();
    renderUser(user);
  } else {
    $("#login-box").show();
    $("#app").hide();
    console.log('no user detected')
  }
});


//register

$(`#register`).on(`click`, () => {
  email = $(`#email`).val()
  let password = $(`#password`).val()


  fbauth.createUserWithEmailAndPassword(auth, email, password).then(somedata => {
    let uid = somedata.user.uid;
    email = $(`#email`).val()

    let userPackage = {
      "email": email,
      "roles": {
        "user": true,
        "admin": false
      }
    }

    let userRef = rtdb.ref(db, `/users/${uid}`);
    rtdb.set(userRef, userPackage).then(() => {
      let userRoleRef = rtdb.ref(db, `/users/${uid}/roles/user`);
      rtdb.set(userRoleRef, true);
      location.reload();
    });


  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
})

//Sign in
$('#sign-in').on('click', () => {
  let email = $(`#email`).val()
  let password = $(`#password`).val()

  fbauth.signInWithEmailAndPassword(auth, email, password).then(
    somedata => {
      console.log(somedata);
      location.reload();
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
})

//Delete users
$('#deleteEmailButton').on('click', () => {
  let email = $(`#deleteEmail`).val()
  // fbauth.getUserByEmail(email).then((somedata)
  //   console.log(somedata);
  // )

  fbauth.getUserByEmail(email).then(
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

//Get all rtdb users and display them, with admin buttons
rtdb.onValue(usersRef, ss => {
  let users = ss.val();
  $('#list-of-users').html('');

  for (const user in users) {
    let userElt = document.createElement('li')
    userElt.innerText = users[user].email;
    userElt.setAttribute('id', user)

    let makeAdminBtn = document.createElement('button');
    makeAdminBtn.innerText = 'Make Admin';
    makeAdminBtn.setAttribute('id', `${user}-make-admin`);
    makeAdminBtn.classList.add(`btn`, 'btn-sm', 'btn-success', 'mx-1', 'my-1')
    makeAdminBtn.addEventListener('click', function () {
      makeAdmin(makeAdminBtn.id)
    });

    let deleteAdminBtn = document.createElement('button');
    deleteAdminBtn.innerText = 'Delete Admin';
    deleteAdminBtn.setAttribute('id', `${user}-delete-admin`)
    deleteAdminBtn.classList.add(`btn`, 'btn-sm', 'btn-warning', 'mx-1', 'my-1')
    deleteAdminBtn.addEventListener('click', function () {
      deleteAdmin(deleteAdminBtn.id)
    });

    let deleteUserBtn = document.createElement('button');
    deleteUserBtn.innerText = 'Delete User';
    deleteUserBtn.setAttribute('id', `${user}-delete-user`)
    deleteUserBtn.classList.add(`btn`, 'btn-sm', 'btn-danger', 'mx-1', 'my-1')
    deleteUserBtn.addEventListener('click', function () {
      deleteUser(deleteUserBtn.id)
    });

    userElt.append(makeAdminBtn)
    userElt.append(deleteAdminBtn)
    userElt.append(deleteUserBtn)

    $('#list-of-users').append(userElt)

  }
})

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
    'user': email,
    'uid': userID
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

const makeAdmin = (id) => {
  let uid = id.split('-')[0]
  let userAdminRef = rtdb.ref(db, `/users/${uid}/roles/admin`);
  rtdb.set(userAdminRef, true);
}

const deleteAdmin = (id) => {
  let uid = id.split('-')[0]
  let userAdminRef = rtdb.ref(db, `/users/${uid}/roles/admin`);
  rtdb.set(userAdminRef, false);
}

const deleteUser = (id) => {
  let uid = id.split('-')[0]
  let userRef = rtdb.ref(db, `/users/${uid}`);
  rtdb.set(userRef, {});
  console.log('please delete the user')
}

submitChat.addEventListener("click", sendChat);
deleteButton.addEventListener("click", deleteChat);

