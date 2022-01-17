const Schema = require("mongoose").Schema;
const mongoose = require("mongoose");

const RoomSchema = new Schema({
  users: {
    type: [Schema.Types.ObjectId],
    ref: "Users",
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Rooms", RoomSchema);
