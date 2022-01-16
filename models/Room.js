const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  chat: {
    type: Array[
      {
        from: {
          type: String,
          required: true,
        },
        to: {
          type: String,
          required: true,
        },
      }
    ],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roomIds: {
    type: Array[String],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
