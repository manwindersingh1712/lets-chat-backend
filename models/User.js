const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roomIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rooms",
      },
    ],
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
