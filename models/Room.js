const Schema = require("mongoose").Schema;
const mongoose = require("mongoose");

const RoomSchema = new Schema({
  users: {
    type: [String],
    ref: "Users",
  },
  name: {
    type: String,
    required: true,
  },
  timestamps: { createdAt: true, updatedAt: true },
});

module.exports = mongoose.model("Rooms", RoomSchema);
