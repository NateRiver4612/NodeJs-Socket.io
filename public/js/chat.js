const username_doc = document.getElementById("username-chat");
const avatar_doc = document.getElementById("avatar-chat");
const chat_form = document.getElementById("chat-form");
const conversation_doc = document.getElementById("conversation");

const url = window.location.href;
const info = url.split("?")[1];
const userInfo = info.split("&");

const person_name = userInfo[0].split("=")[1];
const id = userInfo[1].split("=")[1];
const current_username = userInfo[2].split("=")[1];

console.log(person_name, id, current_username);

username_doc.innerHTML = person_name;
avatar_doc.innerHTML = person_name.split("")[0];

// Connect to socket.io
var socket = io.connect("http://localhost:5000");

//Check for connection
if (socket !== undefined) {
  // Join chatroom
  console.log("connected to chat room");
  socket.emit("joinRoom", { person_name, id, current_username });

  //Catch load chats for users
  socket.on("load_chats", async ({ room_chats }) => {
    let html = "";
    room_chats.messages.map((chat) => {
      html += `<div
       class="message ${
         chat.username == current_username ? "their-message" : " my-message"
       }">${chat.text}
                <span class="time">${chat.date}</span>
              </div>`;
    });

    conversation_doc.innerHTML = html;
  });
}

//Message submit
chat_form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.text.value;
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  console.log("Send message");

  // Emit message to server
  socket.emit("chat_message", { person_name, id, current_username, msg });

  // Clear input
  e.target.elements.text.value = "";
  e.target.elements.text.focus();
});
