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
    type: Boolean,
    default: false,
  },
  rooms: [
    {
      room_name: String,
      messages: [
        {
          text: {
            type: String,
            require: true,
          },
          date: {
            type: String,
            default: moment().format("h:mm a"),
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
