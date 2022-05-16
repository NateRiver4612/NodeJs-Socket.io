const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  id: {
    type: String,
  },
  status: {
    type: String,
    default: "false",
  },
  chat_with: {
    type: String,
    default: "",
  },
  rooms: [
    {
      room_name: String,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
