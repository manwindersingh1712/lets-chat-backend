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
    name: {
      type: String,
      required: true,
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
