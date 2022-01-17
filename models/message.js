const Schema = require("mongoose").Schema;
const mongoose = require("mongoose");

const MessageSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "Rooms",
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  msg: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now().toString(),
  },
});

module.exports = mongoose.model("Messages", MessageSchema);
