const mongoose = require("mongoose");
const moment = require("moment");

const RoomSchema = new mongoose.Schema({
  room_name: {
    type: String,
    require: true,
  },

  messages: [
    {
      text: {
        type: String,
        require: true,
      },
      username: String,
      date: {
        type: String,
        default: moment().format("h:mm a"),
      },
    },
  ],
});

module.exports = mongoose.model("Room", RoomSchema);
