import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://recommendations-ltd-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const clientsRecommendsInDB = ref(database, "clientsRecommends")

const messageContentEl = document.getElementById("message-content")
const senderInputEl = document.getElementById("sender-input")
const receiverInputEl = document.getElementById("receiver-input")
const publishButtonEl = document.getElementById("publish-button")
const messagesListEl = document.getElementById("messages-list")
 
publishButtonEl.addEventListener("click", function() {
    let messageContent = messageContentEl.value
    let senderInput = senderInputEl.value
    let receiverInput = receiverInputEl.value
    if(messageContent === '' || senderInput === '' || receiverInput === '') {
        console.log("Please fill all the fields before publishing")
    }
    else {
        let newMessage = {
            sender: senderInput,
            receiver: receiverInput,
            content: messageContent,
            likeButton: "🖤",
            likes: 0
        }
        push(clientsRecommendsInDB, newMessage)
        clearInputFieldsEls()
    }
})

onValue(clientsRecommendsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let messagesArray = Object.entries(snapshot.val()).reverse()
        clearMessagesListEl()
        
        for (let i = 0; i < messagesArray.length; i++) {   
            appendToMessagesListEl(messagesArray[i])
        } 
    } 
})

function appendToMessagesListEl(message) {
    let messageID = message[0]
    let messageInfo = message[1]
    
    let newEl = document.createElement("li") 
    newEl.innerHTML = `<p id="receiver-text">To ${messageInfo.receiver}</p>
        <p id="main-content">${messageInfo.content}</p>
        <div id="content-last-row">
            <p id="sender-text">From ${messageInfo.sender}</p>
            <button id="heart-button">${messageInfo.likeButton} ${messageInfo.likes}</button>
        </div>`
    messagesListEl.append(newEl)
    
    const heartButtonEl = newEl.querySelector("#heart-button")
    
    heartButtonEl.addEventListener("click", function() {
        if(messageInfo.likeButton === "🖤") {
            messageInfo.likeButton = "❤️"
            messageInfo.likes++
        }
        else {
            messageInfo.likeButton = "🖤"
            messageInfo.likes--
        }
        const messageRef = ref(database, `clientsRecommends/${messageID}`);
        set(messageRef, messageInfo)
    })
}

function clearInputFieldsEls() {
    messageContentEl.value = ''
    senderInputEl.value = ''
    receiverInputEl.value = ''
}

function clearMessagesListEl() {
    messagesListEl.innerHTML = ''
}