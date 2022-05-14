const username_doc = document.getElementById("username-chat");
const avatar_doc = document.getElementById("avatar-chat");
const send_btn = document.getElementById("send-btn");

//  await User.findOneAndUpdate(
//    {
//      username: username,
//    },
//    {
//      $push: {
//        rooms: [
//          {
//            room_name: username,
//            messages: [{ text: "Hello" }],
//          },
//        ],
//      },
//    },
//    { upsert: true }
//  );

const url = window.location.href;
const info = url.split("?")[1];
const userInfo = info.split("&");

const username = userInfo[0].split("=")[1];
const id = userInfo[1].split("=")[1];

username_doc.innerHTML = username;
avatar_doc.innerHTML = username.split("")[0];

// Connect to socket.io
var socket = io.connect("http://localhost:5000");

//Check for connection
if (socket !== undefined) {
  // Join chatroom
  console.log("connected to chat room");
  socket.emit("joinRoom", { username, id });
}

//Message submit
send_btn.addEventListener("click", () => {});
