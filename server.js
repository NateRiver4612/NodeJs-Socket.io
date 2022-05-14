const mongo = require("mongodb").MongoClient;
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
var mongoose = require("mongoose");

const User = require("./models/user.model");
const Room = require("./models/room.model");

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
    socket.on("joinRoom", async ({ person_name, current_username, id }) => {
      console.log(`You are now chat with ${person_name}`);

      //Load rooms and messages for current user
      const room_chats = await Room.findOne({ room_name: current_username });
      socket.emit("load_chats", { room_chats });

      //Add room for person
      await User.findOneAndUpdate(
        {
          username: person_name,
        },
        {
          rooms: [
            {
              room_name: current_username,
            },
          ],
        },
        { upsert: true }
      );

      //Add person for room
      await Room.findOneAndUpdate(
        { room_name: person_name },
        {},
        { upsert: true }
      );

      //Add current_user for room
      await Room.findOneAndUpdate(
        { room_name: current_username },
        {},
        { upsert: true }
      );

      //Add room for person
      await User.findOneAndUpdate(
        {
          username: current_username,
        },
        {
          rooms: [
            {
              room_name: person_name,
            },
          ],
        },
        { upsert: true }
      );
    });

    //Catch chat message from client
    socket.on(
      "chat_message",
      async ({ person_name, id, current_username, msg }) => {
        console.log("Right here");
        //Add message to person room
        await Room.findOneAndUpdate(
          { room_name: person_name },
          {
            $push: {
              messages: [
                {
                  text: msg,
                  username: current_username,
                },
              ],
            },
          }
        );

        //Add message to person room
        await Room.findOneAndUpdate(
          { room_name: current_username },
          {
            $push: {
              messages: [
                {
                  text: msg,
                  username: current_username,
                },
              ],
            },
          }
        );

        //Load rooms and messages for current user
        const room_chats = await Room.findOne({ room_name: current_username });
        console.log(room_chats);
        socket.emit("load_chats", { room_chats });
      }
    );
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
