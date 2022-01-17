const Schema = require("mongoose").Schema;
const mongoose = require("mongoose");

const MessageSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
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
  },
  {
    _id: false,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
