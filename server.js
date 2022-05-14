const mongo = require("mongodb").MongoClient;
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
var mongoose = require("mongoose");

const User = require("./models/user.model");

const app = express();
const server = http.createServer(app);
const client = require("socket.io").listen(5000).sockets;

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Connect to mongo
mongoose.connect("mongodb://localhost:27017/mongochat", function (err, db) {
  if (err) {
    throw err;
  }

  console.log("MongoDB connected...");

  // Connect to Socket.io
  client.on("connection", async function (socket) {
    // Welcome new user
    socket.emit("welcome_user", "Welcome to ChatCord!");

    //Catch add_user event
    socket.on("add_user", async (username) => {
      await User.findOneAndUpdate(
        {
          username: username,
        },
        { username: username, id: socket.id, status: true },
        { upsert: true }
      );

      //Load all the users
      const user_list = await User.find({});
      socket.emit("load_users", user_list);
    });

    // Runs when client disconnects
    socket.on("disconnect", async () => {
      const user = await User.findOneAndUpdate(
        { id: socket.id },
        { status: false }
      );
      if (user) {
        console.log(`${user.username} has left the chat`);

        //Load all the users
        const user_list = await User.find({});
        socket.emit("load_users", user_list);
      }
    });

    //Catch joint room from client
    socket.on("joinRoom", async ({ username, id }) => {
      console.log(`You are now chat with ${username}`);
    });
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
