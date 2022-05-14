const mongoose = require("mongoose");
const moment = require("moment");

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
  rooms: [
    {
      room_name: String,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
